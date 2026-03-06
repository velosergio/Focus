## Roadmap de implementación – Focus

Aplicación: **Focus – Gestión de tareas con técnica Pomodoro**  
Backend: **Spring Boot + MySQL + Spring Security**  
Frontend: **React + TypeScript + Vite + Tailwind + shadcn/ui**

El roadmap se divide en **5 pasos** grandes, pensados para avanzar de forma incremental.

---

## Arquitectura y patrones de diseño (obligatorios)

La implementación debe respetar estos tres patrones:

- **MVC (Modelo-Vista-Controlador)**
  - **Modelo:** entidades y lógica de datos (`Usuario`, `Tarea`, `SesionPomodoro`) en el backend.
  - **Vista:** interfaz en React + Tailwind + Shadcn UI (listado de tareas, temporizador, estadísticas).
  - **Controlador:** controladores Spring que reciben peticiones, delegan en servicios y devuelven respuestas.

- **Observer**
  - El temporizador/sesión Pomodoro actúa como **sujeto** que notifica eventos (fin de intervalo, inicio de descanso).
  - **Observadores** reaccionan sin que el temporizador los conozca: notificaciones visuales, alertas, actualización de la UI.
  - Permite añadir nuevos tipos de notificación sin modificar la lógica del temporizador.

- **Factory**
  - Creación centralizada de **tipos de sesión Pomodoro**: trabajo, descanso corto, descanso largo.
  - Una clase/factory determina qué tipo de sesión crear según el estado del ciclo.
  - Facilita añadir nuevas variantes de sesión o duraciones sin tocar el resto del flujo.

En cada paso del roadmap se debe verificar que las decisiones de diseño respeten estos patrones.

---

## Paso 1 – Preparar backend base en Spring Boot

- **1.1. Configuración del proyecto**
  - Verificar que el proyecto generado por Spring Initializr compila y arranca (`./gradlew bootRun` o equivalente en Windows).
  - Configurar conexión a **MySQL** en `application.properties`/`application.yml` (URL, usuario, contraseña, `ddl-auto=update` o `validate`).

- **1.2. Modelado del dominio**
  - Definir entidades JPA principales:
    - `Usuario`: id, nombre, email, contraseña hasheada, fechas de creación/actualización.
    - `Tarea`: id, usuario (nullable para modo invitado si lo decides más adelante), título, descripción, prioridad, etiquetas (puede ser tabla relacionada o campo JSON), fecha límite, estimación de pomodoros, pomodoros completados, estado, timestamps.
    - `SesionPomodoro` (opcional al inicio): id, tarea, tipo (trabajo, descanso corto, descanso largo), duración, fecha/hora inicio/fin.
  - Crear `repositories` con Spring Data JPA para cada entidad.

- **1.3. Estructura de capas (alineada con MVC)**
  - Organizar paquetes: `controller`, `service`, `repository`, `model/entity`, `dto`, `security`, `config`.
  - **Modelo:** entidades en `model/entity`; **Controlador:** en `controller`; lógica de negocio en `service`.
  - Definir servicios con interfaces para bajo acoplamiento. Crear DTOs y mappers para separar entidades de la API.

Resultado de este paso: backend arrancando, conectado a MySQL, con entidades básicas y estructura de capas preparada.

---

## Paso 2 – Autenticación y seguridad (Spring Security + JWT)

- **2.1. Configuración de Spring Security**
  - Configurar seguridad sin estado (`sessionCreationPolicy.STATELESS`).
  - Implementar autenticación basada en **JWT**:
    - Filtro de JWT que lea el token del encabezado `Authorization`.
    - `UserDetailsService` para cargar usuarios desde la base de datos.
  - Definir políticas de acceso:
    - Endpoints públicos: `/auth/login`, `/auth/register`, quizá `/health` o `/actuator`.
    - Endpoints protegidos: `/api/tasks/**`, `/api/stats/**`, etc.

- **2.2. Endpoints de autenticación**
  - `POST /auth/register`: crea usuario nuevo, valida email único, hashea contraseña (BCrypt).
  - `POST /auth/login`: valida credenciales y devuelve `accessToken` (JWT) y, opcionalmente, `refreshToken`.
  - `POST /auth/refresh` (opcional): genera nuevo token usando refresh.

- **2.3. Soporte para uso sin sesión**
  - Definir la estrategia para tareas sin usuario autenticado:
    - Opción A: solo frontend con `localStorage` (backend no las ve).
    - Opción B (más adelante): endpoint para importar tareas locales a la cuenta una vez que el usuario se registre.

Resultado de este paso: sistema de **login/registro funcional** con JWT, endpoints protegidos y reglas de acceso claras.

---

## Paso 3 – API REST de tareas, pomodoros y estadísticas

