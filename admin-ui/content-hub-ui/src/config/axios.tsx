import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // https://localhost:7202
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ GẮN TOKEN TỰ ĐỘNG
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ❌ (optional) xử lý lỗi 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized – token hết hạn hoặc chưa login')
    }
    return Promise.reject(error)
  }
)

export default axiosClient
