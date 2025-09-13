<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="h2 mb-1">Tareas</h1>
              <p class="text-muted">Gestiona tus tareas asignadas</p>
            </div>
            <RouterLink
              v-if="authStore.isAdmin || authStore.isDocente"
              to="/tareas/crear"
              class="btn btn-primary"
            >
              <i class="bi bi-plus-circle me-2"></i>
              Crear Tarea
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row mb-4">
        <div class="col-md-4">
          <select v-model="filtroCurso" class="form-select" @change="cargarTareas(1)">
            <option value="">Todos los cursos</option>
            <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
              {{ curso.titulo }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <select v-model="filtroEstado" class="form-select" @change="cargarTareas(1)">
            <option value="">Todas las tareas</option>
            <option value="pendiente">Pendientes</option>
            <option value="entregada">Entregadas</option>
            <option value="calificada">Calificadas</option>
          </select>
        </div>
      </div>

      <!-- Lista de tareas -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div v-else-if="tareas.length === 0" class="text-center py-5 text-muted">
        No hay tareas disponibles
      </div>

      <div v-else class="d-flex flex-column gap-3">
        <div
          v-for="tarea in tareas"
          :key="tarea.id"
          class="card shadow-sm hover-shadow"
        >
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div class="flex-grow-1">
                <div class="d-flex align-items-center gap-3 mb-2">
                  <h5 class="card-title mb-0">{{ tarea.titulo }}</h5>
                  <span
                    class="badge"
                    :class="getEstadoClass(tarea.estado)"
                  >
                    {{ getEstadoText(tarea.estado) }}
                  </span>
                </div>
                
                <p class="card-text text-muted mb-3">{{ tarea.descripcion }}</p>
                
                <div class="d-flex flex-wrap gap-4 text-muted small">
                  <span><i class="bi bi-book me-1"></i>Curso: {{ tarea.curso.titulo }}</span>
                  <span><i class="bi bi-calendar me-1"></i>Fecha límite: {{ formatDate(tarea.fechaLimite) }}</span>
                  <span><i class="bi bi-star me-1"></i>Puntaje: {{ tarea.puntaje }} pts</span>
                  <span v-if="tarea._count.entregas > 0">
                    <i class="bi bi-file-earmark me-1"></i>{{ tarea._count.entregas }} entregas
                  </span>
                </div>
              </div>
              
              <div class="d-flex gap-2 ms-3">
                <RouterLink
                  :to="`/tareas/${tarea.id}`"
                  class="btn btn-primary btn-sm"
                >
                  Ver Tarea
                </RouterLink>
                <button
                  v-if="authStore.isEstudiante && !tarea.entrega"
                  @click="entregarTarea(tarea.id)"
                  class="btn btn-outline-primary btn-sm"
                >
                  Entregar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="meta.totalPages > 1" class="d-flex justify-content-center mt-4">
        <nav>
          <ul class="pagination">
            <li
              v-for="page in meta.totalPages"
              :key="page"
              class="page-item"
              :class="{ active: page === meta.page }"
            >
              <button
                @click="cargarTareas(page)"
                class="page-link"
              >
                {{ page }}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore, api } from '../stores/auth'
import Layout from '../components/Layout.vue'

const router = useRouter()
const loading = ref(true)
const tareas = ref([])
const cursos = ref([])
const meta = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0
})
const filtroCurso = ref('')
const filtroEstado = ref('')

const getEstadoClass = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE': return 'bg-warning'
    case 'ENTREGADA': return 'bg-info'
    case 'CALIFICADA': return 'bg-success'
    default: return 'bg-secondary'
  }
}

const getEstadoText = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE': return 'Pendiente'
    case 'ENTREGADA': return 'Entregada'
    case 'CALIFICADA': return 'Calificada'
    default: return 'Desconocido'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const cargarTareas = async (page = 1) => {
  try {
    loading.value = true
    
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Datos de ejemplo para demo
    const tareasDemo = [
      {
        id: 1,
        titulo: 'Ejercicio de Variables',
        descripcion: 'Crear un programa que demuestre el uso de diferentes tipos de variables',
        estado: 'PENDIENTE',
        fechaLimite: '2024-01-20',
        puntaje: 100,
        curso: {
          titulo: 'Introducción a la Programación'
        },
        _count: {
          entregas: 15
        },
        entrega: null
      },
      {
        id: 2,
        titulo: 'Proyecto Final - Base de Datos',
        descripcion: 'Diseñar e implementar una base de datos para un sistema de gestión',
        estado: 'ENTREGADA',
        fechaLimite: '2024-02-15',
        puntaje: 200,
        curso: {
          titulo: 'Base de Datos'
        },
        _count: {
          entregas: 18
        },
        entrega: {
          id: 1,
          calificacion: 85
        }
      },
      {
        id: 3,
        titulo: 'Sitio Web Responsivo',
        descripcion: 'Crear un sitio web que se adapte a diferentes dispositivos',
        estado: 'CALIFICADA',
        fechaLimite: '2024-01-30',
        puntaje: 150,
        curso: {
          titulo: 'Desarrollo Web'
        },
        _count: {
          entregas: 22
        },
        entrega: {
          id: 2,
          calificacion: 92
        }
      },
      {
        id: 4,
        titulo: 'Implementación de Algoritmos',
        descripcion: 'Implementar algoritmos de ordenamiento y búsqueda',
        estado: 'PENDIENTE',
        fechaLimite: '2024-02-28',
        puntaje: 180,
        curso: {
          titulo: 'Algoritmos y Estructuras de Datos'
        },
        _count: {
          entregas: 12
        },
        entrega: null
      }
    ]
    
    // Aplicar filtros
    let tareasFiltradas = tareasDemo
    
    if (filtroCurso.value) {
      tareasFiltradas = tareasFiltradas.filter(tarea => 
        tarea.curso.titulo.toLowerCase().includes(filtroCurso.value.toLowerCase())
      )
    }
    
    if (filtroEstado.value) {
      const estadoMap = {
        'pendiente': 'PENDIENTE',
        'entregada': 'ENTREGADA',
        'calificada': 'CALIFICADA'
      }
      tareasFiltradas = tareasFiltradas.filter(tarea => 
        tarea.estado === estadoMap[filtroEstado.value]
      )
    }
    
    tareas.value = tareasFiltradas
    meta.value = {
      total: tareasFiltradas.length,
      page: 1,
      limit: 10,
      totalPages: 1
    }
  } catch (error) {
    console.error('Error cargando tareas:', error)
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

const entregarTarea = async (tareaId: number) => {
  try {
    // Redirigir a la página de detalle de la tarea para entregar
    router.push(`/tareas/${tareaId}`)
  } catch (error) {
    console.error('Error navegando a entrega de tarea:', error)
  }
}

onMounted(() => {
  Promise.all([
    cargarTareas(),
    cargarCursos()
  ])
})
</script>

<style scoped>
.hover-shadow:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>
