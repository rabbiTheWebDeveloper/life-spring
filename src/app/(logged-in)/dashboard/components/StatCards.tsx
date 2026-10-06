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
} from "react-icons/fa";
import { MdOutlinePayments, MdPendingActions } from "react-icons/md";

import { getCountStats, getDashboardStats, getPaymentStats } from "../actions/getDashboardStats";

const StatCards = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const loadedCountRef = useRef(0);
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

	useEffect(() => {
		setLoading(true);
		loadedCountRef.current = 0;
		const fetchData = async () => {
			try {
				const res: any = await getDashboardStats();
				// console.log(res);
				if (res?.success) {
					setDashboardStats((prev: any) => ({
						...prev,
						...res.data,
					}));
				} else {
					throw new Error(res?.message || "Failed to Fetch Dashboard Stats");
				}
			} catch (error) {
				console.error("Failed to Fetch Dashboard Stats", error);
			} finally {
				checkLoadingComplete();
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res: any = await getPaymentStats();
				// console.log(res);
				if (res?.success) {
					setDashboardStats((prev: any) => ({
						...prev,
						...res.data,
					}));
				} else {
					throw new Error(res?.message || "Failed to Fetch Payment Stats");
				}
			} catch (error) {
				console.error("Failed to Fetch Payment Stats", error);
			} finally {
				checkLoadingComplete();
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res: any = await getCountStats();
				if (res?.success) {
					setDashboardStats((prev: any) => ({
						...prev,
						...res.data,
					}));
				} else {
					throw new Error(res?.message || "Failed to Fetch Count Stats");
				}
			} catch (error) {
				console.error("Failed to Fetch Count Stats", error);
			} finally {
				checkLoadingComplete();
			}
		};
		fetchData();
	}, []);

	const dashboardCards = [
		{
			text: "Today's Appointment Slot",
			amount: dashboardStats?.todayAppointmentSlot,
			icon: <FaCalendarAlt size={35} className="text-blue-500" />,
		},
		{
			text: "Today's Confirm Appointment",
			amount: dashboardStats?.todayConfirmedAppointments,
			icon: <FaUserCheck size={35} className="text-green-500" />,
		},
		{
			text: "Today's Pending Appointment",
			amount: dashboardStats?.todayPendingAppointments,
			icon: <MdPendingActions size={35} className="text-yellow-500" />,
		},
		{
			text: "Today's Visited Appointment",
			amount: dashboardStats?.todayVisitedAppointments,
			icon: <FaCheckCircle size={35} className="text-green-600" />,
		},
		{
			text: "Today's Payment Received",
			amount: dashboardStats?.currentDateAppointmentPaymentReceived,
			icon: <FaMoneyCheckAlt size={35} className="text-green-700" />,
		},
		{
			text: "Today's Payment Refunded",
			amount: dashboardStats?.currentDateTotalRefundAmount,
			// amount: dashboardStats?.currentDateTotalRefundAmount,
			icon: <AiOutlineRollback size={35} className="text-red-500" />,
		},
		{
			text: "Total Payment Refunded",
			amount: dashboardStats?.totalRefundAmount,
			// amount: dashboardStats?.totalRefundAmount,
			icon: <FaMoneyBillWave size={35} className="text-red-500" />,
		},
		{
			text: "Total Payment Received",
			amount: dashboardStats?.totalAppointmentPaymentReceived,
			icon: <MdOutlinePayments size={35} className="text-green-700" />,
		},
		{
			text: "Total VAT Collected",
			amount: dashboardStats?.totalVat,
			icon: <FaReceipt size={35} className="text-orange-500" />,
		},
		{
			text: "Total Discount Given",
			amount: dashboardStats?.totalDiscount,
			icon: <FaTags size={35} className="text-pink-500" />,
		},
		{
			text: "Total Fee Charged",
			amount: dashboardStats?.totalFee,
			icon: <FaCoins size={35} className="text-yellow-600" />,
		},
		{
			text: "Branch",
			amount: dashboardStats?.branchCount,
			icon: <FaClinicMedical size={35} className="text-purple-600" />,
		},
		{
			text: "Doctors",
			amount: dashboardStats?.doctorCount,
			icon: <FaUserMd size={35} className="text-cyan-600" />,
		},
		{
			text: "Patients",
			amount: dashboardStats?.patientCount,
			icon: <FaUserInjured size={35} className="text-blue-600" />,
		},

		{
			text: "Executive",
			amount: dashboardStats?.executiveCount,
			icon: <FaUserTie size={35} className="text-pink-600" />,
		},
		// {
		// 	text: "Total Appointment Slot",
		// 	amount: 28650,
		// 	icon: <FaCalendarCheck size={30} className="text-blue-500" />,
		// },
		{
			text: "Total Visited Appointment",
			amount: dashboardStats?.totalAppointments,
			icon: <FaCheckCircle size={35} className="text-green-600" />,
		},
		{
			text: "Total Completed Appointments",
			amount: dashboardStats?.totalCompletedAppointments,
			icon: <FaClipboardCheck size={35} className="text-green-500" />,
		},
		{
			text: "Total Active Executive",
			amount: dashboardStats?.activeExecutiveCount,
			icon: <FaUserShield size={35} className="text-indigo-600" />,
		},
	];

	return (
		<SidebarPermission tag="dashboard">
			<RolePermissionChecker tag="dashboard" name="list">
				<div className="w-full">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mt-4">
						{loading
							? Array.from({ length: dashboardCards.length }).map((_, index) => (
									<DashInfoCards key={`skeleton-${index}`} loading={true} />
							  ))
							: dashboardCards?.map((card, index) => (
									<DashInfoCards key={index} text={card.text} amount={card.amount} icon={card.icon} loading={false} />
							  ))}
					</div>
				</div>
			</RolePermissionChecker>
		</SidebarPermission>
	);
};

export default StatCards;
