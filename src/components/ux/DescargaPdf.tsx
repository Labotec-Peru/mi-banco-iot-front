import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfBoleta from './PdfBoleta';
import { type BoletaData, boletaDataExample } from '../../config/types';
import { Button } from '@heroui/react';

interface DescargaPdfProps {
  data?: BoletaData;
  fileName?: string;
  buttonText?: string;
  loadingText?: string;
}

const DescargaPdf: React.FC<DescargaPdfProps> = ({
  data = boletaDataExample,
  fileName = 'boleta-agua.pdf',
  buttonText = '📄 Descargar Boleta PDF',
  loadingText = 'Generando PDF...',
}) => {
  return (
    <Button size='sm'  >
      <PDFDownloadLink
        document={<PdfBoleta data={data} />}
        fileName={fileName}
      >
        {({ loading, error }) => {
          if (error) {
            return <span style={{ color: 'red' }}>Error al generar el PDF</span>;
          }
          return loading ? loadingText : buttonText;
        }}
      </PDFDownloadLink>
    </Button>
  );
};

export default DescargaPdf;