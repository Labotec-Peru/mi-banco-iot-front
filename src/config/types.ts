export interface PaginacionResponse {
  status: boolean;
  total_records: number;
  total_pages: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}