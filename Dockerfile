FROM node:20

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Set environment variables for Nuxt
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Force install the missing native binding
RUN pnpm install @oxc-parser/binding-linux-x64-gnu

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 3000

# Run in development mode for hot-reloading
CMD ["pnpm", "dev"]
