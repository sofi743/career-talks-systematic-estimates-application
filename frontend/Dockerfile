##build this image command, executing this from Dockerfile location (backend folder)
## docker build -t frontend .

############## Stage 1: Build the application
# Uses the latest node version and makes a refference to be used later
FROM node-14.21.3 AS build

# Sets the working directory inside the Docker container to /docker-app. Some commands will be run from this directory.
WORKDIR /docker-app

# Copies what's inside the current directory to the working directory
COPY . /docker-app/

#todo make a permanent solution, this is temporary to fix builds on TeamCity
RUN npm i

# Builds the angular app inside the working directory
RUN npm run build

############## Serve the application from Nginx
# Nginx is a web server that serves the static files (html, css and js files from built Angular application)
FROM nginx:alpine3.18

# Remove the default configuration file if needed
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom NGINX configuration file to the container
COPY default.conf /etc/nginx/conf.d/default.conf

# Copies the static files from the /docker-app/dist/retro-app directory in the build stage into the Nginx serving directory
COPY --from=build /docker-app/dist/mxestimates-lobby /usr/share/nginx/html
