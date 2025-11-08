# ---------- STAGE 1: BUILD ----------
FROM node:22-alpine AS build

WORKDIR /app

# Copy only dependency files first for caching
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy all source code
COPY . .
# Build the Next.js app
RUN npm run build

# ---------- STAGE 2: PRODUCTION ----------
FROM node:22-alpine

WORKDIR /app

# Copy only the production files
COPY package*.json ./
RUN npm install --omit=dev --frozen-lockfile

# Copy built app from builder
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./next.config.js

# Expose Next.js default port
EXPOSE 3000

# Start Next.js server
CMD ["npm", "start"]
