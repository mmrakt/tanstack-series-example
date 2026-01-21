import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { type AppCollections, createAppCollections } from "./index";

const CollectionsContext = React.createContext<AppCollections | null>(null);

export function CollectionsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const queryClient = useQueryClient();
	const collections = React.useMemo(
		() => createAppCollections(queryClient),
		[queryClient],
	);

	return (
		<CollectionsContext.Provider value={collections}>
			{children}
		</CollectionsContext.Provider>
	);
}

export function useCollections(): AppCollections {
	const context = React.useContext(CollectionsContext);
	if (!context) {
		throw new Error("CollectionsProvider is missing");
	}
	return context;
}
