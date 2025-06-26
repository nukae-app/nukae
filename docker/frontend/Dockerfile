# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy configuration and source files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src

# Install dependencies
RUN npm install

# Expose the Vite port
EXPOSE 3000

# Start the dev server
CMD ["npm", "run", "dev"]
