FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --legacy-peer-deps

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Las NEXT_PUBLIC_* deben estar disponibles AL HACER BUILD porque Next las
# inlina en el bundle del cliente. Las recibimos como ARG desde compose y
# las exportamos a ENV para que `next build` las vea.
ARG NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN apk add --no-cache dumb-init && \
    addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Next standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget --spider -q http://127.0.0.1:3000/ || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
