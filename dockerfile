# Use official Node.js image as base
FROM node:14-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY chatbot-app/package*.json ./chatbot-app/

# Install dependencies
RUN cd chatbot-app && npm install

# Copy project files
COPY chatbot-app/ ./chatbot-app/

# Copy additional module
COPY . .

# Build the React app
RUN cd chatbot-app && npm run build

# Stage 2: Serve app with lightweight HTTP server
FROM nginx:alpine

# Copy built app from previous stage
COPY --from=build /app/chatbot-app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
