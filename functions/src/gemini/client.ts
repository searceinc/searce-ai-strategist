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
	temperature = 0.8,
	maxOutputTokens = 4096,
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
