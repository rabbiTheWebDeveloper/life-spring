"use client";

import FormattedDate from "@/app/components/layout/FormattedDate";
import { Paginator } from "@/app/components/layout/Paginator";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { buildDoctorId } from "../../doctor/types/Type";
import { Settlements } from "../types/Types";
import InvoiceModal from "./InvoiceModal";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";

interface Props {
	settlements: Settlements;
}

const SettlementTable = ({ settlements }: Props) => {
	const searchParams = useSearchParams();
	const urlParams = Object.fromEntries(searchParams);
	const id = urlParams.id || "";
	const from = urlParams.from || "";
	const to = urlParams.to || "";
	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const [showModal, setShowModal] = useState<boolean>(false);

	const headings = [
		"",
		"Appt. ID",
		"Transaction ID",
		"Doctor ID",
		"Doctor Name",
		"Order Val.",
		"LifeSpring Comm. %",
		"LifeSpring Comm. Amount",
		"Doctor Amount",
		"PGW %",
		"PGW Amount",
		"Vat %",
		"Vat on Receive",
		"Vat on Comm.",
		"Net Revenue",
		"Scheduled_Time",
		"Status",
	];
	const tableHeadStyle = "font-medium text-sm text-[#242222] border-b px-2 py-3";
	const tableBodyStyle = "text-gr text-sm border-b px-2 py-1";

	const handleRowSelect = (id: number) => {
		if (selectedRows.includes(id)) {
			setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
		} else {
			setSelectedRows([...selectedRows, id]);
		}
	};

	const handleCreateInvoice = () => {
		setShowModal(true);
	};

	const totalAppointments = selectedRows.length;
	const totalPaymentAmount = selectedRows.reduce((total, id) => {
		const settlement = settlements.appointments.find((data) => data.id === id);
		return total + (Number(settlement?.doctorPayable) || 0);
	}, 0);

	return (
		<div className="flex flex-col gap-2 border mr-4 rounded-md px-4">
			<div className="overflow-x-auto w-full">
				<RolePermissionChecker tag="administration-settlements" name="create">
					{selectedRows.length > 0 && (
						<button
							className="rounded-md py-1 px-2 mt-5 text-white text-sm font-semibold bg-primary-400 mb-4"
							onClick={handleCreateInvoice}
						>
							Create Invoice
						</button>
					)}
				</RolePermissionChecker>

				<table className="w-full min-w-max ">
					<thead className=" bg-[#f9fafb] border-b-2 text-left">
						<tr>
							{headings.map((heading, index) => (
								<th key={index} className={tableHeadStyle}>
									{heading}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{settlements.appointments.map((settlement:any, index) => (
							<tr className="hover:bg-zinc-100" key={settlement.id}>
								<RolePermissionChecker tag="administration-settlements" name="create">
									<td className={tableBodyStyle}>
										<input
											type="checkbox"
											checked={selectedRows.includes(settlement.id)}
											onChange={() => handleRowSelect(settlement.id)}
										/>
									</td>
								</RolePermissionChecker>

								<td className={tableBodyStyle}>{settlement.appointment.id}</td>
								<td className={tableBodyStyle}>{settlement.payment.transactionId}</td>
								<td className={tableBodyStyle}>{buildDoctorId(settlement.appointment.doctor.id)}</td>
								<td className={tableBodyStyle}>{settlement.appointment.doctor.name}</td>
								<td className={tableBodyStyle}>{settlement.payable}</td>
								<td className={tableBodyStyle}>{settlement.lifeSpringCommission
								}%
								</td>
								<td className={tableBodyStyle}>{settlement.lifeSpringCommissionAmount
								}</td>
								<td className={tableBodyStyle}>{settlement.doctorPayable}</td>
								<td className={tableBodyStyle}>{settlement.gatewayRate || 0}%</td>
								<td className={tableBodyStyle}>{settlement.gatewayCharge}</td>
								<td className={tableBodyStyle}>{settlement.vatPercentage || 0}%</td>
								<td className={tableBodyStyle}>{settlement.vatOnAcutalReceive}</td>
								<td className={tableBodyStyle}>{settlement.vatOnCommision}</td>
								<td className={tableBodyStyle}>{settlement.netRevenue}</td>

								<td className={tableBodyStyle}>
									<FormattedDate isoString={settlement.appointment.scheduleStart} />
								</td>
								<td className={tableBodyStyle}>
									<button className="rounded-md py-1 px-2	bg-[#FEDBDB] border-[#FD9393] text-[#B71212]">
										{settlement.status}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="flex justify-end bottom-5 text-right">
				<Paginator
					url={`/settlement?id=${id}${from ? `&from=${from}` : ""}${to ? `&to=${to}` : ""}`}
					pagination={settlements.pagination}
				/>
			</div>

			{showModal && (
				<InvoiceModal
					totalAppointments={totalAppointments}
					totalPaymentAmount={totalPaymentAmount}
					setShowModal={setShowModal}
					selectedIds={selectedRows}
				/>
			)}
		</div>
	);
};

export default SettlementTable;
