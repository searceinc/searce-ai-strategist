import { hubspotFetch } from "./client.js";

/**
 * Maps the CRM tokens the model is instructed to emit (see
 * prompts/format-structures.ts) to HubSpot's own contact personalization
 * tokens. [Your Name] is handled separately — it becomes the signed-in
 * rep's actual name (a static substitution), not a HubSpot token.
 */
const CRM_TOKEN_MAP: Record<string, string> = {
	"[FirstName]": "{{contact.firstname}}",
	"[LastName]": "{{contact.lastname}}",
	"[Company name]": "{{contact.company}}",
	"[Industry name]": "{{contact.industry}}",
};

/** Matches the template's own link color/underline (see PLAIN_TEXT_4_STYLE_SETTINGS.linksFont). */
const LINK_STYLE = "text-decoration: underline; color: #0064FF;";
/** Matches the template's body paragraph style (see module-1-0-0 in the source draft). */
const PARAGRAPH_STYLE =
	"font-size: 16px; line-height: 150%; font-weight: normal; color: #1A1A1A; margin: 0 0 16px 0;";
const LIST_STYLE = "margin: 0 0 16px 0; padding-left: 20px;";
const LIST_ITEM_STYLE = "font-size: 16px; line-height: 150%; color: #1A1A1A; margin: 0 0 8px 0;";

