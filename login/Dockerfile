# Use an official Node.js Alpine runtime as a parent image
FROM node:slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY ../package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code - use the correct path relative to build context
COPY ../login/src/ ./src/

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variables will be injected by Docker Compose

# Run server.js when the container launches
CMD ["node", "./src/common/server.js"]
