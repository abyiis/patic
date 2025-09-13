<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col">
          <div class="glass-effect p-4 animate-fade-in">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h1 class="h2 mb-2 text-gradient">
                  <i class="bi bi-book-fill me-2"></i>Cursos
                </h1>
                <p class="text-muted mb-0 fs-5">Explora todos los cursos disponibles y comienza tu aprendizaje</p>
              </div>
              <RouterLink
                v-if="authStore.isAdmin || authStore.isDocente"
                to="/cursos/crear"
                class="btn btn-gradient hover-lift"
              >
                <i class="bi bi-plus-circle me-2"></i>
                Crear Curso
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in" style="animation-delay: 0.1s;">
            <label class="form-label fw-semibold mb-2">
              <i class="bi bi-funnel me-1"></i>Filtrar cursos
            </label>
            <select v-model="filtroActivo" class="form-select border-0 bg-transparent" @change="cargarCursos(1)">
              <option value="">Todos los cursos</option>
              <option value="true">Cursos activos</option>
              <option value="false">Cursos inactivos</option>
            </select>
          </div>
        </div>
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in" style="animation-delay: 0.2s;">
            <label class="form-label fw-semibold mb-2">
              <i class="bi bi-search me-1"></i>Buscar
            </label>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar cursos...">
          </div>
        </div>
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in" style="animation-delay: 0.3s;">
            <label class="form-label fw-semibold mb-2">
              <i class="bi bi-sort-down me-1"></i>Ordenar por
            </label>
            <select class="form-select border-0 bg-transparent">
              <option>Recientes</option>
              <option>Alfabético</option>
              <option>Estudiantes</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de cursos -->
      <div v-if="loading" class="text-center py-5">
        <div class="loading-spinner mx-auto"></div>
        <p class="text-muted mt-3">Cargando cursos...</p>
      </div>

      <div v-else-if="cursos.length === 0" class="text-center py-5">
        <div class="glass-effect p-5 animate-bounce-in">
          <div class="mb-4">
            <i class="bi bi-book text-muted" style="font-size: 4rem;"></i>
          </div>
          <h4 class="text-muted mb-3">No hay cursos disponibles</h4>
          <p class="text-muted mb-4">Parece que no hay cursos para mostrar en este momento.</p>
          <RouterLink
            v-if="authStore.isAdmin || authStore.isDocente"
            to="/cursos/crear"
            class="btn btn-gradient"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Crear Primer Curso
          </RouterLink>
        </div>
      </div>

      <div v-else class="row g-4">
        <div
          v-for="(curso, index) in cursos"
          :key="curso.id"
          class="col-md-6 col-lg-4"
        >
          <div class="card-hover h-100 animate-bounce-in" :style="{ animationDelay: `${0.4 + index * 0.1}s` }">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="flex-grow-1">
                  <h5 class="card-title mb-1 fw-bold text-gradient">{{ curso.titulo }}</h5>
                  <small class="text-muted fw-semibold">{{ curso.codigo }}</small>
                </div>
                <span
                  class="badge rounded-pill px-3 py-2"
                  :class="curso.activo ? 'bg-success' : 'bg-danger'"
                >
                  <i class="bi bi-circle-fill me-1" style="font-size: 0.5rem;"></i>
                  {{ curso.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </div>

              <p class="card-text text-muted mb-4" style="line-height: 1.6;">
                {{ curso.descripcion || 'Sin descripción disponible' }}
              </p>

              <div class="row g-2 mb-4">
                <div class="col-6">
                  <div class="d-flex align-items-center text-muted small">
                    <i class="bi bi-person-fill me-2 text-primary"></i>
                    <span>{{ curso._count.matriculas }} estudiantes</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="d-flex align-items-center text-muted small">
                    <i class="bi bi-collection-play-fill me-2 text-info"></i>
                    <span>{{ curso._count.clases }} clases</span>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
                    <i class="bi bi-person-badge text-primary"></i>
                  </div>
                  <div>
                    <small class="text-muted d-block">Instructor</small>
                    <small class="fw-semibold">{{ curso.creador.nombre }} {{ curso.creador.apellido }}</small>
                  </div>
                </div>
              </div>

              <div class="d-grid">
                <RouterLink
                  :to="`/cursos/${curso.id}`"
                  class="btn btn-gradient hover-lift"
                >
                  <i class="bi bi-arrow-right me-2"></i>
                  Ver Curso
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="meta.totalPages > 1" class="d-flex justify-content-center mt-5">
        <nav>
          <ul class="pagination glass-effect p-2 rounded-3">
            <li
              v-for="page in meta.totalPages"
              :key="page"
              class="page-item"
              :class="{ active: page === meta.page }"
            >
              <button
                @click="cargarCursos(page)"
                class="page-link border-0 rounded-2 mx-1"
                :class="{ 'btn-gradient text-white': page === meta.page }"
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
