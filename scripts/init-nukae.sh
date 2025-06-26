#!/bin/bash

# Initialize base project structure for Nukae
# Author: Pau
# Description: Creates backend/frontend/db/docker folders and starter files

echo "📁 Creating project directories..."

mkdir -p backend/app/{api,core,models,schemas,services}
mkdir -p frontend/src/{components,pages}
mkdir -p db
mkdir -p docker
mkdir -p scripts

echo "📝 Creating initial files..."

touch backend/app/main.py
touch backend/requirements.txt
touch frontend/src/App.tsx
touch frontend/package.json
touch db/init.sql
touch docker/docker-compose.yml
touch .env.example
touch Makefile
echo "# Nukae" > README.md

echo "🛠️ Adding .gitignore..."
cat <<EOL > .gitignore
__pycache__/
*.pyc
.env
.vscode/
node_modules/
dist/
pgdata/
EOL

echo "✅ Project structure created."

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
  echo "🔃 Initializing Git repository..."
  git init
  git add .
  git commit -m "Initial commit: base project structure"
fi

echo "🚀 Done. You can now push to GitHub."
