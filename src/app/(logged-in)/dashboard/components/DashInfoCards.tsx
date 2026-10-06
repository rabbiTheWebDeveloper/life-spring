"use client";

import React from "react";

interface Props {
	text?: string;
	amount?: string | number;
	icon?: React.ReactNode;
	loading?: boolean;
}

const DashInfoCards = ({ text, amount, icon, loading = false }: Props) => {
	if (loading) {
		return (
			<div className="bg-white w-full rounded-2xl p-5 border border-slate-200/60 shadow-sm flex justify-between items-end animate-pulse">
				<div className="flex-1">
					<div className="h-7 bg-slate-200 rounded-lg w-24 mb-3"></div>
					<div className="h-3.5 bg-slate-100 rounded w-32"></div>
				</div>
				<div className="w-11 h-11 bg-slate-100 rounded-xl mb-1"></div>
			</div>
		);
	}

	return (
		<div className="bg-white w-full rounded-2xl p-5 border border-slate-200/70 shadow-sm flex justify-between items-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
			<div className="flex flex-col min-w-0 pr-2">
				<span className="text-slate-800 text-2xl lg:text-3xl font-extrabold tracking-tight group-hover:text-blue-600 transition-colors truncate">
					{amount}
				</span>
				<span className="text-slate-400 text-xs font-medium pt-1.5 line-clamp-1">
					{text}
				</span>
			</div>
			<div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50/80 transition-colors">
				{icon}
			</div>
		</div>
	);
};

export default DashInfoCards;
