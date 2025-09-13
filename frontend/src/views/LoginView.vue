<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6 col-xl-5">
          <!-- Logo y título principal -->
          <div class="text-center mb-5 animate-bounce-in">
            <div class="mb-4">
              <div class="rounded-circle bg-white bg-opacity-20 d-inline-flex align-items-center justify-content-center mb-3" 
                   style="width: 80px; height: 80px;">
                <i class="bi bi-mortarboard-fill text-white" style="font-size: 2.5rem;"></i>
              </div>
              <h1 class="h2 text-white fw-bold mb-2">LMS Educativo</h1>
              <p class="text-white-50 fs-5">Sistema de Gestión de Aprendizaje</p>
            </div>
          </div>

          <!-- Formulario de login -->
          <div class="glass-effect p-5 animate-fade-in" style="animation-delay: 0.2s;">
            <div class="text-center mb-4">
              <h2 class="h3 mb-3 fw-bold text-gradient">Iniciar Sesión</h2>
              <p class="text-muted">Accede a tu cuenta del LMS</p>
            </div>
            
            <form @submit.prevent="handleLogin">
              <div class="mb-4">
                <label for="email" class="form-label fw-semibold">
                  <i class="bi bi-envelope-fill me-2 text-primary"></i>Correo electrónico
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-control form-control-lg border-0 bg-light"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              
              <div class="mb-4">
                <label for="password" class="form-label fw-semibold">
                  <i class="bi bi-lock-fill me-2 text-primary"></i>Contraseña
                </label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  class="form-control form-control-lg border-0 bg-light"
                  placeholder="Tu contraseña"
                  required
                />
              </div>

              <div v-if="authStore.error" class="alert alert-danger border-0 animate-bounce-in">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ authStore.error }}
              </div>

              <div class="d-grid mb-4">
                <button
                  type="submit"
                  :disabled="authStore.loading"
                  class="btn btn-gradient btn-lg hover-lift"
                >
                  <span v-if="authStore.loading">
                    <div class="loading-spinner me-2" style="width: 20px; height: 20px;"></div>
                    Iniciando sesión...
                  </span>
                  <span v-else>
                    <i class="bi bi-box-arrow-in-right me-2"></i>
                    Iniciar Sesión
                  </span>
                </button>
              </div>

              <div class="text-center">
                <p class="text-muted mb-0">
                  ¿No tienes cuenta?
                  <RouterLink to="/register" class="text-decoration-none fw-semibold text-gradient">
                    Regístrate aquí
                  </RouterLink>
                </p>
              </div>
            </form>
          </div>

          <!-- Usuarios de prueba -->
          <div class="glass-effect p-4 mt-4 animate-slide-in" style="animation-delay: 0.4s;">
            <h6 class="text-gradient mb-3 fw-bold">
              <i class="bi bi-info-circle-fill me-2"></i>Usuarios de prueba
            </h6>
            <div class="row g-3">
              <div class="col-md-4">
                <div class="p-3 bg-primary bg-opacity-10 rounded-3 hover-lift">
                  <div class="d-flex align-items-center mb-2">
                    <i class="bi bi-shield-check text-primary me-2"></i>
                    <small class="fw-semibold text-primary">Admin</small>
                  </div>
                  <small class="text-muted d-block">admin@lms.com</small>
                  <small class="text-muted">admin123</small>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 bg-success bg-opacity-10 rounded-3 hover-lift">
                  <div class="d-flex align-items-center mb-2">
                    <i class="bi bi-person-badge text-success me-2"></i>
                    <small class="fw-semibold text-success">Docente</small>
                  </div>
                  <small class="text-muted d-block">docente@lms.com</small>
                  <small class="text-muted">admin123</small>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 bg-info bg-opacity-10 rounded-3 hover-lift">
                  <div class="d-flex align-items-center mb-2">
                    <i class="bi bi-person text-info me-2"></i>
                    <small class="fw-semibold text-info">Estudiante</small>
                  </div>
                  <small class="text-muted d-block">estudiante@lms.com</small>
                  <small class="text-muted">admin123</small>
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
