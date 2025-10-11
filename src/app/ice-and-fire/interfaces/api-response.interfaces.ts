export interface ApiResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
