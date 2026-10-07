"use client";

import React from "react";

interface Props {
	text?: string;
	amount?: string | number;
	icon?: React.ReactNode;
	loading?: boolean;
	subtitle?: string;
	badge?: string;
	badgeColor?: "blue" | "green" | "amber" | "purple" | "rose";
}

const DashInfoCards = ({
	text,
	amount,
	icon,
	loading = false,
	subtitle,
	badge,
	badgeColor = "blue",
}: Props) => {
	if (loading) {
		return (
			<div className="bg-white/90 backdrop-blur-sm w-full rounded-2xl p-5 border border-slate-200/70 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex justify-between items-center animate-pulse">
				<div className="flex-1">
					<div className="h-7 bg-slate-200 rounded-lg w-24 mb-2.5"></div>
					<div className="h-3.5 bg-slate-100 rounded w-32"></div>
				</div>
				<div className="w-12 h-12 bg-slate-100 rounded-2xl flex-shrink-0"></div>
			</div>
		);
	}

	const formattedAmount =
		typeof amount === "number"
			? amount.toLocaleString()
			: typeof amount === "string" && !isNaN(Number(amount)) && amount.trim() !== ""
			? Number(amount).toLocaleString()
			: amount ?? 0;

	return (
		<div className="relative bg-white/95 backdrop-blur-md w-full rounded-2xl p-5 border border-slate-200/70 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-blue-200 transition-all duration-200 group overflow-hidden">
			{/* Subtle top accent gradient line */}
			<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

			<div className="flex justify-between items-start gap-3">
				<div className="flex flex-col min-w-0 pr-1">
					<div className="flex items-center gap-2">
						<span className="text-slate-800 text-2xl lg:text-3xl font-black tracking-tight group-hover:text-blue-600 transition-colors truncate">
							{formattedAmount}
						</span>
						{badge && (
							<span
								className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
									badgeColor === "green"
										? "bg-emerald-50 text-emerald-700 border border-emerald-200"
										: badgeColor === "amber"
										? "bg-amber-50 text-amber-700 border border-amber-200"
										: badgeColor === "rose"
										? "bg-rose-50 text-rose-700 border border-rose-200"
										: badgeColor === "purple"
										? "bg-purple-50 text-purple-700 border border-purple-200"
										: "bg-blue-50 text-blue-700 border border-blue-200"
								}`}
							>
								{badge}
							</span>
						)}
					</div>

					<span className="text-slate-500 text-xs font-semibold pt-1.5 line-clamp-1 group-hover:text-slate-700 transition-colors">
						{text}
					</span>

					{subtitle && (
						<span className="text-slate-400 text-[11px] font-medium pt-0.5">
							{subtitle}
						</span>
					)}
				</div>

				<div className="w-12 h-12 rounded-2xl bg-slate-50/90 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-blue-50/70 group-hover:border-blue-100 transition-all duration-200 shadow-sm">
					{icon}
				</div>
			</div>
		</div>
	);
};

export default DashInfoCards;
