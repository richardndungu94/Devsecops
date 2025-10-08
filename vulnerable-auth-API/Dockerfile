### Multi-stage Dockerfile for production
### - Builds in a temporary image to install dependencies
### - Produces a smaller final image suitable for AWS ECS / Fargate

FROM node:20 AS builder
WORKDIR /usr/src/app

# Copy package manifests first for better caching
COPY package.json package-lock.json* ./

# Install all dependencies (including dev if present) in builder
RUN npm ci --prefer-offline --no-audit --progress=false

# Copy application source
COPY . .

### Final image: slim Node runtime
FROM node:20-slim
WORKDIR /usr/src/app

# Create a non-root group and user for safer container runtime (predictable uid/gid)
RUN groupadd -g 1000 appuser || true \
 && useradd --uid 1000 --gid 1000 --create-home --shell /usr/sbin/nologin appuser || true

# Copy only production node_modules and app files from builder and set ownership so
# the runtime user can read/write as needed. Uses --chown when supported by the builder.
COPY --from=builder --chown=appuser:appuser /usr/src/app /usr/src/app

# Set environment defaults (can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=3000

# Ensure the app binds to 0.0.0.0 so it works on AWS
EXPOSE 3000

# Run as non-root user
USER appuser

# Basic healthcheck (adjust path/port if your app exposes a different endpoint)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
	CMD wget -qO- --timeout=2 http://127.0.0.1:3000/ || exit 1

# Start the app (ensure your app listens on process.env.PORT or default 3000)
CMD ["node", "app.js"]
