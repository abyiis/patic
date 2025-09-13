<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h2 class="h3 mb-3 fw-bold text-primary">Iniciar Sesión</h2>
                <p class="text-muted">Accede a tu cuenta del LMS</p>
              </div>
              
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Correo electrónico</label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    class="form-control"
                    placeholder="Tu contraseña"
                    required
                  />
                </div>

                <div v-if="$auth.error" class="alert alert-danger">
                  {{ $auth.error }}
                </div>

                <div class="d-grid mb-3">
                  <button
                    type="submit"
                    :disabled="$auth.loading"
                    class="btn btn-primary"
                  >
                    <span v-if="$auth.loading">
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Iniciando sesión...
                    </span>
                    <span v-else>Iniciar Sesión</span>
                  </button>
                </div>

                <div class="text-center">
                  <p class="text-muted mb-0">
                    ¿No tienes cuenta?
                    <RouterLink to="/register" class="text-decoration-none">
                      Regístrate aquí
                    </RouterLink>
                  </p>
                </div>
              </form>

              <!-- Usuarios de prueba -->
              <div class="mt-4 p-3 bg-info bg-opacity-10 rounded">
                <h6 class="text-info mb-2">Usuarios de prueba:</h6>
                <div class="small text-info">
                  <p class="mb-1"><strong>Admin:</strong> admin@lms.com / admin123</p>
                  <p class="mb-1"><strong>Docente:</strong> docente@lms.com / admin123</p>
                  <p class="mb-0"><strong>Estudiante:</strong> estudiante@lms.com / admin123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth'

const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  authStore.clearError()
  
  const result = await authStore.login(form.value)
  
  if (result.success) {
    router.push('/dashboard')
  }
}
</script>
