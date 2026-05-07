/**
 * Tiny Markdown renderer for generated copy.
 *
 * Hand-rolled (no remark / react-markdown) so output inherits the global font
 * stack and we don't pull in another dep.
 *
 * Block-level support:
 *   - Blank-line paragraph breaks
 *   - Bullet lists from runs of lines starting with "•", "-" or "*"
 *   - Single-line breaks within a paragraph become <br/>
 *
 * Inline-level support:
 *   - [text](https://… | mailto:…) → real <a target="_blank">
 *   - **bold**       → <strong>
 *   - *italic* / _italic_ → <em>
 *   - ***both***     → <strong><em>
 */

import * as React from "react";

const LINK_RE = /\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)/;
const BOLD_ITALIC_RE = /\*\*\*([^*\n]+?)\*\*\*/;
const BOLD_RE = /\*\*([^*\n]+?)\*\*|__([^_\n]+?)__/;
const ITALIC_RE =
	/(^|[\s([{>])\*([^\s*][^*\n]*?)\*(?=[\s).,!?;:\]}>]|$)|(^|[\s([{>])_([^\s_][^_\n]*?)_(?=[\s).,!?;:\]}>]|$)/;

interface InlineMatch {
	index: number;
	length: number;
	node: React.ReactNode;
}

function findFirstMatch(text: string, keyPrefix: string): InlineMatch | null {
	const candidates: InlineMatch[] = [];

	const linkM = text.match(LINK_RE);
	if (linkM && typeof linkM.index === "number") {
		candidates.push({
			index: linkM.index,
			length: linkM[0].length,
			node: (
				<a
					key={`${keyPrefix}-a`}
					href={linkM[2] ?? ""}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary underline-offset-2 hover:underline"
				>
					{linkM[1] ?? ""}
				</a>
			),
		});
	}

	const biM = text.match(BOLD_ITALIC_RE);
	if (biM && typeof biM.index === "number") {
		candidates.push({
			index: biM.index,
			length: biM[0].length,
			node: (
				<strong key={`${keyPrefix}-bi`} className="font-semibold">
					<em>{biM[1] ?? ""}</em>
				</strong>
			),
		});
	}

	const bM = text.match(BOLD_RE);
	if (bM && typeof bM.index === "number") {
		candidates.push({
			index: bM.index,
			length: bM[0].length,
			node: (
				<strong key={`${keyPrefix}-b`} className="font-semibold">
					{bM[1] ?? bM[2] ?? ""}
				</strong>
			),
		});
	}

	const iM = text.match(ITALIC_RE);
	if (iM && typeof iM.index === "number") {
		const lead = iM[1] ?? iM[3] ?? "";
		const inner = iM[2] ?? iM[4] ?? "";
		candidates.push({
			index: iM.index + lead.length,
			length: iM[0].length - lead.length,
			node: <em key={`${keyPrefix}-i`}>{inner}</em>,
		});
	}

	if (candidates.length === 0) return null;
	candidates.sort((a, b) => a.index - b.index);
	return candidates[0]!;
}

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
	const out: React.ReactNode[] = [];
	let remaining = text;
	let i = 0;
	while (remaining.length > 0) {
		const m = findFirstMatch(remaining, `${keyPrefix}-${i}`);
		if (!m) {
			out.push(remaining);
			break;
		}
		if (m.index > 0) out.push(remaining.slice(0, m.index));
		out.push(m.node);
		remaining = remaining.slice(m.index + m.length);
		i++;
	}
	return out;
}

function renderLineWithBreaks(text: string, keyPrefix: string): React.ReactNode[] {
	const lines = text.split(/\r?\n/);
	const nodes: React.ReactNode[] = [];
	for (let i = 0; i < lines.length; i++) {
		nodes.push(...renderInline(lines[i] ?? "", `${keyPrefix}-l${i}`));
		if (i < lines.length - 1) nodes.push(<br key={`${keyPrefix}-br${i}`} />);
	}
	return nodes;
}

const BULLET_RE = /^\s*(?:[•▪●]|[-*])\s+(.*)$/;

interface Block {
	type: "paragraph" | "list";
	lines: string[];
}

function tokenizeBlocks(text: string): Block[] {
	const paragraphs = text.split(/\n{2,}/);
	const blocks: Block[] = [];
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

export function MarkdownText({ text, className }: { text: string; className?: string }) {
	const trimmed = (text ?? "").replace(/\r\n/g, "\n").trim();
	if (!trimmed) return null;
	const blocks = tokenizeBlocks(trimmed);
	return (
		<div className={`space-y-3 text-sm ${className ?? ""}`}>
			{blocks.map((block, idx) => {
				if (block.type === "list") {
					return (
						<ul
							key={`b-${idx}`}
							className="list-disc space-y-1.5 pl-5 leading-relaxed text-foreground"
						>
							{block.lines.map((item, j) => (
								<li key={`b-${idx}-li-${j}`}>
									{renderInline(item, `b-${idx}-li-${j}`)}
								</li>
							))}
						</ul>
					);
				}
				const text = block.lines.join("\n");
				return (
					<p key={`b-${idx}`} className="leading-relaxed text-foreground">
						{renderLineWithBreaks(text, `b-${idx}`)}
					</p>
				);
			})}
		</div>
	);
}
