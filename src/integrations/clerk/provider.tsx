import { ClerkProvider } from "@clerk/tanstack-react-start";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// if (!PUBLISHABLE_KEY) {
// 	throw new Error("Add your Clerk Publishable Key to the .env.local file");
// }

export default function AppClerkProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	if (!PUBLISHABLE_KEY) {
		return (
			<div className="p-4 bg-red-500 text-white font-bold">
				Clerk Publishable Key Missing. Please add VITE_CLERK_PUBLISHABLE_KEY to
				.env.local
				{children}
			</div>
		);
	}
	return (
		<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
			{children}
		</ClerkProvider>
	);
}
