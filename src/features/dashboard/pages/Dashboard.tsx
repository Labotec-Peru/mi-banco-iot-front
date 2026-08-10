import DashboardHeader from "../components//DashboardHeader";
import StatsRow from "../components/StatsRow";
import BentoGrid from "../components/BentoGrid";
import PageContainer from "../../../layouts/PageContainer";

export default function Dashboard() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-6 h-full overflow-y-auto">
        <DashboardHeader userName="Jack" />
        <StatsRow />
        <BentoGrid />
      </div>
    </PageContainer>
  );
}