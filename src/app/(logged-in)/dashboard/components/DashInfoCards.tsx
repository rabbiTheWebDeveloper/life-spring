"use client";

import React from "react";

interface Props {
	text?: string;
	amount?: string | number;
	icon?: React.ReactNode;
	loading?: boolean;
	subtitle?: string;
	badge?: string;
	badgeColor?: "green" | "emerald" | "amber" | "rose" | "purple" | "blue" | "teal";
}

const DashInfoCards = ({
	text,
	amount,
	icon,
	loading = false,
	subtitle,
	badge,
	badgeColor = "emerald",
}: Props) => {
	if (loading) {
		return (
			<div className="bg-white/90 backdrop-blur-sm w-full rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] flex justify-between items-center animate-pulse">
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

	const getBadgeClasses = (color: string) => {
		switch (color) {
			case "emerald":
			case "green":
				return "bg-emerald-50 text-emerald-800 border-emerald-200/90";
			case "teal":
				return "bg-teal-50 text-teal-800 border-teal-200/90";
			case "amber":
				return "bg-amber-50 text-amber-800 border-amber-200/90";
			case "rose":
				return "bg-rose-50 text-rose-800 border-rose-200/90";
			case "purple":
				return "bg-purple-50 text-purple-800 border-purple-200/90";
			case "blue":
				return "bg-sky-50 text-sky-800 border-sky-200/90";
			default:
				return "bg-emerald-50 text-emerald-800 border-emerald-200/90";
		}
	};

	return (
		<div className="relative bg-white/95 backdrop-blur-md w-full rounded-2xl p-5 border border-slate-200/80 shadow-[0_4px_16px_-4px_rgba(19,64,20,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(19,64,20,0.09)] hover:-translate-y-1 hover:border-emerald-300 transition-all duration-200 group overflow-hidden">
			{/* Brand Accent top line on hover */}
			<div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

			<div className="flex justify-between items-start gap-3">
				<div className="flex flex-col min-w-0 pr-1 flex-1">
					<div className="flex items-center gap-2 flex-wrap">
						<span className="text-slate-900 text-2xl lg:text-3xl font-black tracking-tight group-hover:text-emerald-900 transition-colors truncate">
							{formattedAmount}
						</span>
						{badge && (
							<span
								className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${getBadgeClasses(
									badgeColor
								)}`}
							>
								{badge}
							</span>
						)}
					</div>

					<span className="text-slate-600 text-xs font-semibold pt-1.5 line-clamp-1 group-hover:text-slate-900 transition-colors">
						{text}
					</span>

					{subtitle && (
						<span className="text-slate-400 text-[11px] font-medium pt-0.5">
							{subtitle}
						</span>
					)}
				</div>

				<div className="w-12 h-12 rounded-2xl bg-slate-50/90 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-emerald-50/80 group-hover:border-emerald-200 transition-all duration-200 shadow-xs">
					{icon}
				</div>
			</div>
		</div>
	);
};

export default DashInfoCards;
