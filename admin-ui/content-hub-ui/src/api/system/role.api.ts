import axiosClient from '../../config/axios'

export interface RoleRequest {
  name: string
  displayName: string
}

export interface RoleResponse {
  id: string
  name: string
  displayName: string
}

export interface PagedResult<T> {
  results: T[]
  currentPage: number
  pageSize: number
  rowCount: number
}
export interface RoleClaimDto {
  type: string
  value: string
  displayName: string
  selected: boolean
}

export interface PermissionDto {
  roleId: string
  roleClaims: RoleClaimDto[]
}
export const roleApi = {
  getPaging: (params?: {
    keyword?: string
    pageIndex?: number
    pageSize?: number
  }) =>
    axiosClient.get<PagedResult<RoleResponse>>(
      '/api/roles/paging',
      { params }
    ),

  getById: (id: string) =>
    axiosClient.get<RoleResponse>(`/api/roles/${id}`),

  create: (data: RoleRequest) =>
    axiosClient.post('/api/roles', data),

  update: (id: string, data: RoleRequest) =>
    axiosClient.put(`/api/roles/${id}`, data),

  delete: (id: string) =>
    axiosClient.delete(`/api/roles/${id}`),
  getPermissions: (roleId: string) =>
    axiosClient.get<PermissionDto>(`/api/roles/${roleId}/permissions`),

  savePermissions: (data: PermissionDto) =>
    axiosClient.put('/api/roles/permissions', data),
}

