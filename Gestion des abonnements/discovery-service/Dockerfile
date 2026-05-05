FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /build

COPY pom.xml pom.xml
COPY discovery-service/pom.xml discovery-service/pom.xml

WORKDIR /build/discovery-service
RUN mvn -B -q -DskipTests dependency:go-offline

COPY discovery-service/src src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /build/discovery-service/target/discovery-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
