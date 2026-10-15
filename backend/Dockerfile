FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application source code
COPY . .

# Expose backend API port
EXPOSE 5000

# Run the server
CMD ["node", "index.js"]
