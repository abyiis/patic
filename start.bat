@echo off
echo Iniciando LMS Educativo...
echo.

echo Iniciando Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Servidor iniciado:
echo - Frontend: http://localhost:5173
echo.
echo El proyecto funciona en modo demo sin autenticación.
echo Puedes navegar directamente a todas las páginas.
echo.
pause
