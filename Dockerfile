# ---- Stage 1: Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# NEXT_PUBLIC_* vars must be available at build time (baked into client bundle)
ARG NEXT_PUBLIC_APP_VERSION=""
ARG NEXT_PUBLIC_GOOGLE_MAP_KEY=""
ARG NEXT_PUBLIC_PAHO=""
ARG NEXT_PUBLIC_API_BASE_URL=""
ENV NEXT_PUBLIC_GOOGLE_MAP_KEY=$NEXT_PUBLIC_GOOGLE_MAP_KEY
ENV NEXT_PUBLIC_PAHO=$NEXT_PUBLIC_PAHO
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---- Stage 2: Production ----
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# Standalone output includes server + only required server-side node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3001

CMD ["node", "server.js"]
