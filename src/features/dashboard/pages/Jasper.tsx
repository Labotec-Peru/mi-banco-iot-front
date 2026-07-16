import { Accordion, AccordionItem } from "@heroui/react";
import PageContainer from "../../../layouts/PageContainer";
import JasperAlertasTabla from "../components/JasperAlertasTabla";
import JasperBitacoraTabla from "../components/JasperBitacoraTabla";

export default function Jasper() {
  return (
    <PageContainer>
      <Accordion defaultExpandedKeys={["2", "1"]} selectionMode="multiple" >
        <AccordionItem  key="1" aria-label="Alertas Activas " title="Alertas Activas">
         <JasperAlertasTabla />
        </AccordionItem>
        <AccordionItem key="2" aria-label="Alertas Históricas" title="Alertas Históricas">
           <JasperBitacoraTabla />
        </AccordionItem>      
      </Accordion>
    </PageContainer>
  );
}