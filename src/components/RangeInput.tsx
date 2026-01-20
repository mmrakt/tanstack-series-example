"use client";

import { type RangerChangeEvent, useRanger } from "@tanstack/react-ranger";
import * as React from "react";
import { cn } from "@/lib/utils";

type RangeInputProps = {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	className?: string;
	formatValue?: (value: number) => string;
	"aria-label"?: string;
};

export function RangeInput({
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	className,
	formatValue,
	"aria-label": ariaLabel = "Range input",
}: RangeInputProps) {
	const trackRef = React.useRef<HTMLDivElement>(null);
	const stepKeysRef = React.useRef<string[]>([]);
	const handleKeysRef = React.useRef<string[]>([]);
	const keyCounterRef = React.useRef(0);

	const ensureStableKeys = React.useCallback(
		(
			keysRef: React.MutableRefObject<string[]>,
			count: number,
			prefix: string,
		) => {
			if (keysRef.current.length > count) {
				keysRef.current = keysRef.current.slice(0, count);
			}
			while (keysRef.current.length < count) {
				keysRef.current.push(`${prefix}-${keyCounterRef.current++}`);
			}
			return keysRef.current;
		},
		[],
	);

	const emitValue = React.useCallback<RangerChangeEvent<HTMLDivElement>>(
		(instance) => {
			const nextValue = instance.sortedValues[0];
			if (typeof nextValue === "number") {
				onChange(nextValue);
			}
		},
		[onChange],
	);

	const ranger = useRanger<HTMLDivElement>({
		getRangerElement: () => trackRef.current,
		values: [value],
		min,
		max,
		stepSize: step,
		onChange: emitValue,
		onDrag: emitValue,
	});

	return (
		<div className={cn("space-y-3", className)}>
			<div
				ref={trackRef}
				data-testid="range-track"
				className="relative h-2 w-full rounded-full bg-slate-800"
			>
				{(() => {
					const steps = ranger.getSteps();
					const stepKeys = ensureStableKeys(stepKeysRef, steps.length, "step");
					const handles = ranger.handles();
					const handleKeys = ensureStableKeys(
						handleKeysRef,
						handles.length,
						"handle",
					);

					return (
						<>
							{steps.map((rangeStep, index) => (
								<div
									key={stepKeys[index]}
									className="absolute h-full rounded-full bg-emerald-500"
									style={{
										left: `${rangeStep.left}%`,
										width: `${rangeStep.width}%`,
									}}
								/>
							))}
							{handles.map((handle, index) => {
								const left = ranger.getPercentageForValue(handle.value);
								return (
									<button
										key={handleKeys[index]}
										type="button"
										aria-label={ariaLabel}
										aria-valuemin={min}
										aria-valuemax={max}
										aria-valuenow={handle.value}
										role="slider"
										onMouseDown={handle.onMouseDownHandler}
										onTouchStart={handle.onTouchStart}
										onKeyDown={handle.onKeyDownHandler}
										className={cn(
											"absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300 bg-emerald-100 shadow transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
											handle.isActive ? "scale-110" : "scale-100",
										)}
										style={{ left: `${left}%` }}
									/>
								);
							})}
						</>
					);
				})()}
			</div>
			<div className="flex items-center justify-between text-xs text-slate-400">
				<span>{formatValue ? formatValue(min) : min}</span>
				<span>{formatValue ? formatValue(max) : max}</span>
			</div>
		</div>
	);
}
