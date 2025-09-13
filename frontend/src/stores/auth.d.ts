declare module '../stores/auth' {
  export interface User {
    id: number
    nombre: string
    apellido: string
    email: string
    rol: 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE'
  }

  export interface LoginForm {
    email: string
    password: string
  }

  export interface AuthStore {
    user: User | null
    loading: boolean
    error: string | null
    isAdmin: boolean
    isDocente: boolean
    isEstudiante: boolean
    login: (form: LoginForm) => Promise<{ success: boolean }>
    logout: () => Promise<void>
    clearError: () => void
  }

  export const authStore: AuthStore
}
