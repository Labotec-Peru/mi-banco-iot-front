export interface PaginacionResponse {
  status: boolean;
  total_records: number;
  total_pages: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface BoletaData {
  rut: string;
  numeroBoleta: string;
  total: number;
  fechaEmision: string;
  fechaVencimiento: string;
  rutaLectura: string;
  direccion: string;
  departamento: string;
  comuna: string;
  lecturaActual: number;
  lecturaAnterior: number;
  consumoCliente: number;
  consumoFacturar: number;
  cargoFijo: number;
  consumoAgua: number;
  recoleccion: number;
  tratamiento: number;
  subtotal: number;
  sencilloActual: number;
  detalleFacturacion: DetalleFacturacion[];
  pagadoAl: number;
  fechaPago: string;
  claveLectura: string;
  numeroMedidor: string;
  diametro: string;
  factorCobro: number;
  diasPeriodo: number;
  diferenciaMatriz: string;
  prorrateoCliente: string;
  tipoProrrateo: string;
  grupoTarifario: string;
  tarifasPublicadas: string;
  consumosUltimos13Meses: number[];
  mesesLabels: string[];
}

export interface DetalleFacturacion {
  concepto: string;
  unidades: string;
  valorUnitario: number;
  totalParcial: number;
}

export const boletaDataExample: BoletaData = {
  rut: '76.000.739-0',
  numeroBoleta: '29913126',
  total: 20050,
  fechaEmision: '24-08-2018',
  fechaVencimiento: '10/09/2018',
  rutaLectura: '17-383-5280-7',
  direccion: 'COCHRANE 751',
  departamento: 'VALDIVIA NRO. 2990 DPTO. 1134',
  comuna: 'QUINTERO',
  lecturaActual: 140,
  lecturaAnterior: 127,
  consumoCliente: 13.00,
  consumoFacturar: 13.20,
  cargoFijo: 8400,
  consumoAgua: 3150,
  recoleccion: 7349,
  tratamiento: 0,
  subtotal: 20058,
  sencilloActual: 13.20,
  detalleFacturacion: [
    { concepto: 'Cargo Fijo', unidades: '-', valorUnitario: 636.40, totalParcial: 8400 },
    { concepto: 'Consumo Agua', unidades: '13,20 m3', valorUnitario: 238.64, totalParcial: 3150 },
    { concepto: 'Recolección', unidades: '13,20 m3', valorUnitario: 556.71, totalParcial: 7349 },
  ],
  pagadoAl: 17380,
  fechaPago: '10/08/2018',
  claveLectura: 'LECTURA NORMAL',
  numeroMedidor: '7391616',
  diametro: '013 mm',
  factorCobro: 1.00,
  diasPeriodo: 32,
  diferenciaMatriz: '31,41m3',
  prorrateoCliente: '0,63% + 0,20m3',
  tipoProrrateo: '% PARTIC REGL COPROPIEDAD',
  grupoTarifario: 'Tarifas Publicadas',
  tarifasPublicadas: '11/05/2018 EL MOSTRADOR.CL',
  consumosUltimos13Meses: [6, 8, 10, 9, 12, 11, 13, 14, 10, 12, 13, 11, 13],
  mesesLabels: ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
};