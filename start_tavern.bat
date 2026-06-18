@echo off
echo Starting MossyTavern services...
echo ===============================
cd /d "%~dp0"

echo.
echo Select setup option:
echo 1. Simple (Ollama + UI only)
echo 2. Full (Ollama + Stable Diffusion + UI)
echo.
set /p choice=Enter choice (1 or 2):

if "%choice%"=="2" (
    echo Starting full setup (this may take a while)...
    docker-compose -f docker-compose-full.yml up -d
) else (
    echo Starting simple setup (Ollama + UI)...
    docker-compose up -d
)

echo.
echo Waiting for services to start...
timeout /t 15 /nobreak >nul

echo.
echo ===============================
echo MossyTavern is now running!
echo.
echo - Ollama API: http://localhost:11434
echo - Tavern UI: http://localhost:3000
if "%choice%"=="2" (
    echo - Stable Diffusion: http://localhost:7860
)
echo ===============================
echo.
echo Note: First run will download models (may take time)
echo To stop: docker-compose down
pause
