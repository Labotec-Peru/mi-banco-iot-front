import PageContainer from "../../../layouts/PageContainer";
import AlertasActivasTabla from "../components/AlertasActivasTabla";
import HistorialAlertasTabla from "../components/HistorialAlertasTabla";
import { Accordion, AccordionItem } from "@heroui/react";

export default function Alerts() {
  return (
    <PageContainer>
      <Accordion defaultExpandedKeys={["2", "1"]} selectionMode="multiple" variant="splitted" >
        <AccordionItem key="1" aria-label="Alertas Activas" title="Alertas Activas">
          <AlertasActivasTabla />
        </AccordionItem>
        <AccordionItem key="2" aria-label="Alertas Históricas" title="Alertas Históricas">
          <HistorialAlertasTabla />
        </AccordionItem>
      </Accordion>
    </PageContainer>
  );
}