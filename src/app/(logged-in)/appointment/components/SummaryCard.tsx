export default function SummaryCard({ summary, loading = false }: any) {
	// const [summary, setSummary] = useState({
	// 	totalAppointmentPaymentReceived: 0,
	// 	currentDateAppointmentPaymentReceived: 0,
	// 	totalFee: 0,
	// 	totalDiscount: 0,
	// 	totalVat: 0,
	// 	totalDue: 0,
	// 	totalPaid: 0,
	// 	totalRefundAmount: 0,
	// 	currentDateTotalRefundAmount: 0,
	// });

	const entries = [
		{ label: "Patient Fee", value: summary?.totalFee },
		{ label: "Paid", value: summary?.totalPaidAmount },
		{ label: "VAT", value: summary?.totalVatAmount },
		{ label: "Due", value: summary?.totalDueAmount },
		{ label: "Discount", value: summary?.totalDiscount },
		{ label: "Refund", value: summary?.totalRefundAmount },
		{ label: "Balance", value: summary?.totalBalance },
	];

	if (loading) {
		return (
			<div className="rounded-lg px-3 bg-white w-full mx-auto">
				<div className="animate-pulse">
					<div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 text-center">
						{Array.from({ length: 7 }).map((_, index) => (
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
		<div className="rounded-lg px-3  bg-white w-full mx-auto">
			<h2 className="text-base font-semibold mb-2 text-center text-gray-800">Financial Summary</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 text-center">
				{entries.map((item, index) => (
					<div key={index} className="bg-gray-50 p-2 rounded-md shadow-sm">
						<div className="text-xs text-gray-500">{item.label}</div>
						<div className="text-base font-semibold text-gray-800">{Number(item.value).toFixed(2)}</div>
					</div>
				))}
			</div>
		</div>
	);
}
