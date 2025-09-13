import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { authStore } from './stores/auth'

// Bootstrap CSS e JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'

const app = createApp(App)
app.use(router)

// Hacer el store global
app.config.globalProperties.$auth = authStore

app.mount('#app')
