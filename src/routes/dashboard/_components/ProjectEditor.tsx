import { useForm } from "@tanstack/react-form";
import * as React from "react";
import { RangeInput } from "@/components/RangeInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type ProjectUpdateInput,
	projectStatuses,
	validateProjectUpdate,
} from "@/utils/project-form";
import {
	budgetRange,
	currencyFormatter,
	type Project,
} from "./projects-shared";

type ProjectEditorProps = {
	project: Project | null;
	isSaving: boolean;
	onClose: () => void;
	onSave: (values: ProjectUpdateInput) => Promise<Project>;
};

export function ProjectEditor({
	project,
	isSaving,
	onClose,
	onSave,
}: ProjectEditorProps) {
	const defaultValues: ProjectUpdateInput = project
		? {
				id: project.id,
				name: project.name,
				budget: project.budget,
				status: project.status as ProjectUpdateInput["status"],
			}
		: {
				id: 0,
				name: "",
				budget: budgetRange.min,
				status: "active",
			};

	const form = useForm({
		defaultValues,
		validators: {
			onChange: validateProjectUpdate,
			onSubmit: validateProjectUpdate,
		},
		onSubmit: async ({ value }) => {
			await onSave(value);
		},
	});

	React.useEffect(() => {
		if (!project) return;
		form.reset({
			id: project.id,
			name: project.name,
			budget: project.budget,
			status: project.status as ProjectUpdateInput["status"],
		});
	}, [form, project]);

	const clampBudget = React.useCallback((value: number) => {
		if (Number.isNaN(value)) return budgetRange.min;
		return Math.min(budgetRange.max, Math.max(budgetRange.min, value));
	}, []);

	return (
		<div className="rounded-lg border border-slate-800 bg-slate-950 p-5 text-slate-100">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Edit Project</h2>
				<Button type="button" variant="ghost" size="sm" onClick={onClose}>
					Close
				</Button>
			</div>
			{project ? (
				<form
					className="mt-5 space-y-5"
					onSubmit={(event) => {
						event.preventDefault();
						void form.handleSubmit();
					}}
				>
					<form.Field name="name">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Project Name</Label>
								<Input
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
									placeholder="Project name"
								/>
								{field.state.meta.errors[0] ? (
									<p className="text-xs text-red-400">
										{field.state.meta.errors[0]}
									</p>
								) : null}
							</div>
						)}
					</form.Field>

					<form.Field name="status">
						{(field) => (
							<div className="space-y-2">
								<Label>Status</Label>
								<Select
									value={field.state.value}
									onValueChange={(value) =>
										field.handleChange(value as ProjectUpdateInput["status"])
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										{projectStatuses.map((status) => (
											<SelectItem key={status} value={status}>
												{status}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{field.state.meta.errors[0] ? (
									<p className="text-xs text-red-400">
										{field.state.meta.errors[0]}
									</p>
								) : null}
							</div>
						)}
					</form.Field>

					<form.Field name="budget">
						{(field) => (
							<div className="space-y-3">
								<div className="flex items-center justify-between gap-3">
									<Label htmlFor={field.name}>Budget</Label>
									<Input
										id={field.name}
										type="number"
										min={budgetRange.min}
										max={budgetRange.max}
										step={budgetRange.step}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => {
											const next = clampBudget(Number(event.target.value));
											field.handleChange(next);
										}}
										className="w-32 text-right"
									/>
								</div>
								<RangeInput
									value={field.state.value}
									min={budgetRange.min}
									max={budgetRange.max}
									step={budgetRange.step}
									onChange={(next) => field.handleChange(clampBudget(next))}
									formatValue={(value) => currencyFormatter.format(value)}
									aria-label="Project budget"
								/>
								<p className="text-xs text-slate-400">
									{currencyFormatter.format(field.state.value)}
								</p>
								{field.state.meta.errors[0] ? (
									<p className="text-xs text-red-400">
										{field.state.meta.errors[0]}
									</p>
								) : null}
							</div>
						)}
					</form.Field>

					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<div className="flex items-center justify-end gap-2">
								<Button
									type="button"
									variant="ghost"
									onClick={onClose}
									disabled={isSaving || isSubmitting}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={!canSubmit || isSaving || isSubmitting}
								>
									{isSaving || isSubmitting ? "Saving..." : "Save changes"}
								</Button>
							</div>
						)}
					</form.Subscribe>
				</form>
			) : (
				<p className="mt-4 text-sm text-slate-400">
					Select a project to edit its details.
				</p>
			)}
		</div>
	);
}
