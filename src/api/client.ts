import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Preserve the original error object so we can check status codes
    if (error.response) {
      const message = error.response?.data?.message || error.message || 'An error occurred'
      const err: any = new Error(message)
      err.response = error.response
      err.status = error.response.status
      return Promise.reject(err)
    }
    return Promise.reject(error)
  }
)

export default apiClient
