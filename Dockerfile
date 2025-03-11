# 1. Etapa de construcción
FROM node:20-alpine AS builder

# Instalar dependencias del sistema
RUN apk add --no-cache openssl

# Copiar los archivos necesarios
COPY package*.json ./ 
RUN apk add --no-cache openssl
RUN npm install -g prisma && npm install --legacy-peer-deps
COPY . .

# Construir la aplicación Next.js
RUN npm run build

# 2. Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias necesarias
RUN apk add --no-cache openssl nginx nano tzdata

# Configurar la zona horaria a Lima, Perú
RUN cp /usr/share/zoneinfo/America/Lima /etc/localtime && \
    echo "America/Lima" > /etc/timezone

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Exponer el puerto en el que Nginx estará escuchando (puerto 443 para HTTPS)
EXPOSE 3000

# Iniciar Nginx y Next.js
CMD ["sh", "-c", "nginx -g 'daemon off;' & npm start"]
