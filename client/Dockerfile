# Use official Node.js 20 image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install && npm rebuild lightningcss

# Debug: List node_modules/.bin and installed packages
RUN ls -l node_modules/.bin && npm list --depth=0

# Copy the rest of the app code
COPY . .

# Expose Next.js dev port
EXPOSE 3000

# Start Next.js dev server with hot reload
CMD ["npm", "run", "dev"]
