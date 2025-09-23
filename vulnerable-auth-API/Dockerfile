# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy source code
COPY . .

# Expose port (change if your app uses a different port)
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
