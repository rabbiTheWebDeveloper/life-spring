import React from "react";

type SummaryCardProps = {
	data: any;
	loading?: boolean;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ data, loading = false }: any) => {
	const formatKey = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

	const formatAmount = (amount: any) => `৳ ${Number(amount).toFixed(2)}`;

	if (loading) {
		const entries = Object.keys(data || {});
		const skeletonCount = entries.length > 0 ? entries.length : 8;
		return (
			<div className="rounded-lg px-3 bg-white w-full mx-auto">
				<div className="animate-pulse">
					<div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 text-center">
						{Array.from({ length: skeletonCount }).map((_, index) => (
							<div key={index} className="bg-gray-50 p-2 rounded-md shadow-sm">
								<div className="h-3 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
								<div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-lg px-3 bg-white w-full mx-auto">
			<h2 className="text-base font-semibold mb-2 text-center text-gray-800">Financial Summary</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 text-center">
				{Object?.entries(data || {}).map(([key, value]) => (
					<div key={key} className="bg-gray-50 p-2 rounded-md shadow-sm">
						<div className="text-xs text-gray-500 capitalize">{formatKey(key)}</div>
						<div className="text-base font-semibold text-gray-800">{formatAmount(value)}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SummaryCard;
