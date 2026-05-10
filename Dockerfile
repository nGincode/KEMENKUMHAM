# Menggunakan Node.js versi 20 (LTS) sebagai basis
FROM node:24-alpine AS builder

# Install build dependencies untuk library seperti 'sharp' atau 'canvas' jika diperlukan
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (termasuk devDependencies untuk build Next.js)
RUN npm install

# Copy semua source code
COPY . .

# Jalankan build Next.js
RUN npm run build

# --- Stage Runtime ---
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy file yang dibutuhkan dari stage builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Jika ada folder lain seperti 'cron', copy juga di sini
COPY --from=builder /app/cron ./cron 

# Expose port internal
EXPOSE 1999

# Jalankan server custom Anda (Express)
CMD ["npm", "start"]