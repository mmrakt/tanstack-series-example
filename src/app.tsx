import { clerkMiddleware } from "@clerk/tanstack-react-start/server";
import { createStart } from "@tanstack/react-start";

export default createStart(() => {
	return {
		requestMiddleware: [clerkMiddleware()],
	};
});
