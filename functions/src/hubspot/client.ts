const HUBSPOT_API_BASE = "https://api.hubapi.com";

export class HubspotApiError extends Error {
	constructor(
		public status: number,
		public path: string,
		body: string,
	) {
		super(`HubSpot API ${status} on ${path}: ${body}`);
	}
}

/** Thin fetch wrapper around HubSpot's REST API using a Private App token. */
export async function hubspotFetch<T>(
	path: string,
	accessToken: string,
	init?: { method?: string; body?: unknown },
): Promise<T> {
	const res = await fetch(`${HUBSPOT_API_BASE}${path}`, {
		method: init?.method ?? "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
	});

	const text = await res.text();
	if (!res.ok) {
		throw new HubspotApiError(res.status, path, text);
	}
	return (text ? JSON.parse(text) : null) as T;
}
