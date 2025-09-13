<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <h1 class="h2 mb-1">Mis Calificaciones</h1>
          <p class="text-muted">Revisa tus calificaciones y progreso académico</p>
        </div>
      </div>

      <!-- Resumen de calificaciones -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-star-fill text-warning fs-1 mb-2"></i>
              <h4 class="mb-1">{{ promedioGeneral }}</h4>
              <p class="text-muted mb-0">Promedio General</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-check-circle-fill text-success fs-1 mb-2"></i>
              <h4 class="mb-1">{{ tareasCompletadas }}</h4>
              <p class="text-muted mb-0">Tareas Completadas</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-clock-fill text-info fs-1 mb-2"></i>
              <h4 class="mb-1">{{ tareasPendientes }}</h4>
              <p class="text-muted mb-0">Tareas Pendientes</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-trophy-fill text-primary fs-1 mb-2"></i>
              <h4 class="mb-1">{{ mejorCalificacion }}</h4>
              <p class="text-muted mb-0">Mejor Calificación</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row mb-4">
        <div class="col-md-4">
          <select v-model="filtroCurso" class="form-select" @change="cargarCalificaciones">
            <option value="">Todos los cursos</option>
            <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
              {{ curso.titulo }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <select v-model="filtroPeriodo" class="form-select" @change="cargarCalificaciones">
            <option value="">Todos los períodos</option>
            <option value="2024-1">2024-1</option>
            <option value="2024-2">2024-2</option>
            <option value="2023-2">2023-2</option>
          </select>
        </div>
      </div>

      <!-- Lista de calificaciones -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div v-else-if="calificaciones.length === 0" class="text-center py-5 text-muted">
        No hay calificaciones disponibles
      </div>

      <div v-else class="row g-4">
        <div
          v-for="calificacion in calificaciones"
          :key="calificacion.id"
          class="col-md-6 col-lg-4"
        >
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="card-title mb-1">{{ calificacion.tarea.titulo }}</h5>
                  <small class="text-muted">{{ calificacion.curso.titulo }}</small>
                </div>
                <span
                  class="badge fs-6"
                  :class="getCalificacionClass(calificacion.puntaje)"
                >
                  {{ calificacion.puntaje }}/{{ calificacion.tarea.puntajeMaximo }}
                </span>
              </div>

              <div class="mb-3">
                <div class="d-flex justify-content-between text-muted small mb-1">
                  <span>Progreso</span>
                  <span>{{ Math.round((calificacion.puntaje / calificacion.tarea.puntajeMaximo) * 100) }}%</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div
                    class="progress-bar"
                    :class="getCalificacionClass(calificacion.puntaje).replace('bg-', 'bg-')"
                    :style="{ width: `${(calificacion.puntaje / calificacion.tarea.puntajeMaximo) * 100}%` }"
                  ></div>
                </div>
              </div>

              <div class="d-flex justify-content-between text-muted small mb-3">
                <span><i class="bi bi-calendar me-1"></i>{{ formatDate(calificacion.fechaEntrega) }}</span>
                <span><i class="bi bi-person me-1"></i>{{ calificacion.profesor.nombre }}</span>
              </div>

              <div v-if="calificacion.comentarios" class="mb-3">
                <small class="text-muted">
                  <strong>Comentarios:</strong><br>
                  {{ calificacion.comentarios }}
                </small>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  {{ getCalificacionTexto(calificacion.puntaje) }}
                </small>
                <RouterLink
                  :to="`/tareas/${calificacion.tarea.id}`"
                  class="btn btn-outline-primary btn-sm"
                >
                  Ver Detalles
                </RouterLink>
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
import { authStore } from '../stores/auth'
import Layout from '../components/Layout.vue'

const loading = ref(true)
const calificaciones = ref([])
const cursos = ref([])
const filtroCurso = ref('')
const filtroPeriodo = ref('')

const promedioGeneral = computed(() => {
  if (calificaciones.value.length === 0) return '0.0'
  const suma = calificaciones.value.reduce((acc, cal) => acc + cal.puntaje, 0)
  const total = calificaciones.value.reduce((acc, cal) => acc + cal.tarea.puntajeMaximo, 0)
  return (suma / total * 100).toFixed(1)
})

const tareasCompletadas = computed(() => {
  return calificaciones.value.length
})

const tareasPendientes = computed(() => {
  return 2 // Simulado
})

const mejorCalificacion = computed(() => {
  if (calificaciones.value.length === 0) return '0'
  const max = Math.max(...calificaciones.value.map(cal => cal.puntaje))
  return max.toString()
})

const getCalificacionClass = (puntaje) => {
  if (puntaje >= 90) return 'bg-success'
  if (puntaje >= 80) return 'bg-info'
  if (puntaje >= 70) return 'bg-warning'
  return 'bg-danger'
}

const getCalificacionTexto = (puntaje) => {
  if (puntaje >= 90) return 'Excelente'
  if (puntaje >= 80) return 'Bueno'
  if (puntaje >= 70) return 'Satisfactorio'
  return 'Necesita mejorar'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const cargarCalificaciones = async () => {
  try {
    loading.value = true
    
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Datos de ejemplo para demo
    const calificacionesDemo = [
      {
        id: 1,
        puntaje: 92,
        fechaEntrega: '2024-01-15',
        comentarios: 'Excelente trabajo. Muy bien estructurado y completo.',
        tarea: {
          id: 1,
          titulo: 'Sitio Web Responsivo',
          puntajeMaximo: 100
        },
        curso: {
          id: 3,
          titulo: 'Desarrollo Web'
        },
        profesor: {
          nombre: 'Carlos López'
        }
      },
      {
        id: 2,
        puntaje: 85,
        fechaEntrega: '2024-01-20',
        comentarios: 'Buen trabajo, pero podrías mejorar la documentación.',
        tarea: {
          id: 2,
          titulo: 'Proyecto Final - Base de Datos',
          puntajeMaximo: 200
        },
        curso: {
          id: 2,
          titulo: 'Base de Datos'
        },
        profesor: {
          nombre: 'María García'
        }
      },
      {
        id: 3,
        puntaje: 78,
        fechaEntrega: '2024-01-10',
        comentarios: 'Cumple con los requisitos básicos.',
        tarea: {
          id: 3,
          titulo: 'Ejercicio de Variables',
          puntajeMaximo: 100
        },
        curso: {
          id: 1,
          titulo: 'Introducción a la Programación'
        },
        profesor: {
          nombre: 'Juan Pérez'
        }
      },
      {
        id: 4,
        puntaje: 95,
        fechaEntrega: '2024-01-25',
        comentarios: 'Implementación muy eficiente. ¡Felicitaciones!',
        tarea: {
          id: 4,
          titulo: 'Implementación de Algoritmos',
          puntajeMaximo: 180
        },
        curso: {
          id: 4,
          titulo: 'Algoritmos y Estructuras de Datos'
        },
        profesor: {
          nombre: 'Ana Martínez'
        }
      }
    ]
    
    // Aplicar filtros
    let calificacionesFiltradas = calificacionesDemo
    
    if (filtroCurso.value) {
      calificacionesFiltradas = calificacionesFiltradas.filter(cal => 
        cal.curso.id === parseInt(filtroCurso.value)
      )
    }
    
    calificaciones.value = calificacionesFiltradas
  } catch (error) {
    console.error('Error cargando calificaciones:', error)
  } finally {
    loading.value = false
  }
}

const cargarCursos = async () => {
  try {
    // Datos de ejemplo para cursos
    cursos.value = [
      { id: 1, titulo: 'Introducción a la Programación' },
      { id: 2, titulo: 'Base de Datos' },
      { id: 3, titulo: 'Desarrollo Web' },
      { id: 4, titulo: 'Algoritmos y Estructuras de Datos' }
    ]
  } catch (error) {
    console.error('Error cargando cursos:', error)
  }
}

onMounted(() => {
  Promise.all([
    cargarCalificaciones(),
    cargarCursos()
  ])
})
</script>

<style scoped>
.progress {
  background-color: #e9ecef;
}
</style>

