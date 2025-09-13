<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="h2 mb-1">Cursos</h1>
              <p class="text-muted">Explora todos los cursos disponibles</p>
            </div>
            <RouterLink
              v-if="authStore.isAdmin || authStore.isDocente"
              to="/cursos/crear"
              class="btn btn-primary"
            >
              <i class="bi bi-plus-circle me-2"></i>
              Crear Curso
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row mb-4">
        <div class="col-md-4">
          <select v-model="filtroActivo" class="form-select" @change="cargarCursos(1)">
            <option value="">Todos los cursos</option>
            <option value="true">Cursos activos</option>
            <option value="false">Cursos inactivos</option>
          </select>
        </div>
      </div>

      <!-- Lista de cursos -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div v-else-if="cursos.length === 0" class="text-center py-5 text-muted">
        No hay cursos disponibles
      </div>

      <div v-else class="row g-4">
        <div
          v-for="curso in cursos"
          :key="curso.id"
          class="col-md-6 col-lg-4"
        >
          <div class="card h-100 shadow-sm hover-shadow">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="card-title mb-1">{{ curso.titulo }}</h5>
                  <small class="text-muted">{{ curso.codigo }}</small>
                </div>
                <span
                  class="badge"
                  :class="curso.activo ? 'bg-success' : 'bg-danger'"
                >
                  {{ curso.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </div>

              <p class="card-text text-muted small mb-3">
                {{ curso.descripcion || 'Sin descripción' }}
              </p>

              <div class="d-flex justify-content-between text-muted small mb-3">
                <span>Por: {{ curso.creador.nombre }} {{ curso.creador.apellido }}</span>
                <span>{{ curso._count.clases }} clases</span>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  {{ curso._count.matriculas }} estudiantes
                </small>
                <RouterLink
                  :to="`/cursos/${curso.id}`"
                  class="btn btn-primary btn-sm"
                >
                  Ver Curso
                </RouterLink>
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
                @click="cargarCursos(page)"
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
import { authStore, api } from '../stores/auth'
import Layout from '../components/Layout.vue'

const loading = ref(true)
const cursos = ref([])
const meta = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0
})
const filtroActivo = ref('')

const cargarCursos = async (page = 1) => {
  try {
    loading.value = true
    
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Datos de ejemplo para demo
    const cursosDemo = [
      {
        id: 1,
        titulo: 'Introducción a la Programación',
        codigo: 'PROG-101',
        descripcion: 'Aprende los fundamentos de la programación con ejemplos prácticos',
        activo: true,
        creador: {
          nombre: 'Juan',
          apellido: 'Pérez'
        },
        _count: {
          clases: 12,
          matriculas: 25
        }
      },
      {
        id: 2,
        titulo: 'Base de Datos',
        codigo: 'BD-201',
        descripcion: 'Diseño e implementación de bases de datos relacionales',
        activo: true,
        creador: {
          nombre: 'María',
          apellido: 'García'
        },
        _count: {
          clases: 8,
          matriculas: 18
        }
      },
      {
        id: 3,
        titulo: 'Desarrollo Web',
        codigo: 'WEB-301',
        descripcion: 'Creación de aplicaciones web modernas con HTML, CSS y JavaScript',
        activo: false,
        creador: {
          nombre: 'Carlos',
          apellido: 'López'
        },
        _count: {
          clases: 15,
          matriculas: 32
        }
      },
      {
        id: 4,
        titulo: 'Algoritmos y Estructuras de Datos',
        codigo: 'ALG-401',
        descripcion: 'Estudio de algoritmos eficientes y estructuras de datos avanzadas',
        activo: true,
        creador: {
          nombre: 'Ana',
          apellido: 'Martínez'
        },
        _count: {
          clases: 10,
          matriculas: 20
        }
      }
    ]
    
    // Aplicar filtro si existe
    let cursosFiltrados = cursosDemo
    if (filtroActivo.value !== '') {
      const activo = filtroActivo.value === 'true'
      cursosFiltrados = cursosDemo.filter(curso => curso.activo === activo)
    }
    
    cursos.value = cursosFiltrados
    meta.value = {
      total: cursosFiltrados.length,
      page: 1,
      limit: 12,
      totalPages: 1
    }
  } catch (error) {
    console.error('Error cargando cursos:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarCursos()
})
</script>

<style scoped>
.hover-shadow:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>
