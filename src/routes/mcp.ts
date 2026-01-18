import { createFileRoute } from "@tanstack/react-router";
// Server setup moved to src/server/mcp-server.ts to avoid client-side bundling issues

export const Route = createFileRoute("/mcp")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const { server } = await import("../server/mcp-server");
				const { handleMcpRequest } = await import("../utils/mcp-handler");
				return handleMcpRequest(request, server);
			},
		},
	},
});
