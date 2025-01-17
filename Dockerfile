# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies in a single RUN command to reduce layers
RUN npm install --legacy-peer-deps && \
    npm install @babel/plugin-proposal-private-property-in-object --save-dev --legacy-peer-deps

# Copy project files
COPY . .

# Set proper permissions
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
