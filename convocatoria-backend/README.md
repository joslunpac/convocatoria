<p align="center"><img width="100" src="src/main/resources/static/img/logo.png" alt="Convocatoria"></p>
<h1 align="center">Convocatoria - Backend</h1>

API Restful para una aplicación de eventos cofrades utilizando Spring Boot, Spring Data JPA y MySQL. Securizada con autenticación JWT basada en roles usando Spring Security.

**Herramientas empleadas:**

- ![](https://img.shields.io/badge/Java-11-%23007396?style=flat-square&logo=java)
- ![Maven Central](https://img.shields.io/maven-central/v/org.springframework.boot/spring-boot?color=%236DB33F&label=Spring%20Boot&logo=Spring%20Boot&style=flat-square&versionSuffix=2.5.2)
- ![Maven Central](https://img.shields.io/maven-central/v/org.springframework.boot/spring-boot-starter-data-jpa?color=%236DB33F&label=Spring%20Data%20JPA&logo=Spring%20Boot&style=flat-square&versionSuffix=2.5.2) ![Maven Central](https://img.shields.io/maven-central/v/mysql/mysql-connector-java?color=%234479A1&label=MySQL&logo=MySQL&logoColor=FFF&style=flat-square)
- ![Maven Central](https://img.shields.io/maven-central/v/org.springframework.boot/spring-boot-starter-security?color=%236DB33F&label=Spring%20Security&logo=Spring%20Boot&style=flat-square&versionSuffix=2.5.2) ![Maven Central](https://img.shields.io/maven-central/v/io.jsonwebtoken/jjwt?color=blueviolet&label=JWT&logo=JSON%20Web%20Tokens&style=flat-square&versionSuffix=0.9.1)
- ![Maven Central](https://img.shields.io/maven-central/v/org.projectlombok/lombok?label=Lombok&style=flat-square) ![Maven Central](https://img.shields.io/maven-central/v/org.modelmapper.extensions/modelmapper-spring?label=Model%20Mapper&style=flat-square&versionSuffix=2.4.4) ![](https://img.shields.io/badge/Exception%20Handler-%20-red?style=flat-square)

## Configuración paso a paso

**1. Clone la aplicación**

```bash
git clone https://github.com/joslunpac/convocatoria.git
```

**2. Cree una base de datos MySQL**

```bash
create database convocatoria
```

**3. Configure las propiedades de la aplicación**

Sobre el directorio `convocatoria-backend/`
- Abre `src/main/resources/application.yaml`.
- Cambia `spring.datasource.username` y `spring.datasource.password` según su instalación de MySQL.

**4. Cree y ejecute la aplicación con maven**

Sobre el directorio `convocatoria-backend/`
```bash
mvn clean package
java -jar target/convocatoria-backend.jar
```

Alternativamente, puede ejecutar la aplicación sin empaquetarla usando

```bash
mvn spring-boot:run
```

