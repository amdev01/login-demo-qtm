# Use an official Node.js Alpine runtime as a parent image
FROM node:slim

# Add build argument to specify which server.js to use
ARG SERVER_JS_PATH=./server.js
# Default path (won't be used with compose args)

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY ./package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source - copy common files and the specified server.js
COPY ./login/index.html ./
COPY ${SERVER_JS_PATH} ./server.js 
# Copy the server.js specified by the build arg

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variables will be injected by Docker Compose

# Run server.js when the container launches
CMD ["node", "server.js"]
