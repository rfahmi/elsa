# Image base dari Node.js
FROM node:14

# Direktori kerja
WORKDIR /app

# Menyalin package.json dan package-lock.json ke container
COPY package*.json ./

# Menginstal dependencies
RUN npm install

# Menyalin kode aplikasi ke container
COPY . .

# Menetapkan port yang digunakan oleh aplikasi
EXPOSE 3000

# Menjalankan aplikasi saat container dijalankan
CMD [ "npm", "start" ]
