import { GoogleGenAI } from "@google/genai";

let cachedClient: GoogleGenAI | null = null;

function getClient(apiKey: string): GoogleGenAI {
	if (!cachedClient) {
		cachedClient = new GoogleGenAI({ apiKey });
	}
	return cachedClient;
}

interface GenerateOptions {
	apiKey: string;
	prompt: string;
	systemInstruction?: string;
	model?: string;
	temperature?: number;
	maxOutputTokens?: number;
}

export async function generateWithGemini({
	apiKey,
	prompt,
	systemInstruction,
	model = "gemini-2.5-flash",
	temperature = 0.4,
	maxOutputTokens = 2048,
}: GenerateOptions): Promise<string> {
	const client = getClient(apiKey);

	const response = await client.models.generateContent({
		model,
		contents: prompt,
		config: {
			systemInstruction,
			temperature,
			maxOutputTokens,
		},
	});

	const text = response.text;
	if (!text) {
		throw new Error("Gemini returned empty response");
	}
	return text;
}

interface StructuredGenerateOptions<T> extends GenerateOptions {
	/**
	 * Standard JSON Schema (lowercase types: "object", "string", "array", …).
	 * Gemini's @google/genai SDK >= v1.9 routes a JSON Schema through the
	 * `responseJsonSchema` field for strict backend validation. See
	 * `services/output-schemas.ts` for the schemas used here.
	 */
	responseJsonSchema: unknown;
	/** Type guard to validate the parsed JSON before returning. */
	validate?: (value: unknown) => value is T;
}

/**
 * Generate JSON output that conforms to a Gemini response JSON Schema.
 *
 * Uses `responseMimeType: "application/json"` + `responseJsonSchema` (the
 * SDK-recommended path) to force the model into a strict shape. This is the
 * only reliable way to enforce hard structural constraints (paragraph
 * counts, A/B subject options, etc.) on Gemini.
 */
export async function generateStructuredWithGemini<T = unknown>({
	apiKey,
	prompt,
	systemInstruction,
	model = "gemini-2.5-flash",
	temperature = 0.35,
	maxOutputTokens = 2048,
	responseJsonSchema,
	validate,
}: StructuredGenerateOptions<T>): Promise<T> {
	const client = getClient(apiKey);

	const response = await client.models.generateContent({
		model,
		contents: prompt,
		config: {
			systemInstruction,
			temperature,
			maxOutputTokens,
			responseMimeType: "application/json",
			// Use the JSON Schema field. Cast via `as never` to bypass the
			// SDK's deep generic typing; the runtime accepts a plain JSON
			// Schema object here.
			responseJsonSchema: responseJsonSchema as never,
		},
	});

	const text = response.text;
	if (!text) {
		throw new Error("Gemini returned empty response");
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(text);
	} catch (err) {
		throw new Error(
			`Gemini returned invalid JSON: ${err instanceof Error ? err.message : "parse error"}`,
		);
	}

	if (validate && !validate(parsed)) {
		throw new Error("Gemini response failed schema validation");
	}

	return parsed as T;
}
