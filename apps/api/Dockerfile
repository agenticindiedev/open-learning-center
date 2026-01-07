# Build from monorepo root: docker build -f apps/api/Dockerfile .
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies (monorepo)
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
COPY packages/package.json ./packages/
RUN bun install --frozen-lockfile

# Build API
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api ./apps/api
COPY packages ./packages
WORKDIR /app/apps/api
RUN bun run build

# Production
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3010
CMD ["bun", "run", "start:prod"]
