import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// =========================
// REQUEST INTERCEPTOR
// =========================
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')

    if (token && config.headers) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }

    return config
  },
  (error) => Promise.reject(error)
)

// =========================
// RESPONSE INTERCEPTOR
// =========================
let isRedirecting = false

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true

      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default axiosClient
