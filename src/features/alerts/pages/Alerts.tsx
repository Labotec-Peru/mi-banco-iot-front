import PageContainer from "../../../layouts/PageContainer";
import AlertasActivasTabla from "../components/AlertasActivasTabla";
import StatsRow from "../../dashboard/components/StatsRow";

export default function Alerts() {
  return (
    <PageContainer>
      <StatsRow />      
      <AlertasActivasTabla />
    </PageContainer>
  );
}