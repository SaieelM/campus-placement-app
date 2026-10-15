# Stage 1: Build Vite React App
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build static bundle
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Default backend connection variables (can be overridden at runtime)
ENV BACKEND_HOST=backend
ENV BACKEND_PORT=5000

# Copy build artifacts to Nginx docroot
COPY --from=build /app/dist /usr/share/nginx/html

# Copy template for dynamic environment substitution at container startup
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Fallback default static config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
