import { Spin } from "antd";

/**
 * Shared fallback for route-level `loading.tsx` files.
 *
 * Admin pages are server components that await API calls before rendering, so
 * without a Suspense boundary the browser sits on the previous screen showing
 * nothing after a click. Next.js renders this the moment navigation starts.
 */
export default function RouteLoading({ label = "Loading..." }: { label?: string }) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-24 w-full">
			<Spin size="large" />
			<p className="text-sm text-gray-500">{label}</p>
		</div>
	);
}
