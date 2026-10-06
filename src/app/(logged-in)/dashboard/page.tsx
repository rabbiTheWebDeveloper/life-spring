import StatCards from "./components/StatCards";
import DashboardAnalyticsSection from "./components/DashboardAnalyticsSection";

interface Props {
	searchParams: { [key: string]: string | undefined };
}

const page = async () => {
	return (
		<div className="flex flex-col gap-4 p-2 sm:p-4 pb-16">
			<StatCards />
			<DashboardAnalyticsSection />
		</div>
	);
};

export default page;

