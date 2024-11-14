# 1. Etapa de construcción
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Construir la aplicación para producción
RUN npm run build

# 2. Etapa de producción
FROM node:18-alpine

# Instalar Nginx para servir la aplicación
RUN apk add --no-cache nginx

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Copiar los archivos de certificados SSL
COPY ./cert.pem /etc/ssl/certs/cert.pem
COPY ./privkey.pem /etc/ssl/private/privkey.pem

# Copiar el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto en el que Nginx estará escuchando (puerto 443 para HTTPS)
EXPOSE 443

# Iniciar Nginx y la aplicación de Next.js en un solo proceso
CMD ["sh", "-c", "npm run start & nginx -g 'daemon off;'"]
