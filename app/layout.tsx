import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import AuthListener from "@/components/AuthListener";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const gilroy = localFont({
	src: [
		{ path: "../public/fonts/Gilroy/Gilroy-Regular.otf", weight: "400" },
		{ path: "../public/fonts/Gilroy/Gilroy-Medium.otf", weight: "500" },
	],
	variable: "--font-gilroy",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Searce | AI Content Strategy & Creation",
	description:
		"AI powered Searce Content Strategy & Creation offering content strategy and creation services.",
	icons: {
		icon: [
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
		apple: "/apple-touch-icon.png",
		other: [
			{ rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
			{ rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
		],
	},
	manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	minimumScale: 1,
	maximumScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
			<body className={gilroy.variable}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<TooltipProvider delayDuration={300}>
						<AuthListener />
						<Navbar />
						{children}
						<Toaster richColors position="top-right" />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
