/**
 * Strategic-angle CTAs.
 *
 * The previous version was keyed by persona-function (engineering/marketing/…)
 * which doesn't exist anymore under the industry-category model. CTAs are now
 * keyed by strategic angle only and are deliberately practice-agnostic — the
 * model is told elsewhere to fall back to the practices we actually have proof
 * for, so we never promise something Searce hasn't done.
 */

interface AngleCTA {
	primary: string;
	secondary: string;
}

const ANGLE_CTAS: Record<string, AngleCTA> = {
	pain_point: {
		primary: "Worth a 15-minute exchange of notes?",
		secondary: "Happy to share the framework we used on a similar challenge.",
	},
	roi_metrics: {
		primary: "Want a quick look at the ROI math we ran for a peer?",
		secondary: "Happy to send a one-pager with the numbers.",
	},
	social_proof: {
		primary: "Open to a brief reference call with a peer who solved this?",
		secondary: "Can drop a short case write-up if helpful.",
	},
	direct_pitch: {
		primary: "30-minute working session next week?",
		secondary: "Or I can send a one-pager first, your call.",
	},
};

export function getAngleCTA(angle: string): AngleCTA {
	return ANGLE_CTAS[angle] ?? ANGLE_CTAS.pain_point!;
}
