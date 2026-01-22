import axiosClient from '../config/axios'

export interface PingResponse {
  success: boolean
  message: string
  time: string
}

export const pingApi = async (): Promise<PingResponse> => {
  const { data } = await axiosClient.get<PingResponse>('/api/test/ping')
  return data
}
