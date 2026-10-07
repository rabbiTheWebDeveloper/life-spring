"use client";

import DashInfoCards from "@/app/(logged-in)/dashboard/components/DashInfoCards";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import SidebarPermission from "@/app/components/sidebar/SidebarPermisson";
import { useEffect, useRef, useState } from "react";
import { AiOutlineRollback } from "react-icons/ai";
import {
	FaCalendarAlt,
	FaCheckCircle,
	FaClinicMedical,
	FaClipboardCheck,
	FaCoins,
	FaMoneyBillWave,
	FaMoneyCheckAlt,
	FaReceipt,
	FaTags,
	FaUserCheck,
	FaUserInjured,
	FaUserMd,
	FaUserShield,
	FaUserTie,
	FaThLarge,
	FaBolt,
} from "react-icons/fa";
import { MdOutlinePayments, MdPendingActions } from "react-icons/md";
import { getCountStats, getDashboardStats, getPaymentStats } from "../actions/getDashboardStats";

const StatCards = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const loadedCountRef = useRef(0);
	const [activeCategory, setActiveCategory] = useState<"all" | "today" | "finance" | "organization">("all");

	const [dashboardStats, setDashboardStats] = useState<any>({
		totalAppointments: 0,
		todayAppointmentSlot: 0,
		totalCompletedAppointments: 0,
		todayConfirmedAppointments: 0,
		todayPendingAppointments: 0,
		todayVisitedAppointments: 0,
		totalAppointmentPaymentReceived: 0,
		currentDateAppointmentPaymentReceived: 0,
		doctorCount: 0,
		patientCount: 0,
		branchCount: 0,
		executiveCount: 0,
		activeExecutiveCount: 0,
		totalVat: 0,
		totalDiscount: 0,
		totalRefundAmount: 0,
		currentDateTotalRefundAmount: 0,
		totalFee: 0,
	});

	const totalFetches = 3;

	const checkLoadingComplete = () => {
		loadedCountRef.current++;
		if (loadedCountRef.current >= totalFetches) {
			setLoading(false);
		}
	};

	const fetchAllStats = async () => {
		setLoading(true);
		loadedCountRef.current = 0;

		try {
			const res: any = await getDashboardStats();
			if (res?.success) {
				setDashboardStats((prev: any) => ({ ...prev, ...res.data }));
			}
		} catch (error) {
			console.error("Failed to Fetch Dashboard Stats", error);
		} finally {
			checkLoadingComplete();
		}

		try {
			const res: any = await getPaymentStats();
			if (res?.success) {
				setDashboardStats((prev: any) => ({ ...prev, ...res.data }));
			}
		} catch (error) {
			console.error("Failed to Fetch Payment Stats", error);
		} finally {
			checkLoadingComplete();
		}

		try {
			const res: any = await getCountStats();
			if (res?.success) {
				setDashboardStats((prev: any) => ({ ...prev, ...res.data }));
			}
		} catch (error) {
			console.error("Failed to Fetch Count Stats", error);
		} finally {
			checkLoadingComplete();
		}
	};

	useEffect(() => {
		fetchAllStats();
	}, []);

	const allCards = [
		// Today's Pulse
		{
			category: "today",
			text: "Today's Appointment Slots",
			amount: dashboardStats?.todayAppointmentSlot,
			icon: <FaCalendarAlt size={22} className="text-blue-600" />,
			badge: "Today",
			badgeColor: "blue" as const,
		},
		{
			category: "today",
			text: "Today's Confirmed Appts",
			amount: dashboardStats?.todayConfirmedAppointments,
			icon: <FaUserCheck size={22} className="text-emerald-600" />,
			badge: "Confirmed",
			badgeColor: "green" as const,
		},
		{
			category: "today",
			text: "Today's Pending Appts",
			amount: dashboardStats?.todayPendingAppointments,
			icon: <MdPendingActions size={22} className="text-amber-500" />,
			badge: "Pending",
			badgeColor: "amber" as const,
		},
		{
			category: "today",
			text: "Today's Visited Appts",
			amount: dashboardStats?.todayVisitedAppointments,
			icon: <FaCheckCircle size={22} className="text-teal-600" />,
			badge: "Visited",
			badgeColor: "green" as const,
		},
		{
			category: "today",
			text: "Today's Payment Received",
			amount: `৳${(dashboardStats?.currentDateAppointmentPaymentReceived || 0).toLocaleString()}`,
			icon: <FaMoneyCheckAlt size={22} className="text-emerald-700" />,
			badge: "Collections",
			badgeColor: "green" as const,
		},
		{
			category: "today",
			text: "Today's Payment Refunded",
			amount: `৳${(dashboardStats?.currentDateTotalRefundAmount || 0).toLocaleString()}`,
			icon: <AiOutlineRollback size={22} className="text-rose-500" />,
			badge: "Refund",
			badgeColor: "rose" as const,
		},

		// Financial & Revenue
		{
			category: "finance",
			text: "Total Payment Received",
			amount: `৳${(dashboardStats?.totalAppointmentPaymentReceived || 0).toLocaleString()}`,
			icon: <MdOutlinePayments size={22} className="text-emerald-600" />,
			badge: "All-time",
			badgeColor: "green" as const,
		},
		{
			category: "finance",
			text: "Total Fee Charged",
			amount: `৳${(dashboardStats?.totalFee || 0).toLocaleString()}`,
			icon: <FaCoins size={22} className="text-amber-600" />,
			badge: "Billable",
			badgeColor: "amber" as const,
		},
		{
			category: "finance",
			text: "Total VAT Collected",
			amount: `৳${(dashboardStats?.totalVat || 0).toLocaleString()}`,
			icon: <FaReceipt size={22} className="text-orange-500" />,
			badge: "Govt VAT",
			badgeColor: "purple" as const,
		},
		{
			category: "finance",
			text: "Total Discount Given",
			amount: `৳${(dashboardStats?.totalDiscount || 0).toLocaleString()}`,
			icon: <FaTags size={22} className="text-pink-500" />,
			badge: "Savings",
			badgeColor: "purple" as const,
		},
		{
			category: "finance",
			text: "Total Payment Refunded",
			amount: `৳${(dashboardStats?.totalRefundAmount || 0).toLocaleString()}`,
			icon: <FaMoneyBillWave size={22} className="text-rose-600" />,
			badge: "Refunds",
			badgeColor: "rose" as const,
		},

		// Organization & Capacity
		{
			category: "organization",
			text: "Active Branches",
			amount: dashboardStats?.branchCount,
			icon: <FaClinicMedical size={22} className="text-purple-600" />,
			badge: "Centres",
			badgeColor: "purple" as const,
		},
		{
			category: "organization",
			text: "Total Doctors",
			amount: dashboardStats?.doctorCount,
			icon: <FaUserMd size={22} className="text-cyan-600" />,
			badge: "Specialists",
			badgeColor: "blue" as const,
		},
		{
			category: "organization",
			text: "Registered Patients",
			amount: dashboardStats?.patientCount,
			icon: <FaUserInjured size={22} className="text-blue-600" />,
			badge: "Total",
			badgeColor: "blue" as const,
		},
		{
			category: "organization",
			text: "Active CRM Executives",
			amount: dashboardStats?.activeExecutiveCount,
			icon: <FaUserShield size={22} className="text-indigo-600" />,
			badge: "Staff",
			badgeColor: "blue" as const,
		},
		{
			category: "organization",
			text: "Total Visited Appointments",
			amount: dashboardStats?.totalAppointments,
			icon: <FaCheckCircle size={22} className="text-emerald-600" />,
			badge: "Completed",
			badgeColor: "green" as const,
		},
		{
			category: "organization",
			text: "Total Completed Appts",
			amount: dashboardStats?.totalCompletedAppointments,
			icon: <FaClipboardCheck size={22} className="text-teal-600" />,
			badge: "Closed",
			badgeColor: "green" as const,
		},
		{
			category: "organization",
			text: "Total Assigned Executives",
			amount: dashboardStats?.executiveCount,
			icon: <FaUserTie size={22} className="text-pink-600" />,
			badge: "All Staff",
			badgeColor: "purple" as const,
		},
	];

	const filteredCards =
		activeCategory === "all"
			? allCards
			: allCards.filter((c) => c.category === activeCategory);

	return (
		<SidebarPermission tag="dashboard">
			<RolePermissionChecker tag="dashboard" name="list">
				<div className="w-full flex flex-col gap-3">
					{/* Header bar for Stats with category switcher */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-slate-200/70 shadow-sm">
						<div className="flex items-center gap-2">
							<span className="w-2 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
							<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
								Overall Hospital Overview
							</span>
							<span className="text-[11px] font-semibold text-slate-400">
								({filteredCards.length} KPIs)
							</span>
						</div>

						{/* Quick category pills */}
						<div className="flex items-center bg-slate-100/80 p-1 rounded-xl self-start sm:self-auto text-xs">
							<button
								type="button"
								onClick={() => setActiveCategory("all")}
								className={`px-3 py-1 font-bold rounded-lg transition-all ${
									activeCategory === "all"
										? "bg-white text-blue-600 shadow-sm"
										: "text-slate-500 hover:text-slate-800"
								}`}
							>
								All KPIs
							</button>
							<button
								type="button"
								onClick={() => setActiveCategory("today")}
								className={`px-3 py-1 font-bold rounded-lg transition-all ${
									activeCategory === "today"
										? "bg-white text-emerald-600 shadow-sm"
										: "text-slate-500 hover:text-slate-800"
								}`}
							>
								Today's Pulse
							</button>
							<button
								type="button"
								onClick={() => setActiveCategory("finance")}
								className={`px-3 py-1 font-bold rounded-lg transition-all ${
									activeCategory === "finance"
										? "bg-white text-purple-600 shadow-sm"
										: "text-slate-500 hover:text-slate-800"
								}`}
							>
								Revenue
							</button>
							<button
								type="button"
								onClick={() => setActiveCategory("organization")}
								className={`px-3 py-1 font-bold rounded-lg transition-all ${
									activeCategory === "organization"
										? "bg-white text-indigo-600 shadow-sm"
										: "text-slate-500 hover:text-slate-800"
								}`}
							>
								Capacity
							</button>
						</div>
					</div>

					{/* Grid of Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{loading
							? Array.from({ length: 8 }).map((_, index) => (
									<DashInfoCards key={`skeleton-${index}`} loading={true} />
							  ))
							: filteredCards.map((card, index) => (
									<DashInfoCards
										key={index}
										text={card.text}
										amount={card.amount}
										icon={card.icon}
										badge={card.badge}
										badgeColor={card.badgeColor}
										loading={false}
									/>
							  ))}
					</div>
				</div>
			</RolePermissionChecker>
		</SidebarPermission>
	);
};

export default StatCards;
