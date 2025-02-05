FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY src/ ./src/

# Expose default port
EXPOSE 3000

# Run the server
CMD ["bun", "run", "src/init.ts"]