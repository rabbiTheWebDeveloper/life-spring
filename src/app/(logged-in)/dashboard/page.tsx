import StatCards from "./components/StatCards";
import DashboardAnalyticsSection from "./components/DashboardAnalyticsSection";

interface Props {
	searchParams: { [key: string]: string | undefined };
}

const page = async () => {
	return (
		<div className="bg-[#F5F6FA] min-h-full flex flex-col gap-2 pb-12">
			<StatCards />
			<DashboardAnalyticsSection />
		</div>
	);
};

export default page;

