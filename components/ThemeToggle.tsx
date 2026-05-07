"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Renders nothing on the server / first paint so next-themes' `class` swap on
 * <html> can't trigger a hydration mismatch on the toggle button. Browser
 * extensions that inject attributes (e.g. password managers, Grammarly, or
 * Cursor's preview browser) also stop tripping React's hydration warning here.
 *
 * The placeholder reserves the same 32×32 footprint so the navbar layout
 * doesn't shift after mount.
 */
export default function ThemeToggle() {
	const { setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// Canonical next-themes "wait for client mount" pattern — flipping a
		// single mount flag once on the client is the entire point of the guard.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="size-8" aria-hidden suppressHydrationWarning />;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="cursor-pointer">
					<Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
