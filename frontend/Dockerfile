# Use node:16-alpine as the base image
FROM node:20-alpine as build

# Set the working directory
WORKDIR /project_dir

# Copy package.json and package-lock.json files
COPY ./frontend/package.json ./frontend/package-lock.json ./

# Install dependencies
RUN npm install

# Copy all the frontend code
COPY ./frontend .

# Install nodemon for hot reloading
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]