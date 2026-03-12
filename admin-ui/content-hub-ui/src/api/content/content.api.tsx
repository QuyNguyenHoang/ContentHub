import axiosClient from '../../config/axios'

export interface TagRequest {
  name: string
  slug?: string
}

export interface TagResponse {
  id: string
  name: string
  slug: string
}

export interface PagedResult<T> {
  results: T[]
  currentPage: number
  pageSize: number
  rowCount: number
  pageCount:number
}

export const tagApi = {

  // GET PAGING
  getPaging: (params?: {
    keyword?: string
    pageNumber?: number
    pageSize?: number
    pageCount?:number
  }) =>
    axiosClient.get<PagedResult<TagResponse>>(
      '/api/tags/all',
      { params }
    ),

  // GET DROPDOWN
  getDropdown: () =>
    axiosClient.get<TagResponse[]>('/api/tags/dropdown'),

  // CREATE
  create: (data: TagRequest) =>
    axiosClient.post<TagResponse>(
      '/api/tags/create',
      data
    ),

  // UPDATE
  update: (id: string, data: TagRequest) =>
    axiosClient.put<TagResponse>(
      `/api/tags/update/${id}`,
      data
    ),

  // DELETE MULTIPLE
delete: (ids: string[]) =>
  axiosClient.delete('/api/tags', {
    params: { ids },
    paramsSerializer: {
      indexes: null
    }
  }),

  // GET BY SLUG
  getBySlug: (slug: string) =>
    axiosClient.get<TagResponse>(
      `/api/tags/slug/${slug}`
    ),
  //GET BY ID
  getById:(id:string)=>
    axiosClient.get<TagResponse>(`/api/tags/${id}`)

}