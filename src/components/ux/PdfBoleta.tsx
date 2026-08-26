import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { BoletaData } from '../../config/types';
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica.ttf' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    borderBottom: '1px solid #000',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'column' as const,
  },
  headerRight: {
    flexDirection: 'column' as const,
    alignItems: 'flex-end' as const,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  table: {
    display: 'flex' as const,
    width: '100%',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row' as const,
    borderBottom: '1px solid #ccc',
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    paddingHorizontal: 4,
  },
  tableCellRight: {
    flex: 1,
    fontSize: 9,
    paddingHorizontal: 4,
    textAlign: 'right' as const,
  },
  totalRow: {
    flexDirection: 'row' as const,
    borderTop: '2px solid #000',
    paddingVertical: 5,
    marginTop: 5,
  },
  graphContainer: {
    marginVertical: 20,
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 4,
  },
  graphTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center' as const,
  },
  graphBars: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    justifyContent: 'center' as const,
    height: 150,
    gap: 3,
  },
  barWrapper: {
    alignItems: 'center' as const,
  },
  bar: (height: number) => ({
    width: 20,
    height: height * 10,
    backgroundColor: '#4A90D9',
    borderRadius: 2,
  }),
  barLabel: {
    textAlign: 'center' as const,
    fontSize: 7,
    marginTop: 5,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: 'center' as const,
    color: '#666',
    borderTop: '1px solid #ddd',
    paddingTop: 10,
  },
  infoBlock: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
});

interface PdfBoletaProps {
  data: BoletaData;
}

const PdfBoleta: React.FC<PdfBoletaProps> = ({ data }) => {
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString('es-CL')}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text>R.U.T.: {data.rut}</Text>
            <Text style={styles.title}>BOLETA ELECTRÓNICA</Text>
            <Text>Nº {data.numeroBoleta}</Text>
            <Text style={{ fontSize: 8, color: '#666' }}>
              S.I.I. VALPARAÍSO
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={{ fontSize: 10 }}>TOTAL A PAGAR</Text>
            <Text style={styles.total}>{formatCurrency(data.total)}</Text>
            <Text style={{ fontSize: 8, color: '#666' }}>
              Vence: {data.fechaVencimiento}
            </Text>
          </View>
        </View>

        <View style={styles.infoBlock}>
          <Text>Ruta: {data.rutaLectura}</Text>
          <Text>N° Medidor: {data.numeroMedidor}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text>{data.direccion}</Text>
          <Text>{data.departamento}</Text>
          <Text>{data.comuna}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Fecha Emisión: {data.fechaEmision}</Text>
            <Text style={styles.tableCell}>Actual: {data.lecturaActual}</Text>
            <Text style={styles.tableCell}>Anterior: {data.lecturaAnterior}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Consumo Cliente: {data.consumoCliente}m3</Text>
            <Text style={styles.tableCell}>A Facturar: {data.consumoFacturar}m3</Text>
            <Text style={styles.tableCell}>Días: {data.diasPeriodo}</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>DETALLE DE FACTURACIÓN</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Concepto</Text>
            <Text style={styles.tableCell}>Unidades</Text>
            <Text style={styles.tableCellRight}>Valor Unit.</Text>
            <Text style={styles.tableCellRight}>Total</Text>
          </View>
          
          {data.detalleFacturacion.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.concepto}</Text>
              <Text style={styles.tableCell}>{item.unidades}</Text>
              <Text style={styles.tableCellRight}>
                {item.valorUnitario > 0 ? `$${item.valorUnitario.toFixed(2)}` : '-'}
              </Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(item.totalParcial)}
              </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Total</Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={[styles.tableCellRight, { fontWeight: 'bold' }]}>
              {formatCurrency(data.subtotal)}
            </Text>
          </View>
        </View>

        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>
            GRÁFICO DE CONSUMO (m3) últimos 13 meses
          </Text>
          <View style={styles.graphBars}>
            {data.consumosUltimos13Meses.map((value, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.bar(value)} />
                <Text style={styles.barLabel}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Timbre Electrónico SII - Res. 29 del 2014</Text>
          <Text>Verifique información en http://oficinavirtual.esval.cl</Text>
          <Text style={{ marginTop: 5 }}>
            Ruta: {data.rutaLectura} | N° Medidor: {data.numeroMedidor}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfBoleta;