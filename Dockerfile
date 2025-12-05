
FROM maven:3.8-openjdk-17 AS builder


COPY pom.xml /usr/src/app/
WORKDIR /usr/src/app
COPY src/ /usr/src/app/src/

RUN mvn clean package -Dmaven.test.skip=true

FROM eclipse-temurin:17-jre-focal

WORKDIR /opt/myapp

COPY --from=builder /usr/src/app/target/*.jar /opt/myapp/app.jar

COPY src/main/resources/certs/server.pem /usr/local/share/ca-certificates/

RUN update-ca-certificates

ENTRYPOINT ["java","-jar","/opt/myapp/app.jar"]