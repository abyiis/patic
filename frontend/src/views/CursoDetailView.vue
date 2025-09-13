<template>
  <Layout>
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div v-else-if="!curso" class="text-center py-8 text-gray-500">
      Curso no encontrado
    </div>

    <div v-else class="space-y-6">
      <!-- Header del curso -->
      <div class="card">
        <div class="card-body">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ curso.titulo }}</h1>
              <p class="text-lg text-gray-600">{{ curso.codigo }}</p>
              <p class="text-gray-700 mt-2">{{ curso.descripcion }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">Creado por</p>
              <p class="font-medium">{{ curso.creador.nombre }} {{ curso.creador.apellido }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
          <div class="card-body text-center">
            <BookOpenIcon class="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-gray-900">{{ curso._count.clases }}</p>
            <p class="text-sm text-gray-500">Clases</p>
          </div>
        </div>
        <div class="card">
          <div class="card-body text-center">
            <UsersIcon class="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-gray-900">{{ curso._count.matriculas }}</p>
            <p class="text-sm text-gray-500">Estudiantes</p>
          </div>
        </div>
        <div class="card">
          <div class="card-body text-center">
            <ChatBubbleLeftRightIcon class="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-gray-900">{{ curso._count.mensajes || 0 }}</p>
            <p class="text-sm text-gray-500">Mensajes</p>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Clases -->
        <div class="lg:col-span-2">
          <div class="card">
            <div class="card-header">
              <h2 class="text-lg font-medium text-gray-900">Clases</h2>
            </div>
            <div class="card-body">
              <div v-if="clases.length === 0" class="text-center py-4 text-gray-500">
                No hay clases disponibles
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="clase in clases"
                  :key="clase.id"
                  class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-medium text-gray-900">{{ clase.titulo }}</h3>
                      <p class="text-sm text-gray-500 mt-1">{{ clase.descripcion }}</p>
                      <p class="text-sm text-gray-500 mt-2">
                        {{ formatDate(clase.fecha) }}
                        <span v-if="clase.duracion"> • {{ clase.duracion }} min</span>
                      </p>
                    </div>
                    <RouterLink
                      :to="`/cursos/${curso.id}/clases/${clase.id}`"
                      class="btn-primary text-sm"
                    >
                      Ver Clase
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Chat del curso -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-gray-900">Chat del Curso</h3>
            </div>
            <div class="card-body">
              <div class="h-64 overflow-y-auto space-y-2 mb-4">
                <div
                  v-for="mensaje in mensajes"
                  :key="mensaje.id"
                  class="p-2 bg-gray-50 rounded-lg"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-sm font-medium text-gray-900">
                        {{ mensaje.usuario.nombre }} {{ mensaje.usuario.apellido }}
                      </p>
                      <p class="text-sm text-gray-600">{{ mensaje.contenido }}</p>
                    </div>
                    <span class="text-xs text-gray-500">
                      {{ formatTime(mensaje.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex space-x-2">
                <input
                  v-model="nuevoMensaje"
                  type="text"
                  placeholder="Escribe un mensaje..."
                  class="input-field flex-1"
                  @keyup.enter="enviarMensaje"
                />
                <button
                  @click="enviarMensaje"
                  class="btn-primary"
                  :disabled="!nuevoMensaje.trim()"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-gray-900">Acciones</h3>
            </div>
            <div class="card-body space-y-3">
              <button
                v-if="!estoyMatriculado"
                @click="matricularse"
                class="btn-primary w-full"
              >
                Matricularse
              </button>
              <button
                v-else
                @click="desmatricularse"
                class="btn-danger w-full"
              >
                Desmatricularse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import Layout from '@/components/Layout.vue'
import {
  BookOpenIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const authStore = useAuthStore()
const loading = ref(true)
const curso = ref(null)
const clases = ref([])
const mensajes = ref([])
const nuevoMensaje = ref('')

const estoyMatriculado = computed(() => {
  // Lógica para verificar si el usuario está matriculado
  return false // Implementar según la lógica del backend
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cargarCurso = async () => {
  try {
    const cursoId = route.params.id
    const response = await api.get(`/cursos/${cursoId}`)
    curso.value = response.data
  } catch (error) {
    console.error('Error cargando curso:', error)
  }
}

const cargarClases = async () => {
  try {
    const cursoId = route.params.id
    const response = await api.get(`/cursos/${cursoId}/clases`)
    clases.value = response.data
  } catch (error) {
    console.error('Error cargando clases:', error)
  }
}

const cargarMensajes = async () => {
  try {
    const cursoId = route.params.id
    const response = await api.get(`/mensajes/curso/${cursoId}`)
    mensajes.value = response.data.data
  } catch (error) {
    console.error('Error cargando mensajes:', error)
  }
}

const enviarMensaje = async () => {
  if (!nuevoMensaje.value.trim()) return

  try {
    const cursoId = route.params.id
    await api.post('/mensajes', {
      contenido: nuevoMensaje.value,
      cursoId: parseInt(cursoId as string)
    })
    
    nuevoMensaje.value = ''
    cargarMensajes()
  } catch (error) {
    console.error('Error enviando mensaje:', error)
  }
}

const matricularse = async () => {
  try {
    const cursoId = route.params.id
    await api.post('/matriculas', {
      cursoId: parseInt(cursoId as string),
      estudianteId: authStore.user?.id
    })
    // Recargar datos
  } catch (error) {
    console.error('Error matriculándose:', error)
  }
}

const desmatricularse = async () => {
  // Implementar lógica de desmatriculación
}

onMounted(async () => {
  await Promise.all([
    cargarCurso(),
    cargarClases(),
    cargarMensajes()
  ])
  loading.value = false
})
</script>
