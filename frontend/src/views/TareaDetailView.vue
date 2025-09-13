<template>
  <Layout>
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div v-else-if="!tarea" class="text-center py-8 text-gray-500">
      Tarea no encontrada
    </div>

    <div v-else class="max-w-4xl mx-auto space-y-6">
      <!-- Header de la tarea -->
      <div class="card">
        <div class="card-body">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ tarea.titulo }}</h1>
              <p class="text-lg text-gray-600">{{ tarea.curso.titulo }}</p>
              <p class="text-gray-700 mt-2">{{ tarea.descripcion }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">Fecha límite</p>
              <p class="font-medium">{{ formatDate(tarea.fechaLimite) }}</p>
              <p class="text-sm text-gray-500">Puntaje: {{ tarea.puntaje }} pts</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Formulario de entrega (para estudiantes) -->
        <div v-if="authStore.isEstudiante" class="card">
          <div class="card-header">
            <h2 class="text-lg font-medium text-gray-900">Mi Entrega</h2>
          </div>
          <div class="card-body">
            <div v-if="miEntrega">
              <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 class="font-medium text-gray-900">Entrega actual</h3>
                <p class="text-sm text-gray-600 mt-1">{{ miEntrega.comentario }}</p>
                <p class="text-sm text-gray-500 mt-2">
                  Estado: {{ getEstadoText(miEntrega.estado) }}
                </p>
                <p v-if="miEntrega.calificacion" class="text-sm text-gray-500">
                  Calificación: {{ miEntrega.calificacion }}/{{ tarea.puntaje }}
                </p>
              </div>
            </div>

            <form @submit.prevent="entregarTarea" class="space-y-4">
              <div>
                <label for="comentario" class="block text-sm font-medium text-gray-700">
                  Comentario (opcional)
                </label>
                <textarea
                  id="comentario"
                  v-model="entregaForm.comentario"
                  rows="3"
                  class="input-field mt-1"
                  placeholder="Agrega un comentario sobre tu entrega..."
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Archivo
                </label>
                <input
                  type="file"
                  @change="seleccionarArchivo"
                  class="input-field"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <p class="text-sm text-gray-500 mt-1">
                  Formatos permitidos: PDF, DOC, DOCX, TXT, JPG, PNG
                </p>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="subiendoArchivo"
                  class="btn-primary"
                >
                  <span v-if="subiendoArchivo">Subiendo...</span>
                  <span v-else>{{ miEntrega ? 'Actualizar Entrega' : 'Entregar Tarea' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Entregas (para docentes/admin) -->
        <div v-if="authStore.isDocente || authStore.isAdmin" class="card">
          <div class="card-header">
            <h2 class="text-lg font-medium text-gray-900">Entregas de Estudiantes</h2>
          </div>
          <div class="card-body">
            <div v-if="entregas.length === 0" class="text-center py-4 text-gray-500">
              No hay entregas aún
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="entrega in entregas"
                :key="entrega.id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="font-medium text-gray-900">
                      {{ entrega.estudiante.nombre }} {{ entrega.estudiante.apellido }}
                    </h3>
                    <p class="text-sm text-gray-500">{{ entrega.estudiante.email }}</p>
                  </div>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getEstadoClass(entrega.estado)"
                  >
                    {{ getEstadoText(entrega.estado) }}
                  </span>
                </div>

                <p v-if="entrega.comentario" class="text-sm text-gray-600 mb-3">
                  {{ entrega.comentario }}
                </p>

                <div class="flex items-center justify-between">
                  <div class="flex space-x-2">
                    <button
                      v-if="entrega.archivoUrl"
                      @click="descargarEntrega(entrega)"
                      class="btn-secondary text-sm"
                    >
                      Descargar
                    </button>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <input
                      v-model="entrega.calificacion"
                      type="number"
                      :max="tarea.puntaje"
                      min="0"
                      class="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Pts"
                    />
                    <button
                      @click="calificarEntrega(entrega)"
                      class="btn-primary text-sm"
                    >
                      Calificar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Información de la tarea -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-medium text-gray-900">Información</h2>
          </div>
          <div class="card-body space-y-4">
            <div>
              <h3 class="font-medium text-gray-900">Detalles</h3>
              <ul class="mt-2 text-sm text-gray-600 space-y-1">
                <li>Curso: {{ tarea.curso.titulo }}</li>
                <li>Fecha límite: {{ formatDate(tarea.fechaLimite) }}</li>
                <li>Puntaje máximo: {{ tarea.puntaje }} puntos</li>
                <li>Total de entregas: {{ tarea.entregas.length }}</li>
              </ul>
            </div>

            <div>
              <h3 class="font-medium text-gray-900">Navegación</h3>
              <div class="mt-2 space-y-2">
                <RouterLink
                  :to="`/cursos/${tarea.curso.id}`"
                  class="btn-secondary w-full text-center block"
                >
                  Volver al Curso
                </RouterLink>
                <RouterLink
                  to="/tareas"
                  class="btn-secondary w-full text-center block"
                >
                  Ver Todas las Tareas
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import Layout from '@/components/Layout.vue'

const route = useRoute()
const authStore = useAuthStore()
const loading = ref(true)
const tarea = ref(null)
const entregas = ref([])
const miEntrega = ref(null)
const subiendoArchivo = ref(false)

const entregaForm = ref({
  comentario: '',
  archivo: null
})

const getEstadoClass = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800'
    case 'ENTREGADA': return 'bg-blue-100 text-blue-800'
    case 'CALIFICADA': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
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
    month: 'long',
    day: 'numeric'
  })
}

