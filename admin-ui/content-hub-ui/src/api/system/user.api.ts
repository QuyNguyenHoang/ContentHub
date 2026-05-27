import './../../config/axios'
import axiosClient from './../../config/axios'

export interface UserDto {
    id: string
    firstName: string
    lastName: string
    fullName: string
    isActive: boolean
    dateCreated: string
    dob?: string | null
    avatar?: string | null
    lastLoginDate?: string | null
    userName: string
    email: string
    emailConfirmed: boolean
    totalPost:number
}
export interface UserRequest {
    firstName: string
    lastName: string
    dob?: string | null
    avatar?: string | null
}
export interface PagedResult<T> {
    results: T[]
    currentPage: number
    pageSize: number
    rowCount: number
}
export const userApi = {
    getPaging: (params?: {
        keyword?: string
        pageNumber?: number
        pageSize?: number
    }) =>
        axiosClient.get<PagedResult<UserDto>>(
            '/api/users/all',
            { params }
        ),
    getById: (id: string) =>
        axiosClient.get<UserDto>(
            `/api/users/${id}`,
        ),
    update: (id: string, data: UserRequest) =>
        axiosClient.put<UserDto>(
            `/api/users/${id}`,
            data
        ),
}