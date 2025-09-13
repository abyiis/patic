import { reactive } from 'vue'
import axios from 'axios'

// Configurar axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
  withCredentials: true,
})

// Store reactivo simple
export const authStore = reactive({
  user: {
    id: 1,
    email: 'demo@lms.com',
    nombre: 'Usuario',
    apellido: 'Demo',
    rol: 'ESTUDIANTE'
  },
  token: 'demo-token',
  loading: false,
  error: null,

  // Getters
  get isAuthenticated() {
    return true // Siempre autenticado para demo
  },
  get isAdmin() {
    return this.user?.rol === 'ADMIN'
  },
  get isDocente() {
    return this.user?.rol === 'DOCENTE'
  },
  get isEstudiante() {
    return this.user?.rol === 'ESTUDIANTE'
  },

  // Actions
  async login(credentials) {
    this.loading = true
    this.error = null

    try {
      const response = await api.post('/auth/login', credentials)
      const { access_token, user } = response.data

      this.token = access_token
      this.user = user
      localStorage.setItem('access_token', access_token)

      return { success: true }
    } catch (err) {
      this.error = err.response?.data?.message || 'Error al iniciar sesión'
      return { success: false, error: this.error }
    } finally {
      this.loading = false
    }
  },

  async register(data) {
    this.loading = true
    this.error = null

    try {
      await api.post('/auth/register', data)
      return { success: true }
    } catch (err) {
      this.error = err.response?.data?.message || 'Error al registrarse'
      return { success: false, error: this.error }
    } finally {
      this.loading = false
    }
  },

  async logout() {
    this.loading = true

    try {
      if (this.token) {
        await api.post('/auth/logout')
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      this.token = null
      this.user = null
      localStorage.removeItem('access_token')
      this.loading = false
    }
  },

  async checkAuth() {
    if (!this.token) return false

    try {
      const response = await api.get('/users/me')
      this.user = response.data
      return true
    } catch (err) {
      await this.logout()
      return false
    }
  },

  clearError() {
    this.error = null
  }
})

// Interceptor para agregar token
api.interceptors.request.use(config => {
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// Interceptor para manejar errores 401
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export { api }