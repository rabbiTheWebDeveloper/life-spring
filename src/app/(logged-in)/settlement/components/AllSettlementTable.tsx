import FormattedDate from "@/app/components/layout/FormattedDate";
import { Paginator } from "@/app/components/layout/Paginator";
import { useSearchParams } from "next/navigation";
import { buildDoctorId } from "../../doctor/types/Type";
import { Settlements } from "../types/Types";

interface Props {
	settlements: Settlements;
}

const AllSettlementTable = ({ settlements }: Props) => {
	const searchParams = useSearchParams();
	const urlParams = Object.fromEntries(searchParams);
	const from = urlParams?.from || "";
	const to = urlParams?.to || "";

	const headings = [
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
	const tableBodyStyle = "text-gr text-sm border-b px-2 py-2";

	return (
		<div className="flex flex-col gap-2 border mt-4 rounded-md">
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
					{settlements?.appointments?.map((settlement: any, index: number) => (
						<tr className="hover:bg-zinc-100" key={index}>
							<td className={tableBodyStyle}>{settlement?.appointment?.id}</td>
							<td className={tableBodyStyle}>{settlement?.payment?.transactionId}</td>
							<td className={tableBodyStyle}>{buildDoctorId(settlement?.appointment?.doctor?.id)}</td>
							<td className={tableBodyStyle}>{settlement?.appointment?.doctor?.name}</td>
							<td className={tableBodyStyle}>{settlement?.payable}</td>
							<td className={tableBodyStyle}>{settlement?.lifeSpringCommission ?? 0}%</td>
							<td className={tableBodyStyle}>{settlement?.lifeSpringCommissionAmount}</td>
							<td className={tableBodyStyle}>{settlement?.doctorPayable}</td>
							<td className={tableBodyStyle}>{settlement?.gatewayRate ?? 0}%</td>
							<td className={tableBodyStyle}>{settlement?.gatewayCharge}</td>
							<td className={tableBodyStyle}>{settlement?.vatPercentage ?? 0}%</td>
							<td className={tableBodyStyle}>{settlement?.vatOnAcutalReceive}</td>
							<td className={tableBodyStyle}>{settlement?.vatOnCommision}</td>
							<td className={tableBodyStyle}>{settlement?.netRevenue}</td>
							<td className={tableBodyStyle}>
								<FormattedDate isoString={settlement?.appointment?.scheduleStart}/>
							</td>
							<td className={tableBodyStyle}>
								<button className="rounded-md py-1 px-2	bg-[#FEDBDB] border-[#FD9393] text-[#B71212]">
									{settlement?.status}
								</button>
							</td>
						</tr>
					))}
					</tbody>

				</table>
			</div>

			<div className="flex md:justify-end bottom-5 text-right">
				<Paginator
					url={`/settlement?size=10${from ? `&from=${from}` : ""}${to ? `&to=${to}` : ""}`}
					pagination={settlements?.pagination}
				/>
			</div>
		</div>
	);
};

export default AllSettlementTable;
