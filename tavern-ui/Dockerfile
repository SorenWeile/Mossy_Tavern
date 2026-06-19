# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine AS production

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Render public/config.js from OLLAMA_URL/SD_URL at container start, since
# CRA's REACT_APP_* vars are baked in at build time and can't be set here.
COPY docker/config.js.template /docker/config.js.template
COPY docker/30-generate-runtime-config.sh /docker-entrypoint.d/30-generate-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/30-generate-runtime-config.sh

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
