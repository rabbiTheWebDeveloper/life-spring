import { get } from "@/api/ApiClient";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import InvoiceTabs from "./components/InvoiceTabs";

interface Props {
	searchParams: { [key: string]: string | undefined };
}

const page = async ({ searchParams }: Props) => {
	const page = searchParams.page ?? 0;
	const date = searchParams.date;
	const search = searchParams.search;
	const isDisbursed = searchParams.isDisbursed ?? "false";

	const url = `v1/transaction/invoices?size=10`;
	const statusUrl = `${url}&isDisbursed=${isDisbursed}`;
	const urlPage = `${statusUrl}&page=${page}`;
	const prop = "search";
	const dateUrl = `${urlPage}&date=${date}`;

	let finalUrl;

	if (date) {
		finalUrl = dateUrl;
	} else {
		finalUrl = search ? `${urlPage}&${prop}=${search}` : `${urlPage}`;
	}
	const invoiceData: any = await get<any>(`${finalUrl}&sort=id:desc`);

	return (
		<ContentWrapper>
			<InvoiceTabs invoices={invoiceData?.data} />
		</ContentWrapper>
	);
};

export default page;
