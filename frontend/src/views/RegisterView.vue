<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h2 class="h3 mb-3 fw-bold text-primary">Crear Cuenta</h2>
                <p class="text-muted">Regístrate en el LMS</p>
              </div>
              
              <form @submit.prevent="handleRegister">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="nombre" class="form-label">Nombre</label>
                    <input
                      id="nombre"
                      v-model="form.nombre"
                      type="text"
                      class="form-control"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="apellido" class="form-label">Apellido</label>
                    <input
                      id="apellido"
                      v-model="form.apellido"
                      type="text"
                      class="form-control"
                      placeholder="Tu apellido"
                      required
                    />
                  </div>
                </div>
                
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
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
                
                <div class="mb-3">
                  <label for="rol" class="form-label">Rol</label>
                  <select
                    id="rol"
                    v-model="form.rol"
                    class="form-select"
                  >
                    <option value="ESTUDIANTE">Estudiante</option>
                    <option value="DOCENTE">Docente</option>
                  </select>
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
                      Creando cuenta...
                    </span>
                    <span v-else>Crear Cuenta</span>
                  </button>
                </div>

                <div class="text-center">
                  <p class="text-muted mb-0">
                    ¿Ya tienes cuenta?
                    <RouterLink to="/login" class="text-decoration-none">
                      Inicia sesión aquí
                    </RouterLink>
                  </p>
                </div>
              </form>
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
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  rol: 'ESTUDIANTE'
})

const handleRegister = async () => {
  authStore.clearError()
  
  const result = await authStore.register(form.value)
  
  if (result.success) {
    router.push('/login')
  }
}
</script>
