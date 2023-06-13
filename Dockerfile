# Use the official Node.js base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy the entire application
COPY . .

# Expose the port your NestJS application is listening on
EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
