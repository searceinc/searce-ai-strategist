import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Prepend NEXT_PUBLIC_BASE_PATH to a public-folder asset path (e.g. "/images/logo.svg").
// Required because next/image and metadata icons do not always auto-prefix basePath
// in static export builds.
export function assetPath(path: string): string {
	const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
	return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
