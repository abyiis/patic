<template>
  <Layout>
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p class="text-gray-600">Estadísticas y gestión del sistema</p>
      </div>

      <!-- Stats Cards -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UsersIcon class="h-8 w-8 text-blue-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Usuarios</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.resumen.totalUsuarios }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <BookOpenIcon class="h-8 w-8 text-green-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Cursos</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.resumen.totalCursos }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ClipboardDocumentListIcon class="h-8 w-8 text-purple-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Tareas</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.resumen.totalTareas }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ChatBubbleLeftRightIcon class="h-8 w-8 text-orange-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Mensajes</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.resumen.totalMensajes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Usuarios por rol -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-lg font-medium text-gray-900">Usuarios por Rol</h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="rol in stats.usuariosPorRol"
              :key="rol.rol"
              class="text-center p-4 bg-gray-50 rounded-lg"
            >
              <p class="text-2xl font-bold text-gray-900">{{ rol.cantidad }}</p>
              <p class="text-sm text-gray-500">{{ getRolText(rol.rol) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Cursos recientes -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-medium text-gray-900">Cursos Recientes</h2>
          </div>
          <div class="card-body">
            <div v-if="stats.cursosRecientes.length === 0" class="text-center py-4 text-gray-500">
              No hay cursos
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="curso in stats.cursosRecientes"
                :key="curso.id"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <h3 class="font-medium text-gray-900">{{ curso.titulo }}</h3>
                  <p class="text-sm text-gray-500">{{ curso.codigo }}</p>
                </div>
                <div class="text-right text-sm text-gray-500">
                  <p>{{ curso._count.matriculas }} estudiantes</p>
                  <p>{{ curso._count.clases }} clases</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Usuarios recientes -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-medium text-gray-900">Usuarios Recientes</h2>
          </div>
          <div class="card-body">
            <div v-if="stats.usuariosRecientes.length === 0" class="text-center py-4 text-gray-500">
              No hay usuarios
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="usuario in stats.usuariosRecientes"
                :key="usuario.id"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <h3 class="font-medium text-gray-900">
                    {{ usuario.nombre }} {{ usuario.apellido }}
                  </h3>
                  <p class="text-sm text-gray-500">{{ usuario.email }}</p>
                </div>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getRolClass(usuario.rol)"
                >
                  {{ getRolText(usuario.rol) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import Layout from '@/components/Layout.vue'
import {
  UsersIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const loading = ref(true)
const stats = ref({
  resumen: {
    totalUsuarios: 0,
    totalCursos: 0,
    totalTareas: 0,
    totalMensajes: 0
  },
  usuariosPorRol: [],
  cursosRecientes: [],
  usuariosRecientes: []
})

const getRolText = (rol: string) => {
  switch (rol) {
    case 'ADMIN': return 'Administrador'
    case 'DOCENTE': return 'Docente'
    case 'ESTUDIANTE': return 'Estudiante'
    default: return rol
  }
}

const getRolClass = (rol: string) => {
  switch (rol) {
    case 'ADMIN': return 'bg-red-100 text-red-800'
    case 'DOCENTE': return 'bg-blue-100 text-blue-800'
    case 'ESTUDIANTE': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const cargarStats = async () => {
  try {
    const response = await api.get('/admin/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarStats()
})
</script>
