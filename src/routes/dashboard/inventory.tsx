import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { DataGrid } from "@/components/DataGrid";
import { getInventory } from "@/functions/dashboard";

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
		cell: (info) => new Date(info.getValue()).toLocaleDateString(),
	}),
];

export const Route = createFileRoute("/dashboard/inventory")({
	component: InventoryPage,
	loader: async () => await getInventory(),
});

function InventoryPage() {
	const inventory = Route.useLoaderData();

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6 text-white">Inventory</h1>
			<DataGrid data={inventory} columns={columns} />
		</div>
	);
}