- **3.1. API de tareas**
  - Endpoints bajo `/api/tasks`:
    - `GET /`: lista de tareas del usuario autenticado (con filtros opcionales: estado, etiquetas, prioridad).
    - `POST /`: crear nueva tarea.
    - `GET /{id}`: obtener una tarea.
    - `PUT /{id}`: actualizar campos (título, descripción, prioridad, etiquetas, estimación, fecha límite, estado).
    - `DELETE /{id}`: eliminar tarea.
  - Validar datos de entrada con `Bean Validation` (`@Valid`, `@NotBlank`, etc.).

- **3.2. Integración con sesiones Pomodoro (Factory + Observer)**
  - Usar **Factory** en backend para crear/registrar tipos de sesión (trabajo, descanso corto, descanso largo) según el ciclo.
  - Endpoint para registrar fin de sesión: `POST /api/pomodoros/complete` con `taskId` y tipo de sesión.
  - Incrementar `pomodorosCompletados` de la tarea. (Opcional) Guardar en `SesionPomodoro` para estadísticas.
  - En frontend: temporizador como **sujeto Observer**; notificaciones y actualización de UI como observadores.

- **3.3. API de estadísticas**
  - Endpoints bajo `/api/stats` para la vista `/estadisticas` del frontend:
    - `GET /weekly`: pomodoros por día de la semana actual.
    - `GET /monthly`: pomodoros por día/semana del mes actual.
    - `GET /top-tasks`: tarea(s) con más pomodoros completados.
    - `GET /top-tags`: etiquetas con más pomodoros (ranking).
  - Diseñar respuestas amigables para gráficas: arrays de `{label, value}` o similar.

Resultado de este paso: API REST completa para **tareas**, **registro de pomodoros** y **estadísticas** lista para ser consumida por el frontend.

---

## Paso 4 – Integración del frontend (Lovable) con el backend

- **4.1. Configurar capa de servicios en el frontend**
  - Crear servicios en `services/` (o equivalente):
    - `authService`: `login`, `register`, `logout`, gestión de token (localStorage).
    - `taskService`: `getTasks`, `createTask`, `updateTask`, `deleteTask`, `setTaskCompleted`.
    - `statsService`: `getWeeklyStats`, `getMonthlyStats`, `getTopTasks`, `getTopTags`.
  - Configurar URL base (`VITE_API_URL` en variables de entorno).
  - Asegurar que todas las llamadas añadan el token JWT si el usuario está autenticado.

- **4.2. Conectar vistas principales (Vista del MVC + Observer en temporizador)**
  - Home (`/`):
    - Integrar formulario de tareas con `taskService.createTask` y listado con `taskService.getTasks`.
    - Temporizador: implementar **Observer** (sujeto = estado del Pomodoro; observadores = toasts, actualización de tarea activa). Al completar Pomodoro, llamar al backend.
  - Estadísticas (`/estadisticas`):
    - Conectar gráficas y KPIs a `statsService`.
    - Manejar el fallback a datos locales cuando no hay usuario autenticado.

- **4.3. Flujo de autenticación en la UI**
  - Conectar formularios de Login/Registro a `authService`.
  - Reflejar estado autenticado en el header (nombre del usuario, botón de cerrar sesión).
  - Redirigir o ajustar la UX: por ejemplo, permitir siempre usar la app pero mostrar un banner invitando a guardar el progreso creando una cuenta.

- **4.4. Pruebas básicas y pulido**
  - Probar manualmente los flujos completos: registro → login → crear tareas → usar temporizador → ver estadísticas.
  - Añadir pruebas unitarias mínimas (si el stack del frontend ya las soporta) para:
    - hook del temporizador (`usePomodoroTimer`).
    - lógica de tareas (`useTasks` o equivalente).

Resultado de este paso: frontend y backend integrados, con los flujos principales funcionando de extremo a extremo.

---

## Paso 5 – Preparar despliegue y documentación

- **5.1. Configuración para producción**
  - Configurar `application-prod.properties`/`yml` con:
    - Credenciales de MySQL en el VPS.
    - Orígenes permitidos para CORS (dominio del frontend).
    - Logs adecuados (nivel `INFO` o `WARN` en prod).
  - Generar artefacto **Jar** del backend (`./gradlew bootJar`).
  - Construir el frontend (`npm run build`) en el archivo de nixpacks.

- **5.2. Despliegue con Easypanel en VPS**
  - Crear nixpacks.toml con configuración para usar nixpacks para deploy en easypanel

- **5.3. Monitoreo básico y mantenimiento**
  - Habilitar health-checks (por ejemplo `/actuator/health`).

- **5.4. Documentación final**
  - Completar un `README.md` con:
    - Requisitos previos (Java, Node, MySQL).
    - Pasos para levantar el entorno local (backend + frontend).
    - Ejemplos de llamadas a la API (colección de Postman/Insomnia opcional).
    - Documentar cómo reiniciar servicios, actualizar la app y aplicar migraciones. (README.md)
  - Añadir referencia a este `roadmap.md` como guía de desarrollo.

Resultado de este paso: proyecto **listo para uso académico y desplegado en un VPS** con un flujo de mantenimiento claro.

