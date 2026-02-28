@echo off
title Travelota Front - Development Server
echo ==========================================
echo Iniciando Travelota Front en modo Desarrollo
echo ==========================================

echo.
echo Verificando/Instalando dependencias (pnpm install)...
call pnpm install

echo.
echo Iniciando el servidor (http://localhost:3000)...
call pnpm dev

echo.
echo El servidor se ha detenido.
pause
