<template>
  <div class="min-vh-100">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom fixed-top">
      <div class="container-fluid">
        <!-- Brand -->
        <router-link to="/dashboard" class="navbar-brand fw-bold text-gradient animate-bounce-in">
          <i class="bi bi-mortarboard-fill me-2 pulse"></i>
          LMS Educativo
        </router-link>

        <!-- Mobile toggle -->
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Nav items -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item animate-slide-in" style="animation-delay: 0.1s;">
              <router-link to="/dashboard" class="nav-link" active-class="active">
                <i class="bi bi-house-fill me-1"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item animate-slide-in" style="animation-delay: 0.2s;">
              <router-link to="/cursos" class="nav-link" active-class="active">
                <i class="bi bi-book-fill me-1"></i> Cursos
              </router-link>
            </li>
            <li class="nav-item animate-slide-in" style="animation-delay: 0.3s;">
              <router-link to="/tareas" class="nav-link" active-class="active">
                <i class="bi bi-clipboard-check-fill me-1"></i> Tareas
              </router-link>
            </li>
            <li class="nav-item animate-slide-in" style="animation-delay: 0.4s;">
              <router-link to="/calificaciones" class="nav-link" active-class="active">
                <i class="bi bi-star-fill me-1"></i> Calificaciones
              </router-link>
            </li>
            <li v-if="authStore.isAdmin" class="nav-item animate-slide-in" style="animation-delay: 0.5s;">
              <router-link to="/admin" class="nav-link" active-class="active">
                <i class="bi bi-gear-fill me-1"></i> Admin
              </router-link>
            </li>
          </ul>

          <!-- User menu -->
          <div class="dropdown animate-slide-in" style="animation-delay: 0.6s;">
            <button class="btn btn-outline-primary dropdown-toggle d-flex align-items-center hover-lift" 
                    data-bs-toggle="dropdown">
              <div class="rounded-circle bg-primary text-white me-2 d-flex align-items-center justify-content-center position-relative" 
                   style="width: 36px; height: 36px; font-size: 14px; font-weight: 600;">
                {{ userInitials }}
                <div class="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle" 
                     style="width: 12px; height: 12px;">
                  <span class="visually-hidden">Usuario activo</span>
                </div>
              </div>
              <div class="d-flex flex-column align-items-start">
                <span class="fw-semibold">{{ authStore.user?.nombre }} {{ authStore.user?.apellido }}</span>
                <small class="text-muted">{{ getRoleText(authStore.user?.rol) }}</small>
              </div>
            </button>
            <ul class="dropdown-menu dropdown-menu-end glass-effect border-0 shadow-lg">
              <li><span class="dropdown-header text-gradient fw-bold">{{ getRoleText(authStore.user?.rol) }}</span></li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <router-link class="dropdown-item hover-lift" to="/profile">
                  <i class="bi bi-person-fill me-2 text-primary"></i> Mi Perfil
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item hover-lift" to="/settings">
                  <i class="bi bi-gear-fill me-2 text-secondary"></i> Configuración
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item hover-lift text-danger" href="#" @click="logout">
                  <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="container-fluid" style="padding-top: 100px; padding-bottom: 40px;">
      <div class="animate-fade-in">
        <slot />
      </div>
    </main>

    <!-- Floating Action Button para móviles -->
    <div class="d-lg-none position-fixed bottom-0 end-0 p-3" style="z-index: 1000;">
      <button class="btn btn-gradient rounded-circle shadow-lg pulse" 
              style="width: 60px; height: 60px;"
              data-bs-toggle="offcanvas" 
              data-bs-target="#mobileMenu">
        <i class="bi bi-list fs-4"></i>
      </button>
    </div>

    <!-- Mobile Menu Offcanvas -->
    <div class="offcanvas offcanvas-end glass-effect" tabindex="-1" id="mobileMenu">
      <div class="offcanvas-header border-bottom">
        <h5 class="offcanvas-title text-gradient">Menú</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body">
        <div class="d-flex flex-column gap-3">
          <router-link to="/dashboard" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-house-fill me-2"></i> Dashboard
          </router-link>
          <router-link to="/cursos" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-book-fill me-2"></i> Cursos
          </router-link>
          <router-link to="/tareas" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-clipboard-check-fill me-2"></i> Tareas
          </router-link>
          <router-link to="/calificaciones" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-star-fill me-2"></i> Calificaciones
          </router-link>
          <router-link v-if="authStore.isAdmin" to="/admin" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-gear-fill me-2"></i> Admin
          </router-link>
        </div>
      </div>
    </div>
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