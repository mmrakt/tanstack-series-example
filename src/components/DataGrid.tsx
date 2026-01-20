import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type Table,
	type TableOptions,
	useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";
import { cn } from "@/lib/utils";

interface DataGridProps<T> {
	data: T[];
	// biome-ignore lint/suspicious/noExplicitAny: ColumnDef is invariant in TValue; allow mixed column value types.
	columns: ColumnDef<T, any>[];
	tableOptions?: Omit<TableOptions<T>, "data" | "columns" | "getCoreRowModel">;
	ToolbarComponent?: React.ComponentType<{ table: Table<T> }>;
	emptyState?: React.ReactNode;
	className?: string;
}

export function DataGrid<T>({
	data,
	columns,
	tableOptions,
	ToolbarComponent,
	emptyState,
	className,
}: DataGridProps<T>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		...tableOptions,
	});

	const parentRef = React.useRef<HTMLDivElement>(null);

	const { rows } = table.getRowModel();

	const virtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 45,
		overscan: 10,
	});

	const headerRef = React.useRef<HTMLTableSectionElement | null>(null);
	const [headerHeight, setHeaderHeight] = React.useState(0);
	const fallbackHeaderHeight = 44;

	React.useEffect(() => {
		const header = headerRef.current;
		if (!header) return;
		const updateHeight = () => {
			setHeaderHeight(header.getBoundingClientRect().height);
		};
		updateHeight();
		if (typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(updateHeight);
		observer.observe(header);
		return () => observer.disconnect();
	}, []);

	const effectiveHeaderHeight =
		headerHeight > 0 ? headerHeight : fallbackHeaderHeight;

	const renderHeaders = () => (
		<thead ref={headerRef} className="sticky top-0 z-10 bg-gray-800">
			{table.getHeaderGroups().map((headerGroup) => (
				<tr key={headerGroup.id}>
					{headerGroup.headers.map((header) => {
						if (header.isPlaceholder) {
							return (
								<th key={header.id} className="p-3 border-b border-gray-700" />
							);
						}
						const canSort = header.column.getCanSort();
						const sorted = header.column.getIsSorted();
						return (
							<th
								key={header.id}
								className="p-3 border-b border-gray-700 font-bold uppercase text-xs"
							>
								<button
									type="button"
									onClick={header.column.getToggleSortingHandler()}
									disabled={!canSort}
									className={cn(
										"flex items-center gap-1",
										canSort ? "cursor-pointer select-none" : "cursor-default",
									)}
								>
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
									{sorted === "asc" ? "▲" : sorted === "desc" ? "▼" : null}
								</button>
							</th>
						);
					})}
				</tr>
			))}
		</thead>
	);

	return (
		<div className={cn("space-y-3", className)}>
			{ToolbarComponent ? <ToolbarComponent table={table} /> : null}
			<div
				ref={parentRef}
				className="h-[600px] overflow-auto border border-gray-700 rounded-lg bg-gray-900"
			>
				{rows.length === 0 ? (
					<table className="w-full text-left text-gray-200 border-collapse">
						{renderHeaders()}
						<tbody>
							<tr>
								<td
									colSpan={table.getAllLeafColumns().length}
									className="p-6 text-center text-sm text-gray-400"
								>
									{emptyState ?? "No results"}
								</td>
							</tr>
						</tbody>
					</table>
				) : (
					<div
						style={{
							height: `${virtualizer.getTotalSize() + effectiveHeaderHeight}px`,
							width: "100%",
							position: "relative",
						}}
					>
						<table className="w-full text-left text-gray-200 border-collapse">
							{renderHeaders()}
							<tbody>
								{virtualizer.getVirtualItems().map((virtualRow) => {
									const row = rows[virtualRow.index];
									return (
										<tr
											key={virtualRow.key}
											style={{
												position: "absolute",
												top: 0,
												left: 0,
												width: "100%",
												height: `${virtualRow.size}px`,
												transform: `translateY(${virtualRow.start + effectiveHeaderHeight}px)`,
											}}
											className="border-b border-gray-800 hover:bg-gray-800/70 odd:bg-gray-900/40"
										>
											{row.getVisibleCells().map((cell) => (
												<td key={cell.id} className="p-3">
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</td>
											))}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
