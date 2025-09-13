<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <h1 class="h2 mb-1">
            Bienvenido, {{ authStore.user?.nombre }} {{ authStore.user?.apellido }}
          </h1>
          <p class="text-muted">
            {{ getRoleText(authStore.user?.rol) }}
          </p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row g-3 mb-4">
        <div class="col-md-6 col-lg-3">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <i class="bi bi-book-fill text-primary fs-2"></i>
                </div>
                <div class="ms-3">
                  <p class="text-muted mb-0 small">Mis Cursos</p>
                  <p class="h4 mb-0">{{ stats.misCursos }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <i class="bi bi-clipboard-check-fill text-success fs-2"></i>
                </div>
                <div class="ms-3">
                  <p class="text-muted mb-0 small">Tareas Pendientes</p>
                  <p class="h4 mb-0">{{ stats.tareasPendientes }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <i class="bi bi-check-circle-fill text-info fs-2"></i>
                </div>
                <div class="ms-3">
                  <p class="text-muted mb-0 small">Tareas Completadas</p>
                  <p class="h4 mb-0">{{ stats.tareasCompletadas }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <i class="bi bi-chat-dots-fill text-warning fs-2"></i>
                </div>
                <div class="ms-3">
                  <p class="text-muted mb-0 small">Mensajes</p>
                  <p class="h4 mb-0">{{ stats.mensajes }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="row g-4">
        <!-- Mis Cursos -->
        <div class="col-lg-6">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="card-title mb-0">Mis Cursos</h5>
            </div>
            <div class="card-body">
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>
              <div v-else-if="cursos.length === 0" class="text-center py-4 text-muted">
                No estás matriculado en ningún curso
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <div
                  v-for="curso in cursos"
                  :key="curso.id"
                  class="d-flex align-items-center justify-content-between p-3 border rounded hover-bg-light"
                >
                  <div>
                    <h6 class="mb-1">{{ curso.curso.titulo }}</h6>
                    <small class="text-muted">{{ curso.curso.codigo }}</small>
                  </div>
                  <RouterLink
                    :to="`/cursos/${curso.curso.id}`"
                    class="btn btn-primary btn-sm"
                  >
                    Ver Curso
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tareas Recientes -->
        <div class="col-lg-6">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="card-title mb-0">Tareas Recientes</h5>
            </div>
            <div class="card-body">
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>
              <div v-else-if="tareas.length === 0" class="text-center py-4 text-muted">
                No hay tareas asignadas
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <div
                  v-for="tarea in tareas"
                  :key="tarea.id"
                  class="d-flex align-items-center justify-content-between p-3 border rounded hover-bg-light"
                >
                  <div>
                    <h6 class="mb-1">{{ tarea.titulo }}</h6>
                    <small class="text-muted">
                      {{ formatDate(tarea.fechaLimite) }}
                    </small>
                  </div>
                  <RouterLink
                    :to="`/tareas/${tarea.id}`"
                    class="btn btn-primary btn-sm"
                  >
                    Ver Tarea
                  </RouterLink>
                </div>
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
import { authStore, api } from '../stores/auth'
import Layout from '../components/Layout.vue'

const loading = ref(true)
const cursos = ref([])
const tareas = ref([])
const stats = ref({
  misCursos: 0,
  tareasPendientes: 0,
  tareasCompletadas: 0,
  mensajes: 0
})

const getRoleText = (rol: string) => {
  switch (rol) {
    case 'ADMIN': return 'Administrador'
    case 'DOCENTE': return 'Docente'
    case 'ESTUDIANTE': return 'Estudiante'
    default: return ''
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadDashboardData = async () => {
  try {
    loading.value = true

    // Datos de ejemplo para demo
    cursos.value = [
      {
        curso: {
          id: 1,
          titulo: 'Introducción a la Programación',
          codigo: 'PROG-101'
        }
      },
      {
        curso: {
          id: 2,
          titulo: 'Base de Datos',
          codigo: 'BD-201'
        }
      }
    ]

    tareas.value = [
      {
        id: 1,
        titulo: 'Ejercicio de Variables',
        fechaLimite: '2024-01-20'
      },
      {
        id: 2,
        titulo: 'Proyecto Final',
        fechaLimite: '2024-02-15'
      }
    ]

    // Calcular estadísticas
    stats.value.misCursos = cursos.value.length
    stats.value.tareasPendientes = 2
    stats.value.tareasCompletadas = 1
    stats.value.mensajes = 3

  } catch (error) {
    console.error('Error cargando datos del dashboard:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.hover-bg-light:hover {
  background-color: var(--bs-light) !important;
}
</style>
