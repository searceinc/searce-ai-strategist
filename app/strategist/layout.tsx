import AuthGuard from "@/components/AuthGuard";
import { Sidebar } from "@/components/strategist";

export default function StrategistLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGuard>
			<div className="flex h-[calc(100vh-4rem)]">
				<Sidebar />
				<main className="flex-1 overflow-auto p-6">{children}</main>
			</div>
		</AuthGuard>
	);
}
