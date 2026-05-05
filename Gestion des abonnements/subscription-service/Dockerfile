FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /build

# Copy the parent POM first because this module inherits from it.
COPY pom.xml pom.xml
COPY subscription-service/pom.xml subscription-service/pom.xml

WORKDIR /build/subscription-service
RUN mvn -B -q -DskipTests dependency:go-offline

COPY subscription-service/src src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /build/subscription-service/target/subscription-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
