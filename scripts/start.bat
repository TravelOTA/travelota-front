@echo off
title Travelota Front - Development Server
echo ==========================================
echo Iniciando Travelota Front en modo Desarrollo
echo ==========================================

:: Comprobar si pnpm está instalado
where pnpm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [AVISO] 'pnpm' no se encuentra instalado en tu sistema.
    echo Instalando pnpm globalmente mediante npm...
    call npm install -g pnpm
)

echo.
echo Verificando/Instalando dependencias (pnpm install)...
call pnpm install

echo.
echo Iniciando el servidor (http://localhost:3000)...
call pnpm dev

echo.
echo El servidor se ha detenido.
pause
