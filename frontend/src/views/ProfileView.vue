<template>
  <Layout>
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p class="text-gray-600">Gestiona tu información personal</p>
      </div>

      <!-- Formulario de perfil -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-lg font-medium text-gray-900">Información Personal</h2>
        </div>
        <div class="card-body">
          <form @submit.prevent="actualizarPerfil" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="nombre" class="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  id="nombre"
                  v-model="form.nombre"
                  type="text"
                  required
                  class="input-field mt-1"
                />
              </div>
              <div>
                <label for="apellido" class="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  id="apellido"
                  v-model="form.apellido"
                  type="text"
                  required
                  class="input-field mt-1"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="input-field mt-1"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Rol
              </label>
              <p class="mt-1 text-sm text-gray-600">{{ getRolText(authStore.user?.rol) }}</p>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary"
              >
                <span v-if="loading">Guardando...</span>
                <span v-else>Guardar Cambios</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Cambiar contraseña -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-lg font-medium text-gray-900">Cambiar Contraseña</h2>
        </div>
        <div class="card-body">
          <form @submit.prevent="cambiarContraseña" class="space-y-4">
            <div>
              <label for="password_actual" class="block text-sm font-medium text-gray-700">
                Contraseña actual
              </label>
              <input
                id="password_actual"
                v-model="passwordForm.password_actual"
                type="password"
                required
                class="input-field mt-1"
              />
            </div>

            <div>
              <label for="password_nueva" class="block text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <input
                id="password_nueva"
                v-model="passwordForm.password_nueva"
                type="password"
                required
                class="input-field mt-1"
              />
            </div>

            <div>
              <label for="password_confirmar" class="block text-sm font-medium text-gray-700">
                Confirmar nueva contraseña
              </label>
              <input
                id="password_confirmar"
                v-model="passwordForm.password_confirmar"
                type="password"
                required
                class="input-field mt-1"
              />
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="passwordLoading"
                class="btn-primary"
              >
                <span v-if="passwordLoading">Cambiando...</span>
                <span v-else>Cambiar Contraseña</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authStore } from '../stores/auth'
import Layout from '../components/Layout.vue'

const loading = ref(false)
const passwordLoading = ref(false)

const form = ref({
  nombre: '',
  apellido: '',
  email: ''
})

const passwordForm = ref({
  password_actual: '',
  password_nueva: '',
  password_confirmar: ''
})

const getRolText = (rol: string | undefined) => {
  switch (rol) {
    case 'ADMIN': return 'Administrador'
    case 'DOCENTE': return 'Docente'
    case 'ESTUDIANTE': return 'Estudiante'
    default: return ''
  }
}

const cargarPerfil = async () => {
  try {
    // Usar datos del store para demo
    form.value = {
      nombre: authStore.user?.nombre || 'Usuario',
      apellido: authStore.user?.apellido || 'Demo',
      email: authStore.user?.email || 'demo@lms.com'
    }
  } catch (error) {
    console.error('Error cargando perfil:', error)
  }
}

const actualizarPerfil = async () => {
  try {
    loading.value = true
    
    // Simular actualización para demo
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Actualizar el store local
    authStore.user = {
      ...authStore.user,
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      email: form.value.email
    }
    
    alert('Perfil actualizado exitosamente (modo demo)')
  } catch (error) {
    console.error('Error actualizando perfil:', error)
    alert('Error al actualizar el perfil')
  } finally {
    loading.value = false
  }
}

const cambiarContraseña = async () => {
  if (passwordForm.value.password_nueva !== passwordForm.value.password_confirmar) {
    alert('Las contraseñas no coinciden')
    return
  }

  try {
    passwordLoading.value = true
    
    // Simular cambio de contraseña para demo
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Limpiar formulario
    passwordForm.value = {
      password_actual: '',
      password_nueva: '',
      password_confirmar: ''
    }
    
    alert('Contraseña cambiada exitosamente (modo demo)')
  } catch (error) {
    console.error('Error cambiando contraseña:', error)
    alert('Error al cambiar la contraseña')
  } finally {
    passwordLoading.value = false
  }
}

onMounted(() => {
  cargarPerfil()
})
</script>
