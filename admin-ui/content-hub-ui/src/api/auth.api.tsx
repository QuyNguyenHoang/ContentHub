import axiosClient from '../config/axios'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
}

export const loginApi = async (
  payload: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await axiosClient.post<LoginResponse>(
    '/api/admin/auth/login',
    payload
  )

  // ✅ lưu token tạm thời (sau này chuyển sang interceptor)
  localStorage.setItem('access_token', data.token)
  localStorage.setItem('refresh_token', data.refreshToken)

  return data
}
