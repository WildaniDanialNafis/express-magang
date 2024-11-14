# Gunakan image node.js yang sudah ada
FROM node:22

# Tentukan direktori kerja
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon untuk pengembangan
RUN npm install --save-dev nodemon

# Salin seluruh file aplikasi ke dalam container
COPY . .

# Expose port 5000 untuk Express
EXPOSE 5000

# Jalankan aplikasi Express menggunakan nodemon
CMD ["npx", "nodemon", "server.js"]  # Sesuaikan dengan entry point aplikasi Anda