function escapeHtml(s: string): string {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Inline formatting: **bold**, Searce-domain [text](url) links (the only
 * links that survive the compliance pass — see output-assembler.ts), and
 * *italic*. Escape first (HTML special chars only — none of these markers
 * use &, <, >), then layer markdown substitutions on top.
 *
 * Any Searce link reaching here is one `extractCtaLink` didn't pick as the
 * CTA (e.g. a second reference link) — still rendered inline, styled to
 * match the template's own link convention.
 */
function inlineFormat(s: string): string {
	let out = escapeHtml(s);
	out = out.replace(
		/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
		(_m, label: string, url: string) =>
			`<a href="${url}" rel="noopener" style="${LINK_STYLE}">${label}</a>`,
	);
	out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
	out = out.replace(/(^|[\s([{>])\*([^\s*][^*\n]*?)\*(?=[\s).,!?;:\]}>]|$)/g, "$1<em>$2</em>");
	return out;
}

const BULLET_RE = /^\s*(?:[•▪●]|[-*])\s+(.*)$/;

interface TextBlock {
	type: "paragraph" | "list";
	lines: string[];
}

/**
 * Mirrors lib/render-markdown.tsx's tokenizeBlocks exactly — same
 * blank-line paragraph splitting, same mid-paragraph bullet-run detection —
 * so what a rep sees on screen is what lands in the HubSpot draft. Diverging
 * from that logic here is what caused paragraphs and bullets to render
 * differently (or not split at all) in HubSpot.
 */
function tokenizeBlocks(text: string): TextBlock[] {
	const paragraphs = text.split(/\n{2,}/);
	const blocks: TextBlock[] = [];
	for (const p of paragraphs) {
		const lines = p.split(/\r?\n/);
		const listItems: string[] = [];
		const paragraphLines: string[] = [];
		let mode: "list" | "paragraph" | null = null;
		for (const line of lines) {
			const m = line.match(BULLET_RE);
			if (m) {
				if (mode === "paragraph" && paragraphLines.length > 0) {
					blocks.push({ type: "paragraph", lines: paragraphLines.splice(0) });
				}
				mode = "list";
				listItems.push(m[1] ?? "");
			} else {
				if (mode === "list" && listItems.length > 0) {
					blocks.push({ type: "list", lines: listItems.splice(0) });
				}
				mode = "paragraph";
				paragraphLines.push(line);
			}
		}
		if (listItems.length > 0) blocks.push({ type: "list", lines: listItems });
		if (paragraphLines.length > 0) blocks.push({ type: "paragraph", lines: paragraphLines });
	}
	return blocks;
}

const GREETING_RE = /^(?:hi|hello|hey)\b.*,\s*$/i;

/**
 * The template's own dummy copy renders the greeting as an <h2> (bold,
 * larger) ahead of the regular body prose. Splits it off the front of the
 * body when the first block is a single short "Hi/Hello ...," line, so
 * bodyToHtml can render it distinctly from the rest.
 */
function splitGreeting(body: string): { greeting: string | null; rest: string } {
	const firstBreak = body.indexOf("\n\n");
	const firstBlock = firstBreak === -1 ? body : body.slice(0, firstBreak);
	if (!firstBlock.includes("\n") && GREETING_RE.test(firstBlock.trim())) {
		const rest = (firstBreak === -1 ? "" : body.slice(firstBreak)).replace(/^\n+/, "");
		return { greeting: firstBlock.trim(), rest };
	}
	return { greeting: null, rest: body };
}

/**
 * Markdown-ish → HTML matching the web app's rendering, styled to match the
 * "Plain Text 4" template's own typography. Inline styles are required (not
 * optional polish) — HubSpot's email template resets default <p>/<ul>
 * margins the way most email-safe HTML does, and external/embedded CSS isn't
 * reliable across email clients, so without explicit inline spacing every
 * paragraph collapses flush against the next one.
 */
function bodyToHtml(body: string): string {
	const trimmed = body.replace(/\r\n/g, "\n").trim();
	if (!trimmed) return "";
	const { greeting, rest } = splitGreeting(trimmed);
	const greetingHtml = greeting
		? `<h2 style="text-align: left; margin: 0 0 16px 0; font-weight: bold;">\n<span style="color: #1A1A1A; font-weight: bold;">${inlineFormat(greeting)}</span>\n</h2>`
		: "";
	const blocks = tokenizeBlocks(rest);
	const restHtml = blocks
		.map((block) => {
			if (block.type === "list") {
				const items = block.lines
					.map((l) => `<li style="${LIST_ITEM_STYLE}">${inlineFormat(l)}</li>`)
					.join("");
				return `<ul style="${LIST_STYLE}">${items}</ul>`;
			}
			const html = block.lines.map(inlineFormat).join("<br>");
			return `<p style="${PARAGRAPH_STYLE}">${html}</p>`;
		})
		.join("\n");
	return greetingHtml ? `${greetingHtml}\n${restHtml}` : restHtml;
}

function applyTokens(text: string, repName: string): string {
	let out = text;
	for (const [token, replacement] of Object.entries(CRM_TOKEN_MAP)) {
		out = out.split(token).join(replacement);
	}
	return out.split("[Your Name]").join(repName);
}

export function humanizeEmailLocalPart(email: string | undefined): string {
	const local = email?.split("@")[0] ?? "";
	const name = local
		.split(/[._-]+/)
		.filter(Boolean)
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join(" ");
	return name || "Searce Rep";
}

interface CtaLink {
	label: string;
	url: string;
}

/**
 * Pulls the first Searce-domain link out of the body (if any) so it can
 * become a CTA instead of an inline link — matches only searce.com/
 * *.searce.com since that's the only kind of link the compliance pass in
 * output-assembler.ts lets survive into generated content. Returns the body
 * with that link's markdown replaced by its plain label (still readable
 * prose, just no longer a clickable inline link) plus the extracted
 * {label, url}, or the original body and null if none is found.
 */
function extractCtaLink(body: string): { cleanedBody: string; cta: CtaLink | null } {
	const linkRe = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/;
	const match = body.match(linkRe);
	if (!match) return { cleanedBody: body, cta: null };
	const [full, label, url] = match as [string, string, string];
	let host = "";
	try {
		host = new URL(url).hostname.toLowerCase();
	} catch {
		return { cleanedBody: body, cta: null };
	}
	if (host !== "searce.com" && !host.endsWith(".searce.com")) {
		return { cleanedBody: body, cta: null };
	}
	return { cleanedBody: body.replace(full, label), cta: { label, url } };
}

/**
 * Renders the CTA as a padded, colored, bold <a> inside the body's own rich
 * text HTML — visually matches the template's button styling (same
 * background/text color, padding, weight) but as plain HTML we fully
 * control, rather than the native @hubspot/button_email module.
 *
 * That module was the original plan (a real, editor-native button), but its
 * public API field for the click destination couldn't be found: neither
 * HubSpot's docs nor five independently-tested field-name candidates
 * (body.url as object/string, body.click_url, body.href, body.link.url)
 * produced a working link — every one silently fell back to the module's
 * own internal "#top" default. Confirmed via the email's own rendered HTML
 * preview, not just the API's echoed JSON. This inline-link approach is
 * fully under our control and already proven to render/link correctly.
 */
function buildFakeButtonHtml(cta: CtaLink): string {
	const style =
		"display: inline-block; background-color: #0064FF; color: #FFFFFF; font-weight: bold; " +
		"font-family: Arial, sans-serif; font-size: 16px; text-decoration: none; padding: 11px 17px; border-radius: 0;";
	return `<p style="margin: 0 0 16px 0;"><a href="${escapeHtml(cta.url)}" rel="noopener" style="${style}">${escapeHtml(cta.label)}</a></p>`;
}

export interface EmailTouch {
	subject: string;
	body: string;
}

export interface CreatedDraft {
	id: string;
	url: string;
}

/**
 * Portal-specific — HubSpot record/editor URLs are always scoped to a
 * portal id. This portal is on the na2 data center (confirmed from record
 * URLs the CRM API already returned for this account).
 */
const HUBSPOT_PORTAL_ID = "3795496";

interface HubspotEmailCreateResponse {
	id: string;
}

/**
 * Template: "Plain Text 4" (@hubspot/email/dnd/plain_text_4.html), the
 * Searce-branded template the marketing team designs new emails from in
 * HubSpot's UI. Layout (flexAreas + widget module_ids/styling) captured
 * verbatim from a real draft in this portal built from this template —
 * the drag-and-drop editor renders widgets by consulting this placement,
 * not just the presence of a `widgets` entry, so it has to match exactly.
 *
 * Widget map (order matches the template's own section order):
 *   module-0-0-0  logo image        — static, never touched
 *   module-0-0-1  banner image      — static, never touched
 *   module-0-0-2  divider line      — static, never touched
 *   module-1-0-0  body rich text    — our generated content goes here,
 *                                     including the CTA (see buildFakeButtonHtml)
 *                                     when a Searce link survives in the content
 *   module-2-0-0  sign-off rich text — rep name filled in; job title/contact
 *                                      left as editable placeholders (rep fills
 *                                      those in during review — not captured
 *                                      anywhere in the app today)
 *   module-3-0-0  footer            — static; HubSpot's own site_settings/
 *                                     unsubscribe tokens, never touched
 *
 * module-1-0-1 (the native @hubspot/button_email CTA button) is deliberately
 * unused — see buildFakeButtonHtml for why.
 */
const PLAIN_TEXT_4_TEMPLATE_PATH = "@hubspot/email/dnd/plain_text_4.html";

const PLAIN_TEXT_4_STYLE_SETTINGS = {
	backgroundColor: "#E8F0FF",
	backgroundImageType: "REPEAT",
	bodyBorderColor: "#0064FF",
	bodyBorderColorChoice: "BORDER_MANUAL",
	bodyBorderWidth: 1,
	bodyColor: "#FFFFFF",
	buttonStyleSettings: {
		backgroundColor: "#0064FF",
		cornerRadius: 0,
		fontStyle: {
			bold: false,
			color: "#FFFFFF",
			font: "Arial, sans-serif",
			italic: false,
			size: 16,
			underline: false,
		},
	},
	dividerStyleSettings: {
		color: { color: "#0064FF", opacity: 100 },
		height: 1,
	},
	emailBodyPadding: "30",
	emailBodyWidth: "600",
	headingOneFont: { color: "#0064FF", font: "Arial, sans-serif", size: 28 },
	headingTwoFont: { color: "#232324", font: "Arial, sans-serif", size: 22 },
	linksFont: { color: "#0064FF" },
	primaryAccentColor: "#232324",
	primaryFont: "Arial, sans-serif",
	primaryFontColor: "#1A1A1A",
	primaryFontLineHeight: "150%",
	primaryFontSize: 16,
	secondaryAccentColor: "#999999",
	secondaryFont: "Arial, sans-serif",
	secondaryFontColor: "#FFFFFF",
	secondaryFontSize: 12,
};

function sectionStyle(backgroundColor: string) {
	return {
		backgroundColor,
		backgroundImage: null,
		backgroundImageType: null,
		backgroundType: "CONTENT",
		breakpointStyles: {
			default: {
				backgroundColor,
				backgroundImage: null,
				backgroundImageType: null,
				backgroundType: "CONTENT",
				borderBottom: null,
				borderBottomLeftRadius: null,
				borderBottomRightRadius: null,
				borderLeft: null,
				borderRight: null,
				borderTop: null,
				borderTopLeftRadius: null,
				borderTopRightRadius: null,
				hidden: false,
				marginBottom: null,
				marginTop: null,
				paddingBottom: "0px",
				paddingTop: "0px",
				verticalAlign: null,
			},
			mobile: {
				backgroundColor,
				backgroundImage: null,
				backgroundImageType: null,
				backgroundType: "CONTENT",
				borderBottom: null,
				borderBottomLeftRadius: null,
				borderBottomRightRadius: null,
				borderLeft: null,
				borderRight: null,
				borderTop: null,
				borderTopLeftRadius: null,
				borderTopRightRadius: null,
				hidden: false,
				marginBottom: null,
				marginTop: null,
				paddingBottom: "0px",
				paddingTop: "0px",
				verticalAlign: null,
			},
		},
		paddingBottom: "0px",
		paddingTop: "0px",
		stack: "LEFT_TO_RIGHT",
	};
}

/** module-1-0-1 (the native button module) is permanently excluded — see buildFakeButtonHtml. */
function buildFlexAreas() {
	return {
		main: {
			boxFirstElementIndex: null,
			boxLastElementIndex: null,
			boxed: false,
			isSingleColumnFullWidth: false,
			sections: [
				{
					columns: [
						{
							id: "column-0-0",
							widgets: ["module-0-0-0", "module-0-0-1", "module-0-0-2"],
							width: 12,
						},
					],
					id: "section-0",
					path: null,
					style: sectionStyle("#fffffe"),
				},
				{
					columns: [{ id: "column-1-0", widgets: ["module-1-0-0"], width: 12 }],
					id: "section-1",
					path: null,
					style: sectionStyle("#fffffe"),
				},
				{
					columns: [{ id: "column-2-0", widgets: ["module-2-0-0"], width: 12 }],
					id: "section-2",
					path: null,
					style: sectionStyle("#ffffff"),
				},
				{
					columns: [{ id: "column-3-0", widgets: ["module-3-0-0"], width: 12 }],
					id: "section-3",
					path: null,
					style: sectionStyle("#ffffff"),
				},
			],
		},
	};
}

function buildLogoWidget() {
	return {
		body: {
			alignment: "left",
			css_class: "dnd-module",
			hs_enable_module_padding: true,
			hs_wrapper_css: {
				"padding-bottom": "24px",
				"padding-left": "40px",
				"padding-right": "40px",
				"padding-top": "48px",
			},
			img: {
				alt: "Logo",
				height: 40,
				loading: "disabled",
				size_type: null,
				src: "https://f.hubspotusercontent40.net/hubfs/3795496/Branding%20_%202021%20_%20Searce%20_%20Logopack%20_%20Logo%20Variations%20_%20Logo%20(tight%20transparent).png",
				width: 100,
			},
			parent_widget_container: null,
			path: "@hubspot/image_email",
			schema_version: 2,
			style: {
				alignment: "left",
				border_color: { color: "#2d3e50" },
				border_style: "none",
				border_width: 1,
				corner_radius: 0,
				corner_radius_unit: "%",
			},
		},
		child_css: {},
		css: {},
		id: "module-0-0-0",
		label: null,
		module_id: 1367093,
		name: "module-0-0-0",
		order: 1,
		smart_type: null,
		styles: { breakpointStyles: { default: { hidden: false }, mobile: { hidden: false } } },
		type: "module",
	};
}

function buildBannerWidget() {
	return {
		body: {
			css_class: "dnd-module",
			hs_enable_module_padding: true,
			hs_wrapper_css: {
				"padding-bottom": "14px",
				"padding-left": "40px",
				"padding-right": "40px",
				"padding-top": "10px",
			},
			img: {
				alt: "Banner image",
				height: 211,
				loading: "disabled",
				size_type: null,
				src: "https://static.hsappstatic.net/TemplateAssets/static-1.550/img/hs_default_template_images/email_dnd_template_images/plain_text_4_main.png",
				width: 504,
			},
			parent_widget_container: null,
			path: "@hubspot/image_email",
			schema_version: 2,
		},
		child_css: {},
		css: {},
		id: "module-0-0-1",
		label: null,
		module_id: 1367093,
		name: "module-0-0-1",
		order: 2,
		smart_type: null,
		styles: { breakpointStyles: { default: { hidden: false }, mobile: { hidden: false } } },
		type: "module",
	};
}

function buildDividerWidget() {
	return {
		body: {
			color: { color: "#0064FF", opacity: 100 },
			css_class: "dnd-module",
			height: 1,
			hs_enable_module_padding: true,
			hs_wrapper_css: {
				"padding-bottom": "12px",
				"padding-left": "40px",
				"padding-right": "40px",
				"padding-top": "0px",
			},
			parent_widget_container: null,
			path: "@hubspot/email_divider",
			schema_version: 2,
			style: {
				alignment: "center",
				color: { color: "#0064FF", opacity: 100 },
				height: 1,
				line_type: "solid",
				width: 100,
			},
			width: 100,
		},
		child_css: {},
		css: {},
		id: "module-0-0-2",
		label: null,
		module_id: 2191110,
		name: "module-0-0-2",
		order: 3,
		smart_type: null,
		styles: { breakpointStyles: { default: { hidden: false }, mobile: { hidden: false } } },
		type: "module",
	};
}

function buildBodyWidget(html: string) {
	return {
		body: {
			css_class: "dnd-module",
			hs_enable_module_padding: true,
			hs_wrapper_css: {
				"padding-bottom": "20px",
				"padding-left": "40px",
				"padding-right": "40px",
				"padding-top": "20px",
			},
			html,
			parent_widget_container: null,
			path: "@hubspot/rich_text",
			schema_version: 2,
		},
		child_css: {},
		css: {},
		id: "module-1-0-0",
		label: null,
		module_id: 1155639,
		name: "module-1-0-0",
		order: 5,
		smart_type: null,
		styles: { breakpointStyles: { default: { hidden: false }, mobile: { hidden: false } } },
		type: "module",
	};
}

function buildSignoffWidget(repName: string) {
	const html = `<p style="font-size: 16px; line-height: 150%; font-weight: normal; color: #1A1A1A">\nAll the best,<br>\n${repName} <br>\nYour job title <br>\nOther contact information\n</p>`;
	return {
		body: {
			css_class: "dnd-module",
			hs_enable_module_padding: true,
			hs_wrapper_css: {
				"padding-bottom": "40px",
				"padding-left": "40px",
				"padding-right": "40px",
				"padding-top": "0px",
			},
			html,
			parent_widget_container: null,
			path: "@hubspot/rich_text",
			schema_version: 2,
		},
		child_css: {},
		css: {},
		id: "module-2-0-0",
		label: null,
		module_id: 1155639,
		name: "module-2-0-0",
		order: 8,
		smart_type: null,
		styles: { breakpointStyles: { default: { hidden: false }, mobile: { hidden: false } } },
		type: "module",
	};
}

function buildFooterWidget() {
	return {
		body: {
			align: "left",
			css_class: "dnd-module",
			display: "default",
			font: {
				color: "#1A1A1A",
				font: "Arial, sans-serif",
				font_set: "DEFAULT",
				size: { units: "px", value: 14 },
			},
			footer_html:
				'<p style="font-size: 14px; line-height: 125%; text-align: left;"><span style="font-family: Merriweather, Georgia, sans-serif; color: #1A1A1A;">{{site_settings.company_name}}<span style="font-family: Merriweather, Georgia, sans-serif;">, {{site_settings.company_street_address_1}}, {{site_settings.company_street_address_2}},{{site_settings.company_city}}, {{site_settings.company_state}}</span></span></p>\n<p><span style="color: #1A1A1A; font-family: Merriweather, Georgia, sans-serif;"> </span></p>\n<p style="font-size: 14px; line-height: 125%; text-align: left;"><span style="font-family: Merriweather, Georgia, sans-serif; color: #1A1A1A;">&nbsp;</span></p>\n<p><span style="color: #1A1A1A; font-family: Merriweather, Georgia, sans-serif;"> </span></p>\n<p style="font-size: 14px; line-height: 125%; text-align: left;"><span style="font-family: Merriweather, Georgia, sans-serif; color: #1A1A1A;"><a href="{{ unsubscribe_link_all }}" style="color: #1A1A1A;" data-unsubscribe="true">Unsubscribe</a> &nbsp;&nbsp; <a href="{{ unsubscribe_link }}" style="color: #1A1A1A;" data-unsubscribe="true">Manage preferences</a></span></p>',
			hs_enable_module_padding: true,
			hs_wrapper_css: {
				"padding-bottom": "25px",
				"padding-left": "25px",
				"padding-right": "25px",
				"padding-top": "25px",
			},
			link_font: {
				color: "#0064FF",
				font: "Arial, sans-serif",
				font_set: "DEFAULT",
				size: { units: "px", value: 14 },
				styles: { bold: false, italic: false, underline: true },
			},
			parent_widget_container: null,
			path: "@hubspot/email_footer",
			schema_version: 2,
			style: {
				align: "left",
				font: {
					color: "#1A1A1A",
					font: "Arial, sans-serif",
					font_set: "DEFAULT",
					size: { units: "px", value: 14 },
					styles: { bold: false, italic: false, underline: false },
				},
				link_font: {
					color: "#0064FF",
					font: "Arial, sans-serif",
					font_set: "DEFAULT",
					size: { units: "px", value: 14 },
					styles: { bold: false, italic: false, underline: true },
				},
			},
			unsubscribe_link_type: "both",
		},
		child_css: {},
		css: {},
		id: "module-3-0-0",
		label: null,
		module_id: 2869621,
		name: "module-3-0-0",
		order: 9,
		smart_type: null,
		styles: { breakpointStyles: { default: { hidden: false }, mobile: { hidden: false } } },
		type: "module",
	};
}

/**
 * Creates one unpublished draft Marketing Email per touch, built on the
 * "Plain Text 4" brand-kit template. Drafts have no recipients set — the
 * rep assigns a contact and hits send from inside HubSpot. Never publishes
 * or sends anything itself.
 */
export async function createDraftMarketingEmails(
	touches: EmailTouch[],
	targetCompany: string,
	format: string,
	repName: string,
	repReplyTo: string | undefined,
	accessToken: string,
): Promise<CreatedDraft[]> {
	const created: CreatedDraft[] = [];

	for (let i = 0; i < touches.length; i++) {
		const touch = touches[i]!;
		const subject = applyTokens(touch.subject || `${targetCompany} — ${format}`, repName);
		const { cleanedBody, cta } = extractCtaLink(touch.body);
		const bodyHtml = bodyToHtml(cleanedBody) + (cta ? `\n${buildFakeButtonHtml(cta)}` : "");
		const html = applyTokens(bodyHtml, repName);
		const name = `${targetCompany || "Untitled"} — ${format} — Touch ${i + 1} (draft)`;

		const widgets: Record<string, unknown> = {
			"module-0-0-0": buildLogoWidget(),
			"module-0-0-1": buildBannerWidget(),
			"module-0-0-2": buildDividerWidget(),
			"module-1-0-0": buildBodyWidget(html),
			"module-2-0-0": buildSignoffWidget(repName),
			"module-3-0-0": buildFooterWidget(),
		};

		const res = await hubspotFetch<HubspotEmailCreateResponse>(
			"/marketing/v3/emails",
			accessToken,
			{
				method: "POST",
				body: {
					name,
					subject,
					content: {
						templatePath: PLAIN_TEXT_4_TEMPLATE_PATH,
						flexAreas: buildFlexAreas(),
						styleSettings: PLAIN_TEXT_4_STYLE_SETTINGS,
						widgets,
					},
					from: { fromName: repName, replyTo: repReplyTo ?? "" },
				},
			},
		);

		created.push({
			id: res.id,
			url: `https://app-na2.hubspot.com/email/${HUBSPOT_PORTAL_ID}/edit/${res.id}/content`,
		});
	}

	return created;
}
