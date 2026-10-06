//@ts-nocheck
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";

export default function GoBack() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [canGoBack, setCanGoBack] = useState(false);

	useEffect(() => {
		const currentPath: any = `${pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;
		let storedURLs: any = JSON.parse(sessionStorage.getItem("visitedURLs")) || [];

		if (storedURLs.length === 0 || storedURLs[storedURLs.length - 1] !== currentPath) {
			storedURLs = [...storedURLs, currentPath].slice(-5);
			sessionStorage.setItem("visitedURLs", JSON.stringify(storedURLs));
		}

		setCanGoBack(storedURLs.length > 1);
	}, [pathname, searchParams]);

	const goBack = () => {
		let storedURLs = JSON.parse(sessionStorage.getItem("visitedURLs")) || [];
		if (!canGoBack) {
			router.push("/dashboard");
		} else {
			if (storedURLs.length > 1) {
				storedURLs.pop();
				const previousURL = storedURLs[storedURLs.length - 1];
				sessionStorage.setItem("visitedURLs", JSON.stringify(storedURLs));
				router.push(previousURL);
			}
		}
	};

	return (
		<div>
			<button
				onClick={goBack}
				className="flex  justify-between items-center

				text-white font-bold py-1 px-2 min-w-fit rounded-lg border gap-2 bg-primary-600 ms-10 lg:ms-0"
			>
				<FaLongArrowAltLeft />
				{/*<span className="hidden lg:block">Back</span>*/}
			</button>
		</div>
	);
}
