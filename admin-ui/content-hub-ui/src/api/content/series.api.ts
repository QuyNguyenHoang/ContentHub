import axiosClient from "../../config/axios";

export interface SeriesRequest {
  name: string;
  description?: string;
  sortOrder?: number;
  seoKeywords?: string;
  seoDescription?: string;
  thumbnail?: string;
  content?: string;
  userId?: string;
}

export interface SeriesResponse {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  seoKeywords: string | null;
  seoDescription: string | null;
  thumbnail: string | null;
  content: string | null;
  dateCreated: string;
  userId: string | null;
}

export interface PagedResult<T> {
  results: T[];
  currentPage: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  firstRowOnPage: number;
  lastRowOnPage: number;
  additionalData: any | null;
}

export const seriesApi = {
  getPaging: (params?: {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
    pageCount?: number;
    filter?: string;
  }) =>
    axiosClient.get<PagedResult<SeriesResponse>>("/api/series/paging", {
      params,
    }),
  createSeries: (data: SeriesRequest) =>
    axiosClient.post<SeriesResponse>("/api/series", data),
  updateSeries: (id: string, data: SeriesRequest) =>
    axiosClient.put<SeriesResponse>(`/api/series/${id}`, data),
  deleteSeries: (ids: string[]) =>
    axiosClient.delete("/api/series", {
      data: ids,
    }),
  getSeriesById: (id: string) =>
    axiosClient.get<SeriesResponse>(`/api/series/${id}`),
  uploadMedia: (file: File, type: string) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosClient.post<{ path: string }>(
      `/api/media?type=${type}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
};
