#!/bin/bash

set -e

# --- Check for Node.js and npm ---
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
  echo "❌ Node.js and npm are required but not installed."
  exit 1
fi

# --- Create frontend structure ---
echo "📁 Creating frontend folder and files..."
mv frontend frontend.bak_$(date +%s) 2>/dev/null || true
mkdir -p frontend/public frontend/src

# --- Create package.json ---
cat <<EOF > frontend/package.json
{
  "name": "nukae-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite --host 0.0.0.0 --strictPort"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# --- Create tsconfig.json ---
cat <<EOF > frontend/tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
EOF

# --- Create vite.config.ts ---
cat <<EOF > frontend/vite.config.ts
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

# --- Create index.html ---
cat <<EOF > frontend/index.html
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

# --- Create App.tsx ---
cat <<EOF > frontend/src/App.tsx
function App() {
  return <h1>Hello from Nukae Frontend 👋</h1>
}

export default App
EOF

# --- Create main.tsx ---
cat <<EOF > frontend/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

# --- Create Dockerfile ---
cat <<EOF > frontend/Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
EOF

# --- Install npm packages ---
echo "📦 Installing npm packages..."
cd frontend && npm install && cd ..

# --- Done ---
echo "✅ Frontend setup complete. Now run:"
echo "   docker-compose build frontend"
echo "   docker-compose up -d"
