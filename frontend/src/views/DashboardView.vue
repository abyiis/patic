<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col">
          <div class="glass-effect p-4 animate-fade-in">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h1 class="h2 mb-2 text-gradient">
                  ¡Bienvenido, {{ authStore.user?.nombre }}! 👋
                </h1>
                <p class="text-muted mb-0 fs-5">
                  <i class="bi bi-person-badge me-2"></i>
                  {{ getRoleText(authStore.user?.rol) }}
                </p>
              </div>
              <div class="d-none d-md-block">
                <div class="text-center">
                  <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-2" 
                       style="width: 80px; height: 80px; font-size: 2rem;">
                    {{ userInitials }}
                  </div>
                  <small class="text-muted">Estado: Activo</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4 mb-5">
        <div class="col-md-6 col-lg-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.1s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="text-muted mb-1 fw-semibold">Mis Cursos</p>
                  <p class="h3 mb-0 text-primary fw-bold">{{ stats.misCursos }}</p>
                  <small class="text-success">
                    <i class="bi bi-arrow-up me-1"></i>+2 este mes
                  </small>
                </div>
                <div class="flex-shrink-0">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-3">
                    <i class="bi bi-book-fill text-primary fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.2s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="text-muted mb-1 fw-semibold">Tareas Pendientes</p>
                  <p class="h3 mb-0 text-warning fw-bold">{{ stats.tareasPendientes }}</p>
                  <small class="text-warning">
                    <i class="bi bi-clock me-1"></i>Requieren atención
                  </small>
                </div>
                <div class="flex-shrink-0">
                  <div class="rounded-circle bg-warning bg-opacity-10 p-3">
                    <i class="bi bi-clipboard-check-fill text-warning fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.3s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="text-muted mb-1 fw-semibold">Tareas Completadas</p>
                  <p class="h3 mb-0 text-success fw-bold">{{ stats.tareasCompletadas }}</p>
                  <small class="text-success">
                    <i class="bi bi-check-circle me-1"></i>¡Excelente trabajo!
                  </small>
                </div>
                <div class="flex-shrink-0">
                  <div class="rounded-circle bg-success bg-opacity-10 p-3">
                    <i class="bi bi-check-circle-fill text-success fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.4s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="text-muted mb-1 fw-semibold">Mensajes</p>
                  <p class="h3 mb-0 text-info fw-bold">{{ stats.mensajes }}</p>
                  <small class="text-info">
                    <i class="bi bi-chat-dots me-1"></i>Nuevos mensajes
                  </small>
                </div>
                <div class="flex-shrink-0">
                  <div class="rounded-circle bg-info bg-opacity-10 p-3">
                    <i class="bi bi-chat-dots-fill text-info fs-2"></i>
                  </div>
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
          <div class="card-hover h-100 animate-slide-in" style="animation-delay: 0.5s;">
            <div class="card-header border-0 bg-transparent p-4">
              <div class="d-flex align-items-center justify-content-between">
                <h5 class="card-title mb-0 text-gradient">
                  <i class="bi bi-book-fill me-2"></i>Mis Cursos
                </h5>
                <RouterLink to="/cursos" class="btn btn-outline-primary btn-sm">
                  Ver todos
                </RouterLink>
              </div>
            </div>
            <div class="card-body p-4">
              <div v-if="loading" class="text-center py-5">
                <div class="loading-spinner mx-auto"></div>
                <p class="text-muted mt-3">Cargando cursos...</p>
              </div>
              <div v-else-if="cursos.length === 0" class="text-center py-5">
                <div class="mb-3">
                  <i class="bi bi-book text-muted" style="font-size: 3rem;"></i>
                </div>
                <h6 class="text-muted">No estás matriculado en ningún curso</h6>
                <p class="text-muted small">Explora los cursos disponibles y comienza tu aprendizaje</p>
                <RouterLink to="/cursos" class="btn btn-gradient">
                  Explorar Cursos
                </RouterLink>
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <div
                  v-for="(curso, index) in cursos"
                  :key="curso.id"
                  class="d-flex align-items-center justify-content-between p-3 glass-effect rounded-3 hover-lift"
                  :style="{ animationDelay: `${0.6 + index * 0.1}s` }"
                >
                  <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                      <i class="bi bi-book text-primary"></i>
                    </div>
                    <div>
                      <h6 class="mb-1 fw-semibold">{{ curso.curso.titulo }}</h6>
                      <small class="text-muted">{{ curso.curso.codigo }}</small>
                    </div>
                  </div>
                  <RouterLink
                    :to="`/cursos/${curso.curso.id}`"
                    class="btn btn-gradient btn-sm"
                  >
                    <i class="bi bi-arrow-right me-1"></i>Ver
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tareas Recientes -->
        <div class="col-lg-6">
          <div class="card-hover h-100 animate-slide-in" style="animation-delay: 0.7s;">
            <div class="card-header border-0 bg-transparent p-4">
              <div class="d-flex align-items-center justify-content-between">
                <h5 class="card-title mb-0 text-gradient">
                  <i class="bi bi-clipboard-check-fill me-2"></i>Tareas Recientes
                </h5>
                <RouterLink to="/tareas" class="btn btn-outline-primary btn-sm">
                  Ver todas
                </RouterLink>
              </div>
            </div>
            <div class="card-body p-4">
              <div v-if="loading" class="text-center py-5">
                <div class="loading-spinner mx-auto"></div>
                <p class="text-muted mt-3">Cargando tareas...</p>
              </div>
              <div v-else-if="tareas.length === 0" class="text-center py-5">
                <div class="mb-3">
                  <i class="bi bi-clipboard-check text-muted" style="font-size: 3rem;"></i>
                </div>
                <h6 class="text-muted">No hay tareas asignadas</h6>
                <p class="text-muted small">Las tareas aparecerán aquí cuando estén disponibles</p>
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <div
                  v-for="(tarea, index) in tareas"
                  :key="tarea.id"
                  class="d-flex align-items-center justify-content-between p-3 glass-effect rounded-3 hover-lift"
                  :style="{ animationDelay: `${0.8 + index * 0.1}s` }"
                >
                  <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-warning bg-opacity-10 p-2 me-3">
                      <i class="bi bi-clipboard-check text-warning"></i>
                    </div>
                    <div>
                      <h6 class="mb-1 fw-semibold">{{ tarea.titulo }}</h6>
                      <small class="text-muted">
                        <i class="bi bi-calendar me-1"></i>
                        {{ formatDate(tarea.fechaLimite) }}
                      </small>
                    </div>
                  </div>
                  <RouterLink
                    :to="`/tareas/${tarea.id}`"
                    class="btn btn-gradient btn-sm"
                  >
                    <i class="bi bi-arrow-right me-1"></i>Ver
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="row g-4 mt-4">
        <div class="col-12">
          <div class="card-hover animate-fade-in" style="animation-delay: 0.9s;">
            <div class="card-body p-4">
              <h5 class="card-title text-gradient mb-4">
                <i class="bi bi-lightning-fill me-2"></i>Acciones Rápidas
              </h5>
              <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                  <RouterLink to="/cursos" class="btn btn-outline-primary w-100 p-3 hover-lift">
                    <i class="bi bi-book-fill d-block mb-2 fs-4"></i>
                    Explorar Cursos
                  </RouterLink>
                </div>
                <div class="col-md-3 col-sm-6">
                  <RouterLink to="/tareas" class="btn btn-outline-success w-100 p-3 hover-lift">
                    <i class="bi bi-clipboard-check-fill d-block mb-2 fs-4"></i>
                    Ver Tareas
                  </RouterLink>
                </div>
                <div class="col-md-3 col-sm-6">
                  <RouterLink to="/calificaciones" class="btn btn-outline-warning w-100 p-3 hover-lift">
                    <i class="bi bi-star-fill d-block mb-2 fs-4"></i>
                    Calificaciones
                  </RouterLink>
                </div>
                <div class="col-md-3 col-sm-6">
                  <RouterLink to="/profile" class="btn btn-outline-info w-100 p-3 hover-lift">
                    <i class="bi bi-person-fill d-block mb-2 fs-4"></i>
                    Mi Perfil
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
import { ref, onMounted, computed } from 'vue'
import { authStore } from '../stores/auth.js'
import Layout from '../components/Layout.vue'

interface Curso {
  id: number
  curso: {
    id: number
    titulo: string
    codigo: string
  }
}

interface Tarea {
  id: number
  titulo: string
  fechaLimite: string
}

const loading = ref(true)
const cursos = ref<Curso[]>([])
const tareas = ref<Tarea[]>([])
const stats = ref({
  misCursos: 0,
  tareasPendientes: 0,
  tareasCompletadas: 0,
  mensajes: 0
})

const userInitials = computed(() => {
  if (!authStore.user) return ''
  return `${authStore.user.nombre[0]}${authStore.user.apellido[0]}`.toUpperCase()
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
        id: 1,
        curso: {
          id: 1,
          titulo: 'Introducción a la Programación',
          codigo: 'PROG-101'
        }
      },
      {
        id: 2,
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
