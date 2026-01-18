import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-4">ERP System</h1>
			<p className="text-gray-600 mb-8">Welcome to the ERP System.</p>

			<Link
				to="/dashboard/projects"
				className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold transition-all"
			>
				Go to Dashboard
			</Link>
		</div>
	);
}
