#!/bin/bash

# Paso 1: Obtener la IP local
IP_LOCAL=$(hostname -I | awk '{print $1}')
echo "IP local detectada: $IP_LOCAL"

# Paso 2: Pedir el puerto para exponer la aplicación
read -p "Introduce el puerto para exponer la aplicación (por ejemplo, 3084): " PUERTO
echo "El puerto de exposición será: $PUERTO"

# Paso 3: Escribir la configuración de Nginx
cat <<EOF > nginx.conf
server {
    listen 80;
    server_name $IP_LOCAL;

    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $IP_LOCAL;

    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:AES128-GCM-SHA256:...';

    location / {
        proxy_pass http://localhost:$PUERTO;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

echo "Archivo nginx.conf generado para el servidor con la IP: $IP_LOCAL y el puerto: $PUERTO"

# Paso 4: Crear el Dockerfile
cat <<EOF > Dockerfile
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

# Instalar Nginx y OpenSSL dentro del contenedor
RUN apk add --no-cache openssl nginx

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Copiar la configuración de Nginx al contenedor
COPY nginx.conf /etc/nginx/nginx.conf

# Generar el certificado SSL dentro del contenedor
RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/privkey.pem -out /etc/ssl/certs/cert.pem -days 365 -nodes -subj "/CN=$IP_LOCAL"

# Exponer el puerto en el que correrá la aplicación
EXPOSE $PUERTO

# Comando para iniciar Nginx y la aplicación Node.js
CMD ["sh", "-c", "nginx && npm start"]
EOF

echo "Dockerfile generado con el puerto $PUERTO"

# Paso 5: Crear la imagen Docker
docker build -t plantilla-app-$PUERTO .

# Paso 6: Levantar el contenedor Docker usando el archivo .env ya existente
docker run -d -p $PUERTO:$PUERTO --name plantilla-app-$PUERTO --env-file .env plantilla-app-$PUERTO

echo "Contenedor Docker levantado en el puerto $PUERTO"

# Paso 7: Reiniciar el contenedor para aplicar la configuración de Nginx y SSL
docker restart plantilla-app-$PUERTO

echo "El contenedor ha sido reiniciado con la configuración de SSL y el puerto $PUERTO"
