FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
# Use npm ci for faster, more reliable builds in Docker
RUN npm install

# Copy the rest of the code
COPY . .

# Ensure the app runs in production mode inside the container
ENV NODE_ENV=production

EXPOSE 5000

# Optional: If you want migrations to run every time the container starts
# CMD ["sh", "-c", "npm run migrate && node src/index.js"]
CMD ["node", "src/index.js"]