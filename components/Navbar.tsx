"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { signOut } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { assetPath } from "@/lib/utils";

export default function Navbar() {
	const { user } = useAuthStore();

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
				<Link href="/" className="flex items-center" suppressHydrationWarning>
					<Image
						src={assetPath("/images/logo.svg")}
						alt="Searce"
						width={120}
						height={26}
						priority
						style={{ width: "auto", height: "auto" }}
						className="block dark:hidden"
					/>
					<Image
						src={assetPath("/images/searce-logo-white.svg")}
						alt="Searce"
						width={120}
						height={26}
						priority
						style={{ width: "auto", height: "auto" }}
						className="hidden dark:block"
					/>
				</Link>

				<div className="flex items-center gap-2">
					{user && (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="cursor-pointer"
									onClick={() => signOut()}
								>
									<LogOut className="size-4" />
									<span className="sr-only">Sign out</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>Sign out</TooltipContent>
						</Tooltip>
					)}
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
