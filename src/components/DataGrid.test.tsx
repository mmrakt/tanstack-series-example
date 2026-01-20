// @vitest-environment jsdom

import { createColumnHelper } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataGrid } from "./DataGrid";

type Row = {
	id: number;
	name: string;
};

describe("DataGrid", () => {
	it("renders empty state when no rows are available", () => {
		const columnHelper = createColumnHelper<Row>();
		const columns = [
			columnHelper.accessor("id", { header: "ID" }),
			columnHelper.accessor("name", { header: "Name" }),
		];

		render(<DataGrid data={[]} columns={columns} emptyState="No rows" />);

		expect(screen.getByText("No rows")).toBeTruthy();
	});
});
