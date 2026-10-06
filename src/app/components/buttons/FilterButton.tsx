import { useRouter } from "next/navigation";

export default function FilterButton({ onButtonClick }: any) {
	const router = useRouter();
	return (
		<button onClick={onButtonClick} className="bg-green-500 text-white px-3 py-2 rounded-md text-sm">
			Search
		</button>
	);
}
