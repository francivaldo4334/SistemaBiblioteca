#!/bin/bash

# Para o script se um comando falhar
set -e

# Inicia o backend em background
echo "Iniciando o backend..."
cd backend
source .venv/bin/activate
python manage.py runserver &
cd ..

# Inicia o frontend em background
echo "Iniciando o frontend..."
cd frontend
npm run dev &
cd ..

echo "----------------------------------------------------"
echo "Servidores iniciados!"
echo "Backend rodando em: http://127.0.0.1:8000"
echo "Frontend rodando em: http://localhost:5173 (ou na porta indicada pelo Vite)"
echo "----------------------------------------------------"

# Espera que os processos em background terminem (se o usuário fechar o script)
wait
