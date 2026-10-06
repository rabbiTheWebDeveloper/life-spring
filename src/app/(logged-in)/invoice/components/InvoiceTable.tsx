"use client";

import FormattedDate from "@/app/components/layout/FormattedDate";
import FormattedTime from "@/app/components/layout/FormattedTime";
import { indexCount } from "@/helper/IndexCount";
import { useRouter } from "next/navigation";
import { buildDoctorId } from "../../doctor/types/Type";
import { Invoices } from "../types/Types";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";

interface Props {
	invoices: Invoices;
	isDisbursed: string;
}

const InvoiceTable = ({ invoices, isDisbursed }: Props) => {
	const headings =
		isDisbursed === "false"
			? ["No", "Requested Time", "Amount", "Doctor ID", "Doctor Name", "Doctor BMDC Code", "Action"]
			: [
					"No",
					"Requested Time",
					"Disbursed Time",
					"Payment Method",
					"Ref. No.",
					"Amount",
					"Doctor ID",
					"Doctor Name",
					"Doctor BMDC Code",
					"Action",
			  ];
	const invoiceData = invoices?.invoices;
	const tableHeadStyle = "font-medium text-sm text-[#242222] border-b px-2 py-3";
	const tableBodyStyle = "text-gr text-sm border-b px-2 py-1";

	const router = useRouter();
	return (
		<div className="flex flex-col gap-2 border mr-4 rounded-md">
			<div className="overflow-x-auto w-full">
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
						{invoiceData?.map((invoice, index) => (
							<tr key={invoice.id}>
								<td className={tableBodyStyle}>
									{indexCount(index, invoices?.pagination?.page, invoices?.pagination?.size)}
								</td>

								<td className={tableBodyStyle}>
									<>
										<FormattedTime isoString={invoice?.requestedAt} />,{" "}
										<FormattedDate isoString={invoice?.requestedAt} />
									</>
								</td>
								{isDisbursed === "true" && (
									<td className={tableBodyStyle}>
										{invoice?.disbursedAt ? (
											<>
												<FormattedTime isoString={invoice?.disbursedAt} />,{" "}
												<FormattedDate isoString={invoice?.disbursedAt} />
											</>
										) : (
											"-"
										)}
									</td>
								)}
								{isDisbursed === "true" && <td className={tableBodyStyle}>{invoice?.paymentMethod || "-"}</td>}
								{isDisbursed === "true" && <td className={tableBodyStyle}>{invoice?.refNo || "-"}</td>}
								<td className={tableBodyStyle}>{invoice?.amount || 0}</td>
								<td className={tableBodyStyle}>{buildDoctorId(invoice?.doctor?.id) || "-"}</td>
								<td className={tableBodyStyle}>{invoice?.doctor?.name || "-"}</td>
								<td className={tableBodyStyle}>{invoice?.doctor?.bmdcCode || "-"}</td>
								<RolePermissionChecker tag="administration-invoice" name="view">
									<td className="border-b px-2 py-2 font-medium text-primary">
										<button
											className="bg-primary-400 rounded-md px-2 py-0.5 text-white"
											onClick={() => router.push(`/invoice/${invoice.id}`)}
										>
											Details
										</button>
									</td>
								</RolePermissionChecker>

							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default InvoiceTable;
