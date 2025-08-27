# Use official Node.js 20 image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies

RUN npm install

# Copy the rest of the app code
COPY . .

# Rebuild lightningcss native binary for container platform
RUN npm rebuild lightningcss --force

# Expose Next.js dev port
EXPOSE 3000

# Start Next.js dev server with hot reload
CMD ["npm", "run", "dev"]
