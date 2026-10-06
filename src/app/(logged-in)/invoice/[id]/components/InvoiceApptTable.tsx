'use client'
import React from 'react'
import { AppointmentDetail } from '../types/Types';

interface Props {
	appts: AppointmentDetail[]
}

const InvoiceApptTable = ({ appts }: Props) => {

	const headings = ['Appt ID', 'Fee', 'Discount', 'Payable', 'Amount', 'LifeSpring Comm. (%)', 'Doctor Payable', 'LifeSpring Comm. Amt.', 'Vat', 'Vat on Receive', 'Vat on Comm.', 'Net Revenue',  'Status'];
	const tableHeadStyle = "font-medium text-[#242222] border-b px-2 py-2 text-left";
	const tableBodyStyle = "text-gr border-b px-2 py-2 text-sm";
	return (
		<div className="overflow-x-auto">
			<table className="w-full min-w-max">
				<thead>
					<tr>
						{headings?.map((heading, index) => (
							<th key={index} className={tableHeadStyle}>
								{heading}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{appts?.map((appointment:any,index:number) => (
						<tr key={appointment.id}>
							<td className={tableBodyStyle}>{appointment?.appointment?.id || "-"}</td>
							<td className={tableBodyStyle}>{appointment?.fee || "-"}</td>
							<td className={tableBodyStyle}>{appointment?.discount || "-"}</td>
							<td className={tableBodyStyle}>{appointment?.payable || "-"}</td>
							<td className={tableBodyStyle}>{appointment?.amount || "-"}</td>
							<td className={tableBodyStyle}>{appointment.lifeSpringCommission
							}%
							</td>
							<td className={tableBodyStyle}>{appointment?.doctorPayable || "-"}</td>

							<td className={tableBodyStyle}>{appointment.lifeSpringCommissionAmount
							}</td>
							<td className={tableBodyStyle}>{appointment?.vatPercentage || "-"}</td>
							<td className={tableBodyStyle}>{appointment?.vatOnAcutalReceive || "-"}</td>
							<td className={tableBodyStyle}>{appointment?.vatOnCommision || "-"}</td>
							<td className={tableBodyStyle}>{appointment?.netRevenue || "-"}</td>
							<td className={tableBodyStyle}>{appointment?.status || "-"}</td>

						</tr>
					))}
				</tbody>
			</table>

		</div>
	)
}

export default InvoiceApptTable
