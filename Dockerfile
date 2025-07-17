# Usar imagen oficial de Node
FROM node:23

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY /src/package*.json .

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY ./src/ .

# Exponer el puerto (cámbialo si tu app usa otro)
EXPOSE 3000

# Comando para ejecutar la app
CMD ["node", "index.js"]

