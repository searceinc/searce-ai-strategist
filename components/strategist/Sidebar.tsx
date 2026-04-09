"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, History, Star, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStrategistStore } from "@/lib/store/useStrategistStore";

const NAV_ITEMS = [
	{ href: "/strategist", label: "Content Generator", icon: PenLine },
	{ href: "/strategist/history", label: "Content History", icon: History },
	{ href: "/strategist/saved", label: "Saved Sessions", icon: Star },
] as const;

export default function Sidebar() {
	const pathname = usePathname();
	const { sidebarOpen, setSidebarOpen } = useStrategistStore();

	return (
		<aside
			className={cn(
				"sticky top-16 flex h-[calc(100vh-4rem)] flex-col border-r border-border bg-sidebar transition-all duration-200",
				sidebarOpen ? "w-60" : "w-14",
			)}
		>
			<div className="flex items-center justify-between px-3 py-4">
				{sidebarOpen && (
					<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
						Strategist
					</span>
				)}
				<Button
					variant="ghost"
					size="icon"
					className="size-8 cursor-pointer"
					onClick={() => setSidebarOpen(!sidebarOpen)}
				>
					{sidebarOpen ? (
						<PanelLeftClose className="size-4" />
					) : (
						<PanelLeft className="size-4" />
					)}
				</Button>
			</div>

			<nav className="flex flex-1 flex-col gap-1 px-2">
				{NAV_ITEMS.map(({ href, label, icon: Icon }) => {
					const isActive =
						pathname === href || (href !== "/strategist" && pathname.startsWith(href));
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "bg-sidebar-accent text-sidebar-accent-foreground"
									: "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
							)}
						>
							<Icon className="size-4 shrink-0" />
							{sidebarOpen && <span>{label}</span>}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
