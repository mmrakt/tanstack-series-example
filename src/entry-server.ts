import {
	createStartHandler,
	defaultStreamHandler,
} from "@tanstack/react-start/server";

const startHandler = createStartHandler(defaultStreamHandler);

export default {
	async fetch(request: Request, env: Record<string, unknown>, ctx: unknown) {
		(
			globalThis as typeof globalThis & { __CF_ENV__?: Record<string, unknown> }
		).__CF_ENV__ = env;
		return startHandler(request, {
			context: {
				cloudflare: {
					env,
					ctx,
				},
			},
		});
	},
};
