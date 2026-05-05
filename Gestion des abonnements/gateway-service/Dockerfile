FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /build

COPY pom.xml pom.xml
COPY gateway-service/pom.xml gateway-service/pom.xml

WORKDIR /build/gateway-service
RUN mvn -B -q -DskipTests dependency:go-offline

COPY gateway-service/src src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /build/gateway-service/target/gateway-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
