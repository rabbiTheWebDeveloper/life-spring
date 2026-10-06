import { get } from "@/api/ApiClient";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import { Doctors } from "../doctor/types/Type";
import SettlementSection from "./components/SettlementSection";
import { Settlements } from "./types/Types";

interface Props {
	searchParams: { [key: string]: string | undefined };
}

const Page = async ({ searchParams }: Props) => {
	const id = searchParams.id;
	const from = searchParams.from;
	const to = searchParams.to;
	const page = searchParams.page ?? 0;
	const name = searchParams.name;

	const doctors: any = await get<Doctors>(
		`v1/doctor/doctor-with-available-disbursements?size=100 ${name ? `&name=${name}` : ""}`
	);

	let settlements: any = {
		pagination: {
			totalItems: 0,
			page: 0,
			size: 100,
			hasNext: false,
		},
		appointments: [],
	};

	const allSettlements: any = await get<Settlements>(
		`v1/appointment/doctor/available-disbursements/all?size=10&page=${page}${
			from && to ? `&startDate=${from}&endDate=${to}` : ""
		}`
	);

	if (id) {
		settlements = await get<Settlements>(
			`v1/appointment/doctor/${id}/available-disbursements?size=10&page=${page}${
				from && to ? `&startDate=${from}&endDate=${to}` : ""
			}`
		);
	}

	return (
		<ContentWrapper>
			<div className="bg-white rounded-xl p-6">
				<SettlementSection
					doctors={doctors?.data}
					settlements={settlements?.data}
					allSettlements={allSettlements?.data}
				/>
			</div>
		</ContentWrapper>
	);
};

export default Page;
