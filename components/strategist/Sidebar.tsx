"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, UserRound, Users, History, Star, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStrategistStore } from "@/lib/store/useStrategistStore";

const NAV_ITEMS = [
	{ href: "/strategist", label: "Account Level", icon: PenLine },
	{ href: "/strategist/persona", label: "Persona Level", icon: UserRound },
	{ href: "/strategist/generic", label: "Generic / Segment", icon: Users },
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
				sidebarOpen ? "w-48" : "w-14",
			)}
		>
			{/*
				Padding mirrors the <nav> below (px-2) so the toggle icon sits on the
				same vertical axis as the nav icons — 28px from the sidebar's left
				edge, which is also dead-centre of the 56px collapsed rail. The old
				`pl-5 pr-3` put it 8px to the right of the nav icons AND squeezed a
				32px button into 24px of space when collapsed.
			*/}
			<div
				className={cn(
					"flex items-center px-2 py-4",
					sidebarOpen ? "justify-between" : "justify-center",
				)}
			>
				{sidebarOpen && (
					<span className="pl-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
						Strategist
					</span>
				)}
				<Button
					variant="ghost"
					size="icon"
					className="size-9 shrink-0 cursor-pointer"
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
