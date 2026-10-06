"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PaginationData {
	totalItems: number;
	page: number;
	size: number;
	hasNext?: boolean;
}

interface Props {
	url: string;
	pagination: any;
}

export function Paginator({ pagination, url }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [currentPage, setCurrentPage] = useState(0);
	const totalPages = Math.ceil(pagination?.totalItems / pagination?.size);

	useEffect(() => {
		const pageParam = searchParams.get("page");
		if (pageParam) {
			const page = parseInt(pageParam, 10);
			if (!isNaN(page) && page >= 0 && page < totalPages) {
				setCurrentPage(page);
			}
		}
	}, [searchParams, totalPages]);

	const handlePageChange = (page: number) => {
		if (page >= 0 && page < totalPages) {
			setCurrentPage(page);
			router.push(`${url}&page=${page}`, { scroll: false });
		}
	};

	const pageNumbers = [];

	if (totalPages <= 5) {
		for (let i = 0; i < totalPages; i++) {
			pageNumbers.push(i);
		}
	} else {
		const startPage = Math.max(currentPage - 2, 0);
		const endPage = Math.min(startPage + 4, totalPages - 1);

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i);
		}
	}

	return (
		<div className="flex items-center justify-center my-8">
			{/* showing totals items */}

			{pagination?.totalItems > 0 && (
				<p className="text-sm text-gray-500">
					Showing <span className="text-primary-400 font-bold">{currentPage * pagination.size + 1}</span> to{" "}
					<span className="text-primary-400 font-bold">
						{Math.min((currentPage + 1) * pagination.size, pagination.totalItems)}
					</span>{" "}
					of <span className="text-primary-400 font-bold">{pagination.totalItems}</span> entries
				</p>
			)}

			{totalPages > 0 && (
				<>
					<button
						className={`px-2 md:px-4 text-xs md:text-sm py-1 rounded-l-md ${
							currentPage === 0 ? "text-[#C4C4C4] cursor-not-allowed" : "text-primary-400"
						}`}
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 0}
					>
						Previous
					</button>

					{pageNumbers.map((page) => (
						<button
							key={page}
							className={`px-3 py-1 md:mx-1 rounded-lg ${
								page === currentPage ? "bg-primary-400 text-white font-semibold" : "bg-white text-primary-400 hover:bg-gray-200"
							}`}
							onClick={() => handlePageChange(page)}
						>
							{page + 1}
						</button>
					))}

					<button
						className={`px-2 md:px-4 text-xs md:text-sm py-2 rounded-r-md ${
							currentPage === totalPages - 1 ? "text-[#C4C4C4] cursor-not-allowed" : "text-primary-400"
						}`}
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages - 1}
					>
						Next
					</button>
				</>
			)}
		</div>
	);
}
