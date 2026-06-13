import axiosClient from "../../config/axios";

export interface LoginRequestDto {
  username: string;
  password: string;
}
export interface RegisterRequestDto{
     firstName: string
  lastName: string
  userName: string
  email: string
  password: string
  confirmPassword: string
  dob: string | null
}
export interface RegisterResponseDto{
    message?:string;
}
export interface LoginResponseDto {
    token:string;
    message?:string;
}
export const authApi = {
    loginApi:(data:LoginRequestDto) => {
        return axiosClient.post<LoginResponseDto>("/api/admin/auth/login", data)
    },
    registerApi:(data:RegisterRequestDto) => {
        return axiosClient.post<RegisterResponseDto>("/api/admin/auth/register", data)
    },
    refreshTokenApi:()=>{
        return axiosClient.post<LoginResponseDto>("/api/admin/auth/refresh_token")
    }
}