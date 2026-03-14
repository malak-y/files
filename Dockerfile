FROM node:18-alpine AS deps
WORKDIR /app
COPY app/package*.json ./
RUN npm install --only=production

FROM node:18-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY app/ .

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "app.js"]
