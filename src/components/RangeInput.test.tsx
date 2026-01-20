// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { RangeInput } from "./RangeInput";

function mockTrackLayout(element: HTMLElement, left = 0, width = 100) {
	Object.defineProperty(element, "getBoundingClientRect", {
		value: () => ({
			left,
			width,
			top: 0,
			height: 10,
			right: left + width,
			bottom: 10,
			x: left,
			y: 0,
			toJSON: () => "",
		}),
	});
}

describe("RangeInput", () => {
	it("emits updated value while dragging", () => {
		const handleChange = vi.fn();

		function Wrapper() {
			const [value, setValue] = React.useState(0);
			return (
				<RangeInput
					value={value}
					min={0}
					max={100}
					step={1}
					onChange={(next) => {
						setValue(next);
						handleChange(next);
					}}
				/>
			);
		}

		render(<Wrapper />);

		const track = screen.getByTestId("range-track");
		mockTrackLayout(track, 0, 100);

		const handle = screen.getByRole("slider");
		fireEvent.mouseDown(handle, { clientX: 0 });
		fireEvent.mouseMove(document, { clientX: 75 });

		expect(handleChange).toHaveBeenCalled();
		expect(handleChange).toHaveBeenCalledWith(75);

		fireEvent.mouseUp(document);
	});
});
