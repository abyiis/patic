import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cursos',
    name: 'Cursos',
    component: () => import('../views/CursosView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cursos/:id',
    name: 'CursoDetail',
    component: () => import('../views/CursoDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tareas',
    name: 'Tareas',
    component: () => import('../views/TareasView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/calificaciones',
    name: 'Calificaciones',
    component: () => import('../views/CalificacionesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, requiresRole: 'ADMIN' }
  },
  {
    path: '/cursos/:id/clases/:claseId',
    name: 'ClaseDetail',
    component: () => import('../views/ClaseDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tareas/:id',
    name: 'TareaDetail',
    component: () => import('../views/TareaDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación simplificado para demo
router.beforeEach(async (to, from, next) => {
  // Permitir acceso a todas las rutas para demo
  next()
})

export default router