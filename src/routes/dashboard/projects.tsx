import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { DataGrid } from "@/components/DataGrid";
import { getProjects } from "@/functions/dashboard";

type Project = typeof import("@/db/schema").projects.$inferSelect;

const columnHelper = createColumnHelper<Project>();

const columns = [
	columnHelper.accessor("id", { header: "ID" }),
	columnHelper.accessor("name", { header: "Project Name" }),
	columnHelper.accessor("budget", {
		header: "Budget",
		cell: (info) => `$${info.getValue().toLocaleString()}`,
	}),
	columnHelper.accessor("status", {
		header: "Status",
		cell: (info) => (
			<span
				className={`px-2 py-1 rounded-full text-xs font-bold ${
					info.getValue() === "active"
						? "bg-green-900 text-green-300"
						: info.getValue() === "completed"
							? "bg-blue-900 text-blue-300"
							: "bg-yellow-900 text-yellow-300"
				}`}
			>
				{info.getValue()}
			</span>
		),
	}),
	columnHelper.accessor("createdAt", {
		header: "Created At",
		cell: (info) => new Date(info.getValue()).toLocaleDateString(),
	}),
];

export const Route = createFileRoute("/dashboard/projects")({
	component: ProjectsPage,
	loader: async () => await getProjects(),
});

function ProjectsPage() {
	const projects = Route.useLoaderData();

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6 text-white">Projects</h1>
			<DataGrid data={projects} columns={columns} />
		</div>
	);
}
