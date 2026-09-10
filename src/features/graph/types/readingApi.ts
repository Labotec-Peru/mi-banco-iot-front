export interface ReadingValue {
  id: number;
  attributeName: string;
  value: string;
  recordedAt: string;
}

export interface ReadingApiResponse {
  id: number;
  waterMeterId: number;
  title: string;
  obisCode: string;
  readingAt: string;
  sourceIp: string | null;
  values: ReadingValue[];
}

export interface ReadingApiListResponse {
  content: ReadingApiResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ChartDataPoint {
  time: string;        
  fullDate: string;    
  volumen: number;     
  flujo: number;       
}