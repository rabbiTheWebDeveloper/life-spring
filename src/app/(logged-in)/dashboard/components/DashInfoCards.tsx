const DashInfoCards = ({ text, amount, icon, loading = false }: any) => {
	if (loading) {
		return (
			<div className="bg-white w-full rounded-xl shadow-sm flex justify-between items-end px-3 py-8 mb-4 md:mb-0 animate-pulse">
				<div className="flex-1">
					<div className="h-8 bg-gray-200 rounded w-20 mb-3"></div>
					<div className="h-4 bg-gray-200 rounded w-32"></div>
				</div>
				<div className="w-10 h-10 bg-gray-200 rounded mb-2"></div>
			</div>
		);
	}

	return (
		// <div className="bg-white w-full  rounded-xl shadow-sm flex flex-col justify-center items-center px-4 py-5 mb-4 md:mb-0">
		// 	<span className="mb-2">{icon}</span>
		// 	<p className="text-gray-700 text-sm font-medium text-center">{text}</p>
		// 	<p className="text-zinc-600 text-4xl font-bold mt-1">{amount}</p>
		// </div>
		<div className="bg-white w-full rounded-xl shadow-sm flex justify-between items-end px-3 py-8 mb-4 md:mb-0">
      <div>
				<p className="text-zinc-600 text-2xl lg:text-3xl font-bold mt-1">{amount}</p>
				<p className="text-gray-500 text-[13px] pt-2">{text}</p>
			</div>
			<span className="mb-2">{icon}</span>

		</div>
	);
};

export default DashInfoCards;
