"use client";
import { useRouter } from "next/navigation";

export default function ResetFilterButton({ onButtonClick, setIsReset }: any) {
	const router = useRouter();

	const handleReset = () => {
		setIsReset?.(true);
		onButtonClick?.();

		router.push("?size=10&page=0");
	};

	return (
		<button onClick={handleReset} className="bg-red-500 text-white px-3 py-2 rounded-md text-sm">
			Reset
		</button>
	);
}
