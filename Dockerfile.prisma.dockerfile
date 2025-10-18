FROM node:20-alpine

WORKDIR /app

# Install dependencies
RUN npm install -g prisma

# Copy prisma schema
COPY prisma ./prisma
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Expose Prisma Studio port
EXPOSE 5555

# Start Prisma Studio
CMD ["npx", "prisma", "studio", "--port", "5555", "--hostname", "0.0.0.0"]
