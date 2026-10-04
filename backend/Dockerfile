FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

USER node
EXPOSE 5000

# Run migrations + (safe, idempotent) seed on every start, then boot the API
CMD ["sh", "-c", "npm run db:setup && node src/index.js"]
