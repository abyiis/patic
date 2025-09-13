# LMS Educativo

Sistema de gestión de aprendizaje (LMS) desarrollado con Vue.js 3 y Node.js.

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)
```bash
# Ejecutar el script de inicio
start.bat
```

### Opción 2: Manual

#### Backend
```bash
cd backend
npm install
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📱 Acceso

- **Frontend**: http://localhost:5173
- **Página Principal**: Se carga automáticamente en `/dashboard`

## 🎯 Navegación Disponible

- **Dashboard** (`/dashboard`) - Página principal con resumen
- **Cursos** (`/cursos`) - Lista de cursos disponibles
- **Tareas** (`/tareas`) - Gestión de tareas asignadas
- **Calificaciones** (`/calificaciones`) - Vista de calificaciones y progreso
- **Perfil** (`/profile`) - Edición de información personal

## 🛠️ Tecnologías

### Frontend
- Vue.js 3
- Vue Router
- Bootstrap 5
- Bootstrap Icons
- Axios
- Vite

### Backend
- Node.js
- Express.js
- JWT (JSON Web Tokens)
- bcryptjs
- CORS

## 📋 Funcionalidades

- ✅ **Modo Demo**: Funciona sin autenticación para demostración
- ✅ **Dashboard**: Página principal con estadísticas y resumen
- ✅ **Cursos**: Lista de cursos con filtros y navegación
- ✅ **Tareas**: Gestión de tareas con estados y filtros
- ✅ **Calificaciones**: Vista de calificaciones con progreso y comentarios
- ✅ **Perfil**: Edición de información personal y cambio de contraseña
- ✅ **Navegación**: Menú completo accesible desde cualquier página

## 🔧 Desarrollo

### Estructura del Proyecto
```
proyectoPlataformas/
├── frontend/          # Aplicación Vue.js
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── stores/
│   │   ├── router/
│   │   └── services/
│   └── package.json
├── backend/           # API Node.js
│   ├── server.js
│   └── package.json
└── start.bat         # Script de inicio
```

### Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 🐛 Solución de Problemas

1. **Puerto ocupado**: Cambiar puertos en `vite.config.js` (frontend) y `server.js` (backend)
2. **Error de CORS**: Verificar configuración en `server.js`
3. **Dependencias**: Ejecutar `npm install` en ambos directorios

## 📝 Notas

- El backend usa una base de datos en memoria (se reinicia al reiniciar el servidor)
- Las contraseñas están hasheadas con bcrypt
- Los tokens JWT expiran en 24 horas
- El proyecto está configurado para desarrollo local
