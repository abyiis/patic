<template>
  <Layout>
    <div class="text-center py-12">
      <div class="max-w-md mx-auto">
        <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
        <p class="text-gray-600 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <RouterLink to="/dashboard" class="btn-primary">
          Volver al Dashboard
        </RouterLink>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/Layout.vue'
</script>
