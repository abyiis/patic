const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro';

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Base de datos simulada en memoria
let users = [
  {
    id: 1,
    email: 'admin@lms.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    nombre: 'Admin',
    apellido: 'Sistema',
    rol: 'ADMIN'
  },
  {
    id: 2,
    email: 'docente@lms.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'DOCENTE'
  },
  {
    id: 3,
    email: 'estudiante@lms.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    nombre: 'María',
    apellido: 'García',
    rol: 'ESTUDIANTE'
  }
];

let cursos = [
  {
    id: 1,
    titulo: 'Introducción a la Programación',
    descripcion: 'Curso básico de programación para principiantes',
    docente: 'Juan Pérez',
    estudiantes: [3],
    clases: [
      {
        id: 1,
        titulo: 'Variables y Tipos de Datos',
        descripcion: 'Aprende sobre variables y tipos de datos básicos',
        fecha: '2024-01-15',
        contenido: 'Contenido de la clase...'
      }
    ]
  }
];

let tareas = [
  {
    id: 1,
    titulo: 'Ejercicio de Variables',
    descripcion: 'Crear un programa que use diferentes tipos de variables',
    cursoId: 1,
    fechaLimite: '2024-01-20',
    entregas: []
  }
];

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rutas de autenticación
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      access_token: token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, nombre, apellido, rol } = req.body;

    // Verificar si el usuario ya existe
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      nombre,
      apellido,
      rol: rol || 'ESTUDIANTE'
    };

    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'Usuario creado exitosamente', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/v1/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Sesión cerrada exitosamente' });
});

// Rutas de usuario
app.get('/api/v1/users/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Rutas de cursos
app.get('/api/v1/cursos', authenticateToken, (req, res) => {
  res.json(cursos);
});

app.get('/api/v1/cursos/:id', authenticateToken, (req, res) => {
  const curso = cursos.find(c => c.id === parseInt(req.params.id));
  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado' });
  }
  res.json(curso);
});

// Rutas de tareas
app.get('/api/v1/tareas', authenticateToken, (req, res) => {
  res.json(tareas);
});

app.get('/api/v1/tareas/:id', authenticateToken, (req, res) => {
  const tarea = tareas.find(t => t.id === parseInt(req.params.id));
  if (!tarea) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }
  res.json(tarea);
});

// Ruta de salud del servidor
app.get('/api/v1/health', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente', timestamp: new Date().toISOString() });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📚 API disponible en http://localhost:${PORT}/api/v1`);
  console.log(`\n👥 Usuarios de prueba:`);
  console.log(`   Admin: admin@lms.com / password`);
  console.log(`   Docente: docente@lms.com / password`);
  console.log(`   Estudiante: estudiante@lms.com / password`);
});

module.exports = app;
