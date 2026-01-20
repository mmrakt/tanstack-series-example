import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { DataGrid } from "@/components/DataGrid";
import { employeesQueryOptions } from "@/queries/dashboard";

type Employee = typeof import("@/db/schema").employees.$inferSelect;

const columnHelper = createColumnHelper<Employee>();

const columns = [
	columnHelper.accessor("id", { header: "ID" }),
	columnHelper.accessor("name", { header: "Full Name" }),
	columnHelper.accessor("role", {
		header: "Role",
		cell: (info) => <span className="text-gray-100">{info.getValue()}</span>,
	}),
	columnHelper.accessor("joinedAt", {
		header: "Joined At",
		cell: (info) => {
			const value = info.getValue();
			return value ? new Date(value).toLocaleDateString() : "-";
		},
	}),
];

export const Route = createFileRoute("/dashboard/employees")({
	component: EmployeesPage,
	loader: async ({ context }) =>
		await context.queryClient.ensureQueryData(employeesQueryOptions()),
});

function EmployeesPage() {
	const { data: employees = [] } = useQuery(employeesQueryOptions());

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6 text-white">Employees</h1>
			<DataGrid data={employees} columns={columns} />
		</div>
	);
}
