import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { DataGrid } from "@/components/DataGrid";
import { inventoryQueryOptions } from "@/queries/dashboard";

type InventoryItem = typeof import("@/db/schema").inventory.$inferSelect;

const columnHelper = createColumnHelper<InventoryItem>();

const columns = [
	columnHelper.accessor("id", { header: "ID" }),
	columnHelper.accessor("itemName", { header: "Item Name" }),
	columnHelper.accessor("quantity", {
		header: "Quantity",
		cell: (info) => (
			<span
				className={
					info.getValue() < 100 ? "text-red-400 font-bold" : "text-gray-100"
				}
			>
				{info.getValue().toLocaleString()}
			</span>
		),
	}),
	columnHelper.accessor("price", {
		header: "Price",
		cell: (info) => `$${info.getValue().toLocaleString()}`,
	}),
	columnHelper.accessor("updatedAt", {
		header: "Last Updated",
		cell: (info) => {
			const value = info.getValue();
			return value ? new Date(value).toLocaleDateString() : "-";
		},
	}),
];

export const Route = createFileRoute("/dashboard/inventory")({
	component: InventoryPage,
	loader: async ({ context }) =>
		await context.queryClient.ensureQueryData(inventoryQueryOptions()),
});

function InventoryPage() {
	const { data: inventory = [] } = useQuery(inventoryQueryOptions());

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6 text-white">Inventory</h1>
			<DataGrid data={inventory} columns={columns} />
		</div>
	);
}
