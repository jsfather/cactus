# syntax=docker/dockerfile:1
FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci --no-audit --no-fund

FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_BASE_URL=https://la.ecactus.co/api
ARG NEXT_PUBLIC_STATIC_BASE_URL=https://la.ecactus.co
ARG NEXT_PUBLIC_API_URL=https://la.ecactus.co
ARG NEXT_PUBLIC_HOME_HERO_VIDEO_URL=https://la.ecactus.co/site_videos/robocup-2024.mp4
ARG NEXT_PUBLIC_HOME_VIDEO_1_URL=https://la.ecactus.co/site_videos/intro-1.mp4
ARG NEXT_PUBLIC_HOME_VIDEO_2_URL=https://la.ecactus.co/site_videos/intro-2.mp4
ARG NEXT_PUBLIC_HOME_VIDEO_3_URL=https://la.ecactus.co/site_videos/intro-3.mp4
# The Node 22 Alpine build needs more than 384 MiB for this bundle. Keep a
# bounded heap so a small VPS fails predictably instead of swapping indefinitely.
ARG NEXT_BUILD_MAX_OLD_SPACE_SIZE=768
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_STATIC_BASE_URL=$NEXT_PUBLIC_STATIC_BASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_HOME_HERO_VIDEO_URL=$NEXT_PUBLIC_HOME_HERO_VIDEO_URL
ENV NEXT_PUBLIC_HOME_VIDEO_1_URL=$NEXT_PUBLIC_HOME_VIDEO_1_URL
ENV NEXT_PUBLIC_HOME_VIDEO_2_URL=$NEXT_PUBLIC_HOME_VIDEO_2_URL
ENV NEXT_PUBLIC_HOME_VIDEO_3_URL=$NEXT_PUBLIC_HOME_VIDEO_3_URL
ENV NODE_OPTIONS="--max-old-space-size=${NEXT_BUILD_MAX_OLD_SPACE_SIZE}"
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV CI=1
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/healthz').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1));"]
CMD ["node", "server.js"]
