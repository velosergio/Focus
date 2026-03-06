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

---

## Paso 3 – API REST de tareas, pomodoros y estadísticas

### API de tareas

- **DTOs de request**: `CreateTaskRequest`, `UpdateTaskRequest` con Bean Validation.
- **TareaRepository**: Extendido con `JpaSpecificationExecutor` para filtros dinámicos.
- **TareaSpecification**: Filtros por usuario, estado, prioridad y etiquetas.
- **TareaService**: Métodos `create`, `update`, `delete` con verificación de pertenencia; `findByUsuarioWithFilters`.
- **TaskController** (`/api/tasks`):
  - `GET /`: Lista de tareas con filtros opcionales (estado, prioridad, etiquetas).
  - `POST /`: Crear tarea.
  - `GET /{id}`: Obtener tarea.
  - `PUT /{id}`: Actualizar tarea.
  - `DELETE /{id}`: Eliminar tarea.
- **Excepciones**: `TareaNotFoundException` (404), `ForbiddenException` (403).
- **GlobalExceptionHandler**: Handlers para `MethodArgumentNotValidException` y excepciones de negocio.

### Integración con sesiones Pomodoro (Factory)

- **SesionPomodoroFactory**: Crea sesiones según tipo (TRABAJO 25 min, DESCANSO_CORTO 5 min, DESCANSO_LARGO 15 min).
- **CompletePomodoroRequest**: DTO con `taskId`, `tipo`, `fechaInicio` opcional.
- **PomodoroService** / **PomodoroServiceImpl**: `completeSession` registra la sesión e incrementa `pomodorosCompletados` si es TRABAJO.
- **PomodoroController** (`/api/pomodoros`): `POST /complete` para registrar fin de sesión.

### API de estadísticas

- **DTOs**: `StatsDataPoint`, `TopTaskDto`, `TopTagDto`.
- **StatsService** / **StatsServiceImpl**: `getWeeklyStats`, `getMonthlyStats`, `getTopTasks`, `getTopTags`.
- **StatsController** (`/api/stats`):
  - `GET /weekly`: Pomodoros por día de la semana actual.
  - `GET /monthly`: Pomodoros por día del mes actual.
  - `GET /top-tasks`: Tareas con más pomodoros (query param `limit`).
  - `GET /top-tags`: Etiquetas con más pomodoros (query param `limit`).
- **SesionPomodoroRepository**: Método `findByTareaUsuarioAndTipoAndFechaFinBetween` para estadísticas.
- **TareaRepository**: Método `findByUsuarioOrderByPomodorosCompletadosDesc` para top tasks.

### Colección Postman

- **postman/Focus-API.postman_collection.json**: Colección con Auth, Tasks, Pomodoros y Stats. Variables `baseUrl` y `token`; script en Login para guardar el token automáticamente.

### Resultado

- API REST completa para tareas, registro de pomodoros y estadísticas.
- Lista para ser consumida por el frontend en el Paso 4.

---

## Paso 4 – Integración del frontend con el backend

### 4.1 Capa de servicios

- **api.ts**: URL base `VITE_API_URL` (por defecto `http://localhost:8080`), cabecera `Authorization: Bearer` con token en `localStorage` (`focus_token`). Soporte para respuestas 204 sin cuerpo.
- **authService**: `login`, `register` (mapeo de `accessToken` a token), `getProfile` (`/auth/me`). Respuesta del backend adaptada a `{ token, usuario }`.
- **taskService**: `getTasks` (con filtros opcionales), `createTask`, `getTask`, `updateTask` (PUT), `deleteTask`, `setTaskCompleted`. Mapeo entre DTOs del backend (prioridad/estado en mayúsculas) y tipos frontend (minúsculas).
- **statsService**: `getWeeklyStats`, `getMonthlyStats`, `getTopTasks`, `getTopTags`.
- **pomodoroService**: `completeSession` (`POST /api/pomodoros/complete` con `taskId` y `tipo`).
- **.env.example**: `VITE_API_URL=http://localhost:8080`.

### 4.2 Vistas principales

- **Home (`/`)**: Formulario de tareas llama a `taskService.createTask` cuando hay usuario autenticado; listado con `taskService.getTasks` y mutaciones según auth. Temporizador: al completar un Pomodoro de trabajo, si hay usuario se llama a `pomodoroService.completeSession` y se hace `refetch` de tareas; en modo invitado se mantiene `incrementarPomodoro` local. Toasts como observadores del evento “Pomodoro completado”.
- **Estadísticas (`/estadisticas`)**: Si el usuario está autenticado se usan `statsService.getWeeklyStats`, `getMonthlyStats`, `getTopTasks`, `getTopTags`; si no, se mantiene el cálculo local a partir de `useTasks().todasLasTareas`.

### 4.3 Autenticación en la UI

