import axiosClient from '../../config/axios'
import { jwtDecode } from 'jwt-decode'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
  confirmPassword: string
  dob: string | null
}

export const registerApi = async (
  payload: RegisterRequest
): Promise<string> => {

  const { data } = await axiosClient.post<string>(
    '/api/admin/auth/register',
    payload
  )

  return data
}

export const loginApi = async (
  payload: LoginRequest
): Promise<{ roles: string | null }> => {

  const { data } = await axiosClient.post<LoginResponse>(
    '/api/admin/auth/login',
    payload
  )

  localStorage.setItem('access_token', data.token)
  localStorage.setItem('refresh_token', data.refreshToken)

  try {
    const decoded: any = jwtDecode(data.token)

    if (typeof decoded.roles === "string") {
      return { roles: decoded.roles }
    }

    if (Array.isArray(decoded.roles) && decoded.roles.length > 0) {
      return { roles: decoded.roles[0] }
    }

    return { roles: null }

  } catch {
    return { roles: null }
  }
}