# Dockerfile

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

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Copiar el archivo de configuración de producción si es necesario
# COPY --from=builder /app/.env.production ./.env.production

# Exponer el puerto en el que correrá la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