- **useAuth**: Conectado al backend real (`authService.login`, `authService.register`). Almacenamiento de token y usuario en `localStorage`; `logout` limpia ambos.
- **Header**: Muestra nombre de usuario y botón Salir cuando está autenticado; botón Entrar abre el modal.
- **AuthModal**: Formularios de login y registro llaman a `useAuth().login` y `useAuth().register`.
- **Banner**: Cuando no hay sesión, se muestra un aviso bajo el header invitando a crear cuenta para guardar el progreso, con enlace que abre el modal de auth.

### 4.4 Pruebas y pulido

- **usePomodoroTimer.test.ts**: Pruebas de estado inicial, iniciar y avance del tiempo, pausar y comprobar que el tiempo no avanza.
- **useTasks.test.ts**: Pruebas de agregar tarea (modo invitado), completar tarea e incrementar pomodoro, con `localStorage` limpio en cada test.

### Resultado

- Frontend y backend integrados: registro, login, CRUD de tareas, registro de pomodoros y estadísticas funcionando de extremo a extremo.
- Modo invitado con datos en `localStorage` y banner para invitar a registrarse.

---

## Paso 5 – Preparar despliegue y documentación

### Servir frontend desde el backend (raíz /)

- **WebMvcConfig**: Página de error 404 redirige a `/notFound`; `/notFound` hace `forward:/index.html` para que rutas de la SPA (`/`, `/estadisticas`, etc.) carguen la aplicación.
- **build.gradle**: Tarea `copyFrontend` copia `frontend/dist` a `build/resources/main/static` (solo si existe); `processResources` depende de ella para que el JAR incluya el frontend construido.
- **HealthController**: Eliminado el mapeo de `GET /`; la raíz queda para la SPA. Solo `GET /health` con información de app y docs.
- **SecurityConfig**: Rutas estáticas y SPA permitidas sin auth (`/`, `/index.html`, `/notFound`, `/assets/**`, etc.); solo `/api/**` exige autenticación JWT.
- **api.ts**: URL base por defecto vacía (mismo origen) cuando el backend sirve el frontend; en desarrollo se usa `VITE_API_URL` en `.env` (p. ej. `http://localhost:8080`).

### Configuración para producción

- **application-prod.properties**: Datasource desde variables de entorno (`DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`), JPA con `ddl-auto=validate` y `show-sql=false`. Propiedad `focus.cors.allowed-origins` desde `CORS_ALLOWED_ORIGINS` (vacío = mismo origen). JWT desde `FOCUS_JWT_SECRET` y `FOCUS_JWT_EXPIRATION_MS`. Logging: `root=WARN`, `com.focus=INFO`, Spring web/security en `WARN`.
- **CorsConfig**: Bean `CorsConfigurationSource` que aplica orígenes CORS solo si `focus.cors.allowed-origins` está definido; rutas `/api/**` y `/auth/**`. En dev (`application-dev.properties`) orígenes `http://localhost:5173` y `http://localhost:8080`.
- **application.properties**: Exposición del endpoint de Actuator `health` para dev y prod.

### Monitoreo y health-checks

- **build.gradle**: Dependencia `spring-boot-starter-actuator`.
- **SecurityConfig**: Rutas `/actuator/health` y `/actuator/health/**` ignoradas por la cadena de seguridad y permitidas sin autenticación para health-checks en Easypanel u otros orquestadores.

### Despliegue con Easypanel (Nixpacks)

- **nixpacks.toml**: Proveedores Java y Node. Fase de build: `npm ci` y `npm run build` en `frontend/`, luego `./gradlew copyFrontend bootJar -x test`. Comando de inicio: `java -jar ... -Dspring.profiles.active=prod -Dserver.port=$PORT`. Variable `NIXPACKS_JDK_VERSION=21` para compatibilidad con Nixpacks.

### Documentación final

- **README.md**: Requisitos previos, configuración rápida con dos opciones de frontend (solo dev o todo desde el backend). Tabla de API actualizada: `/` sirve la SPA, `/actuator/health` para monitoreo. Sección **Despliegue en Easypanel** con variables de entorno (`DATABASE_*`, `FOCUS_JWT_SECRET`, `CORS_ALLOWED_ORIGINS`) y health check `GET /actuator/health`. Sección **Mantenimiento y operaciones**: reinicio del servicio, actualización de la app, migraciones de base de datos (validate en prod, opciones para cambios de esquema) y backups de MySQL. Estructura del proyecto con `nixpacks.toml`. Paso 5 del roadmap marcado como completado.

### Resultado

- Proyecto listo para uso académico y despliegue en VPS con Easypanel.
- Backend sirve la SPA en `/`; health-checks vía `/actuator/health`.
- Documentación de despliegue, variables de entorno y mantenimiento en el README.
