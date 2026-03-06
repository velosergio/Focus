# Changelog – Focus

Registro de cambios implementados según el roadmap del proyecto.

---

## Paso 1 – Preparar backend base en Spring Boot

### Configuración del proyecto

- **application.properties**: Configuración MySQL para XAMPP (`localhost:3306/focus`, usuario `root`, sin contraseña), JPA con `ddl-auto=update`, `show-sql=true`.
- **application-dev.properties** y **application-prod.properties**: Perfiles separados para desarrollo y producción.
- **Perfil activo por defecto**: `dev`.

### Modelado del dominio

- **Enums**: `Prioridad` (BAJA, MEDIA, ALTA), `EstadoTarea` (PENDIENTE, EN_PROGRESO, COMPLETADA), `TipoSesionPomodoro` (TRABAJO, DESCANSO_CORTO, DESCANSO_LARGO).
- **Entidades JPA**:
  - `Usuario`: id, nombre, email, password, createdAt, updatedAt.
  - `Tarea`: id, usuario (ManyToOne nullable), titulo, descripcion, prioridad, etiquetas (ElementCollection), fechaLimite, estimacionPomodoros, pomodorosCompletados, estado, createdAt, updatedAt.
  - `SesionPomodoro`: id, tarea, tipo, duracionMinutos, fechaInicio, fechaFin.
- **Repositorios**: `UsuarioRepository`, `TareaRepository`, `SesionPomodoroRepository`.

### Estructura de capas (MVC)

- **Paquetes**: `config`, `controller`, `dto`, `model.entity`, `repository`, `service`, `service.impl`.
- **DTOs y mappers**: `UsuarioDto`, `TareaDto`, `SesionPomodoroDto`; `UsuarioMapper`, `TareaMapper`, `SesionPomodoroMapper`.
- **Servicios**: `UsuarioService` / `UsuarioServiceImpl`, `TareaService` / `TareaServiceImpl`.
- **SecurityConfig**: Configuración temporal con `permitAll()` para todas las peticiones.
- **HealthController**: Endpoint `GET /health` que devuelve `{"status":"UP"}`.

### Resultado

- Backend arranca con `gradlew.bat bootRun`.
- Conexión a MySQL operativa; Hibernate crea las tablas.
- Estructura lista para el Paso 2.

---

## Paso 2 – Autenticación y seguridad (Spring Security + JWT)

### Dependencias

- **JJWT 0.12.6**: `jjwt-api`, `jjwt-impl`, `jjwt-jackson` para generación y validación de tokens.
- **spring-boot-starter-validation**: Validación de DTOs con Bean Validation.

### Configuración JWT

- **application.properties**: `focus.jwt.secret` y `focus.jwt.expiration-ms` (24 h por defecto).
- Soporte para variables de entorno en producción: `FOCUS_JWT_SECRET`, `FOCUS_JWT_EXPIRATION_MS`.

### Integración con Spring Security

- **SecurityUser**: Adaptador de `Usuario` a `UserDetails`.
- **CustomUserDetailsService**: Carga usuarios por email desde la base de datos.
- **JwtService**: Generación, validación y extracción del subject del token.
- **JwtAuthenticationFilter**: Lee `Authorization: Bearer`, valida el token y establece la autenticación en el contexto.

### Endpoints de autenticación

- **DTOs**: `RegisterRequest`, `LoginRequest`, `AuthResponse`.
- **AuthService** / **AuthServiceImpl**: Registro (BCrypt) y login.
- **AuthController**:
  - `POST /auth/register`: Crea usuario, valida email único, devuelve JWT y datos del usuario.
  - `POST /auth/login`: Valida credenciales, devuelve JWT y datos del usuario.
  - `GET /auth/me`: Devuelve el usuario autenticado (requiere token).
- **Excepciones**: `EmailAlreadyExistsException` (400), `InvalidCredentialsException` (401).

### SecurityConfig actualizado

- **Sesión**: `STATELESS` (sin sesión HTTP).
- **Rutas públicas**: `/auth/register`, `/auth/login`, `/health`.
- **Rutas protegidas**: Resto de endpoints requieren `Authorization: Bearer <token>`.
- **PasswordEncoder**: Bean `BCryptPasswordEncoder` para hashear contraseñas.
- **Filtro JWT**: Registrado antes de `UsernamePasswordAuthenticationFilter`.

### Otros cambios

- **GlobalExceptionHandler**: Manejo global de `HttpMessageNotReadableException` (JSON mal formado) con respuesta 400.
- **Validación**: Anotaciones `@Valid`, `@NotBlank`, `@Email`, `@Size` en DTOs de auth.

### Resultado

- Sistema de login/registro funcional con JWT.
- Endpoints protegidos según políticas definidas.
- Soporte para uso sin sesión: frontend usa `localStorage` cuando el usuario no está autenticado.

---

## Correcciones posteriores

- **Hibernate dialect**: Añadido `spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect` por incompatibilidad Hibernate 7.x / MySQL 8.0 (error "Unknown column RESERVED").
- **JPA open-in-view**: `spring.jpa.open-in-view=false` para evitar el aviso de consultas durante el renderizado.
- **Ruta raíz pública**: `WebSecurityCustomizer` para ignorar `/` y `/index.html`; endpoint `GET /` en `HealthController` que devuelve información básica de la API.
- **JwtAuthenticationFilter**: Eliminadas anotaciones `@NonNull` deprecadas.
