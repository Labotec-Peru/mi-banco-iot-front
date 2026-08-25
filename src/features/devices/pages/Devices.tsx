import PageContainer from "../../../layouts/PageContainer";
import StatsRow from "../../dashboard/components/StatsRow";
import SeriesTabla from "../components/SeriesTabla";

export default function Devices() {
  return (
    <PageContainer>
      <StatsRow />      
      <SeriesTabla />
    </PageContainer>
  );
}