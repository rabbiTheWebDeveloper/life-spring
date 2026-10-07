import StatCards from "./components/StatCards";
import DashboardAnalyticsSection from "./components/DashboardAnalyticsSection";

interface Props {
	searchParams: { [key: string]: string | undefined };
}

const page = async () => {
	return (
		<div className="flex flex-col gap-6 p-2 sm:p-5 pb-20 max-w-[1720px] mx-auto w-full">
			<StatCards />
			<DashboardAnalyticsSection />
		</div>
	);
};

export default page;
