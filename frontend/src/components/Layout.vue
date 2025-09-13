<template>
  <div class="min-vh-100">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom fixed-top">
      <div class="container-fluid">
        <!-- Brand -->
        <router-link to="/dashboard" class="navbar-brand fw-bold text-primary">
          <i class="bi bi-mortarboard-fill me-2"></i>
          LMS Educativo
        </router-link>

        <!-- Mobile toggle -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Nav items -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/dashboard" class="nav-link" active-class="active">
                <i class="bi bi-house-fill me-1"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/cursos" class="nav-link" active-class="active">
                <i class="bi bi-book-fill me-1"></i> Cursos
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/tareas" class="nav-link" active-class="active">
                <i class="bi bi-clipboard-check-fill me-1"></i> Tareas
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/calificaciones" class="nav-link" active-class="active">
                <i class="bi bi-star-fill me-1"></i> Calificaciones
              </router-link>
            </li>
            <li v-if="authStore.isAdmin" class="nav-item">
              <router-link to="/admin" class="nav-link" active-class="active">
                <i class="bi bi-gear-fill me-1"></i> Admin
              </router-link>
            </li>
          </ul>

          <!-- User menu -->
          <div class="dropdown">
            <button class="btn btn-outline-primary dropdown-toggle d-flex align-items-center" 
                    data-bs-toggle="dropdown">
              <div class="rounded-circle bg-primary text-white me-2 d-flex align-items-center justify-content-center" 
                   style="width: 32px; height: 32px; font-size: 14px;">
                {{ userInitials }}
              </div>
              <span>{{ authStore.user?.nombre }} {{ authStore.user?.apellido }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><span class="dropdown-header">{{ getRoleText(authStore.user?.rol) }}</span></li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <router-link class="dropdown-item" to="/profile">
                  <i class="bi bi-person-fill me-2"></i> Mi Perfil
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item" href="#" @click="logout">
                  <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="container-fluid" style="padding-top: 80px; padding-bottom: 40px;">
      <div class="animate-fade-in">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth'

const router = useRouter()

const userInitials = computed(() => {
  if (!authStore.user) return ''
  return `${authStore.user.nombre[0]}${authStore.user.apellido[0]}`.toUpperCase()
})

const getRoleText = (rol: string) => {
  const roles: Record<string, string> = {
    'ADMIN': 'Administrador',
    'DOCENTE': 'Docente',
    'ESTUDIANTE': 'Estudiante'
  }
  return roles[rol] || rol
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>