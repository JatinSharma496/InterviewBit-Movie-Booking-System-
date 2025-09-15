# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven files from backend directory
COPY backend/pom.xml .
COPY backend/src ./src

# Install Maven and wget
RUN apt-get update && apt-get install -y maven wget && rm -rf /var/lib/apt/lists/*

# Build the application
RUN mvn clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/booking-system-0.0.1-SNAPSHOT.jar"]
