# Gunakan image node.js yang sudah ada
FROM node:22

# Tentukan direktori kerja
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh file aplikasi ke dalam container
COPY . .

# Expose port 3000 untuk React
EXPOSE 3000

# Jalankan aplikasi React dalam mode pengembangan (npm start)
CMD ["npm", "start"]
