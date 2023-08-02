# ---- Build Stage ----
FROM maven:3.8.5-openjdk AS build
# Copy your source code and pom.xml to the image
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app
# Build the application
RUN mvn -X -f /usr/src/app/pom.xml clean package

# ---- Runtime Stage ----
FROM openjdk AS runtime
COPY --from=build /usr/src/app/target/*.jar /app.jar
CMD ["java","-jar","/app.jar"]
