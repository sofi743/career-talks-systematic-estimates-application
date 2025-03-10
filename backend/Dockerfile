##build this image command, executing this from Dockerfile location (backend folder)
## docker build -t backend .



############## BUILD IMAGE SECTION
# Start with a base image containing Java runtime
FROM eclipse-temurin:17-jdk-alpine-3.21

# Make port 8080 available to the world outside this container
EXPOSE 8080 5005

# The application's jar file
ARG JAR_FILE=build/libs/*.jar

# Add the application's jar to the container
COPY ${JAR_FILE} app.jar
ENV ENGINE_HOST="host.docker.internal"
ENV ENGINE_PORT="2375"
############## RUN IMAGE SECTION
# Run the jar file
ENTRYPOINT ["java","-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