const cargarTarea = async () => {
  try {
    const tareaId = route.params.id
    const response = await api.get(`/tareas/${tareaId}`)
    tarea.value = response.data
    entregas.value = response.data.entregas
  } catch (error) {
    console.error('Error cargando tarea:', error)
  } finally {
    loading.value = false
  }
}

const seleccionarArchivo = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    entregaForm.value.archivo = target.files[0]
  }
}

const entregarTarea = async () => {
  try {
    subiendoArchivo.value = true
    let archivoUrl = null

    // Subir archivo si se seleccionó uno
    if (entregaForm.value.archivo) {
      const fileName = entregaForm.value.archivo.name
      const contentType = entregaForm.value.archivo.type
      
      const uploadResponse = await api.get(`/entregas/upload-url?fileName=${fileName}&contentType=${contentType}`)
      const { presignedUrl, objectName } = uploadResponse.data

      // Subir archivo a MinIO
      await fetch(presignedUrl, {
        method: 'PUT',
        body: entregaForm.value.archivo,
        headers: {
          'Content-Type': contentType
        }
      })

      archivoUrl = objectName
    }

    // Crear/actualizar entrega
    const entregaData = {
      tareaId: tarea.value.id,
      comentario: entregaForm.value.comentario,
      archivoUrl
    }

    if (miEntrega.value) {
      await api.patch(`/entregas/${miEntrega.value.id}`, entregaData)
    } else {
      await api.post('/entregas', entregaData)
    }

    // Recargar datos
    await cargarTarea()
    
    alert('Tarea entregada exitosamente')
  } catch (error) {
    console.error('Error entregando tarea:', error)
    alert('Error al entregar la tarea')
  } finally {
    subiendoArchivo.value = false
  }
}

const calificarEntrega = async (entrega: any) => {
  try {
    await api.patch(`/entregas/${entrega.id}`, {
      calificacion: entrega.calificacion
    })
    
    alert('Entrega calificada exitosamente')
    await cargarTarea()
  } catch (error) {
    console.error('Error calificando entrega:', error)
    alert('Error al calificar la entrega')
  }
}

const descargarEntrega = async (entrega: any) => {
  try {
    const response = await api.get(`/entregas/download-url/${entrega.archivoUrl}`)
    window.open(response.data, '_blank')
  } catch (error) {
    console.error('Error descargando entrega:', error)
  }
}

onMounted(() => {
  cargarTarea()
})
</script>
