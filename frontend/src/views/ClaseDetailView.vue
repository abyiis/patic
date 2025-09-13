<template>
  <Layout>
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div v-else-if="!clase" class="text-center py-8 text-gray-500">
      Clase no encontrada
    </div>

    <div v-else class="space-y-6">
      <!-- Header de la clase -->
      <div class="card">
        <div class="card-body">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ clase.titulo }}</h1>
              <p class="text-lg text-gray-600">{{ clase.curso.titulo }}</p>
              <p class="text-gray-700 mt-2">{{ clase.descripcion }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">Fecha</p>
              <p class="font-medium">{{ formatDate(clase.fecha) }}</p>
              <p v-if="clase.duracion" class="text-sm text-gray-500">
                Duración: {{ clase.duracion }} min
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Materiales -->
        <div class="lg:col-span-2">
          <div class="card">
            <div class="card-header">
              <h2 class="text-lg font-medium text-gray-900">Materiales</h2>
            </div>
            <div class="card-body">
              <div v-if="clase.materiales.length === 0" class="text-center py-4 text-gray-500">
                No hay materiales disponibles
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="material in clase.materiales"
                  :key="material.id"
                  class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div class="flex items-center space-x-3">
                    <DocumentIcon class="h-8 w-8 text-gray-400" />
                    <div>
                      <h3 class="font-medium text-gray-900">{{ material.titulo }}</h3>
                      <p class="text-sm text-gray-500">{{ material.tipo }}</p>
                    </div>
                  </div>
                  <button
                    @click="descargarMaterial(material)"
                    class="btn-primary text-sm"
                  >
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Tareas de la clase -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-gray-900">Tareas</h3>
            </div>
            <div class="card-body">
              <div v-if="clase.tareas.length === 0" class="text-center py-4 text-gray-500">
                No hay tareas asignadas
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="tarea in clase.tareas"
                  :key="tarea.id"
                  class="p-3 border border-gray-200 rounded-lg"
                >
                  <h4 class="font-medium text-gray-900">{{ tarea.titulo }}</h4>
                  <p class="text-sm text-gray-500 mt-1">
                    Fecha límite: {{ formatDate(tarea.fechaLimite) }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Puntaje: {{ tarea.puntaje }} pts
                  </p>
                  <RouterLink
                    :to="`/tareas/${tarea.id}`"
                    class="btn-primary text-sm mt-2 block text-center"
                  >
                    Ver Tarea
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Navegación -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-gray-900">Navegación</h3>
            </div>
            <div class="card-body space-y-3">
              <RouterLink
                :to="`/cursos/${clase.curso.id}`"
                class="btn-secondary w-full text-center block"
              >
                Volver al Curso
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/api'
import Layout from '@/components/Layout.vue'
import { DocumentIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const loading = ref(true)
const clase = ref(null)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const cargarClase = async () => {
  try {
    const cursoId = route.params.id
    const claseId = route.params.claseId
    const response = await api.get(`/clases/${claseId}`)
    clase.value = response.data
  } catch (error) {
    console.error('Error cargando clase:', error)
  } finally {
    loading.value = false
  }
}

const descargarMaterial = async (material: any) => {
  try {
    const response = await api.get(`/materiales/download-url/${material.archivoUrl}`)
    window.open(response.data, '_blank')
  } catch (error) {
    console.error('Error descargando material:', error)
  }
}

onMounted(() => {
  cargarClase()
})
</script>
