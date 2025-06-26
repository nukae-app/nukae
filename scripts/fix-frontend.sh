#!/bin/bash

set -e

echo "🚧 Backing up existing frontend folder..."
mv frontend frontend.bak_$(date +%s)

echo "📁 Creating fresh Vite + React + TypeScript frontend"
npm create vite@latest frontend -- --template react-ts

cd frontend

echo "📦 Installing dependencies..."
npm install

echo "🔧 Configuring Vite for Docker access..."
# Overwrite vite.config.ts
cat <<EOF > vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true
  }
})
EOF

# Overwrite App.tsx
cat <<EOF > src/App.tsx
function App() {
  return <h1>Hello from Nukae Frontend 👋</h1>
}

export default App
EOF

# Overwrite index.html
cat <<EOF > index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Nukae</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

cd ..

echo "✅ Frontend regenerated successfully. You can now run:"
echo "   docker-compose build frontend"
echo "   docker-compose up -d"
