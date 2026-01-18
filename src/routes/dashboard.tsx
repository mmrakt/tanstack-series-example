import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
	component: DashboardLayout,
});

function DashboardLayout() {
	return (
		<div className="flex flex-col h-screen overflow-hidden bg-gray-950">
			<div className="flex border-b border-gray-800 bg-gray-900 px-8 py-4 gap-8">
				<Link
					to="/dashboard/projects"
					className="text-gray-400 hover:text-white transition-colors"
					activeProps={{ className: "text-cyan-400 font-bold" }}
				>
					Projects
				</Link>
				<Link
					to="/dashboard/employees"
					className="text-gray-400 hover:text-white transition-colors"
					activeProps={{ className: "text-cyan-400 font-bold" }}
				>
					Employees
				</Link>
				<Link
					to="/dashboard/inventory"
					className="text-gray-400 hover:text-white transition-colors"
					activeProps={{ className: "text-cyan-400 font-bold" }}
				>
					Inventory
				</Link>
			</div>
			<div className="flex-1 overflow-auto bg-gray-950">
				<Outlet />
			</div>
		</div>
	);
}
