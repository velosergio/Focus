# Focus

Aplicación web para la gestión de tareas mediante la técnica Pomodoro. Permite organizar actividades, monitorear el progreso y gestionar sesiones de trabajo y descanso para mejorar la productividad personal.

---

## Tecnologías

| Capa      | Stack                                                                 |
|-----------|-----------------------------------------------------------------------|
| **Backend** | Java 25, Spring Boot 4.1, Spring Data JPA, Spring Security, JWT, MySQL |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Shadcn UI, React Query      |
| **Base de datos** | MySQL 8.0                                                           |

---

## Estructura del proyecto

```
Focus/
├── src/                    # Backend (Spring Boot)
│   └── main/java/com/focus/focus/
│       ├── config/         # Configuración (Security, etc.)
│       ├── controller/     # Controladores REST
│       ├── dto/            # DTOs y mappers
│       ├── exception/      # Manejo de excepciones
│       ├── model/entity/   # Entidades JPA
│       ├── repository/     # Repositorios JPA
│       ├── security/       # JWT, UserDetails, filtros
│       └── service/        # Lógica de negocio
├── frontend/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Componentes UI
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── pages/          # Páginas
│   │   └── services/       # Servicios API
│   └── package.json
├── nixpacks.toml           # Build para Easypanel (Nixpacks)
├── roadmap.md              # Plan de implementación en 5 pasos
├── changenotes.md          # Registro de cambios
└── focus.md                # Especificación del proyecto
```

---

## Requisitos previos

- **Java 25** (o 21+)
- **Node.js 18+** y npm
- **MySQL 8.0** (por ejemplo, XAMPP)
- **Gradle** (incluido vía wrapper: `gradlew.bat`)

---

## Configuración rápida

### 1. Base de datos

Crear la base de datos en MySQL:

```sql
CREATE DATABASE focus;
```

### 2. Backend

```powershell
cd c:\xampp\htdocs\Focus
.\gradlew.bat bootRun
```

El backend arranca en **http://localhost:8080**.

Configuración por defecto (XAMPP): `localhost:3306/focus`, usuario `root`, sin contraseña. Editar `src/main/resources/application.properties` si usas otros valores.

### 3. Frontend (dos opciones)

**Opción A – Desarrollo (frontend y backend por separado)**  
En `frontend/`: `npm install` y `npm run dev`. La app se sirve en **http://localhost:5173**. Crear `frontend/.env` con:

```
VITE_API_URL=http://localhost:8080
```

**Opción B – Todo desde el backend (una sola URL)**  
Construir el frontend y arrancar solo el backend; la raíz del backend sirve la SPA:

```powershell
cd frontend && npm run build && cd ..
cd c:\xampp\htdocs\Focus
.\gradlew.bat bootRun
```

Abrir **http://localhost:8080/** para usar la aplicación.

---

## API REST (Backend)

### Rutas públicas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Aplicación web (SPA) |
| GET | `/health` | Estado del servicio (resumen) |
| GET | `/actuator/health` | Health check para monitoreo (Easypanel, etc.) |
| POST | `/auth/register` | Registro de usuario |
| POST | `/auth/login` | Login (devuelve JWT) |

### Rutas protegidas (requieren `Authorization: Bearer <token>`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/auth/me` | Usuario autenticado |
| GET | `/api/tasks` | Lista de tareas (filtros: estado, prioridad, etiquetas) |
| POST | `/api/tasks` | Crear tarea |
| GET | `/api/tasks/{id}` | Obtener tarea |
| PUT | `/api/tasks/{id}` | Actualizar tarea |
| DELETE | `/api/tasks/{id}` | Eliminar tarea |
| POST | `/api/pomodoros/complete` | Registrar fin de sesión Pomodoro |
| GET | `/api/stats/weekly` | Pomodoros por día de la semana |
| GET | `/api/stats/monthly` | Pomodoros por día del mes |
| GET | `/api/stats/top-tasks` | Tareas con más pomodoros |
| GET | `/api/stats/top-tags` | Etiquetas con más pomodoros |

### Ejemplo de registro

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Usuario","email":"user@ejemplo.com","password":"password123"}'
```

### Ejemplo de login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@ejemplo.com","password":"password123"}'
```

### Colección Postman

Importa `postman/Focus-API.postman_collection.json` en Postman para probar todos los endpoints. Ejecuta primero **Login** para que el token se guarde automáticamente en las variables de la colección.

---

## Despliegue en Easypanel (VPS)

El proyecto incluye dos opciones de build en Easypanel:

- **Dockerfile** (recomendado): Usar **Dockerfile** como tipo de build. Construye el frontend y el backend con Java 21 y genera un JAR ejecutable. No depende de la versión de Gradle que soporte Nixpacks.
- **Nixpacks**: `nixpacks.toml` está preparado para Nixpacks; si aparece *Unsupported Gradle version: 9*, usar el Dockerfile en su lugar.

1. Crear un servicio desde el repositorio y elegir **Dockerfile** (o Nixpacks si tu instancia lo soporta).
2. Configurar **variables de entorno** en Easypanel (perfil producción). Plantilla de referencia: [.env.example](.env.example).

   | Variable | Descripción |
   |----------|-------------|
   | `SPRING_PROFILES_ACTIVE` | `prod` |
   | `DATABASE_URL` | `jdbc:mysql://host:3306/focus` (o la URL de tu MySQL) |
   | `DATABASE_USERNAME` | Usuario MySQL |
   | `DATABASE_PASSWORD` | Contraseña MySQL |
   | `FOCUS_JWT_SECRET` | Clave secreta JWT (mín. 256 bits) |
   | `CORS_ALLOWED_ORIGINS` | Opcional: orígenes CORS si el frontend está en otro dominio (vacío = mismo origen) |

3. **Health check**: en Easypanel, configurar la ruta de comprobación como `GET /actuator/health`. El servicio debe responder 200 cuando esté listo.

4. **Base de datos**: crear la base `focus` en MySQL y asegurar que el VPS puede conectarse (puerto 3306, usuario/contraseña correctos). **Primera vez**: añadir la variable `SPRING_JPA_HIBERNATE_DDL_AUTO=update` para que Hibernate cree las tablas; después del primer arranque puedes quitarla o poner `validate`.

---

## Mantenimiento y operaciones

- **Reiniciar el servicio**: desde el panel de Easypanel (o del VPS) reiniciar el contenedor del servicio Focus.
- **Actualizar la aplicación**: hacer pull del código, volver a desplegar en Easypanel (rebuild con Nixpacks). No hace falta tocar MySQL si no cambian las entidades.
- **Migraciones de base de datos**: en producción se usa `spring.jpa.hibernate.ddl-auto=validate` (solo valida el esquema). Para aplicar cambios de esquema:
  - Opción 1: en un entorno de staging con `ddl-auto=update` aplicar los cambios y luego exportar/importar o replicar.
  - Opción 2: ejecutar scripts SQL manualmente sobre la base de datos de producción y después desplegar la nueva versión.
- **Backups**: configurar copias de seguridad periódicas de la base de datos MySQL en el VPS (cron + mysqldump o herramienta del proveedor).

---

## Patrones de diseño

El proyecto aplica:

- **MVC**: Modelo (entidades JPA), Vista (React), Controlador (Spring REST).
- **Observer**: Temporizador Pomodoro como sujeto; notificaciones y UI como observadores.
- **Factory**: Creación centralizada de tipos de sesión Pomodoro (trabajo, descanso corto, descanso largo).

---

## Roadmap

El desarrollo sigue un plan en 5 pasos (ver [roadmap.md](roadmap.md)):

1. **Paso 1** – Backend base (entidades, repositorios, estructura MVC) ✅
2. **Paso 2** – Autenticación JWT (login, registro, rutas protegidas) ✅
3. **Paso 3** – API REST de tareas, pomodoros y estadísticas ✅
4. **Paso 4** – Integración frontend-backend ✅
5. **Paso 5** – Despliegue (Easypanel, VPS) ✅

---

## Documentación adicional

- [focus.md](focus.md) – Especificación y requisitos del proyecto
- [roadmap.md](roadmap.md) – Plan de implementación detallado
- [changenotes.md](changenotes.md) – Registro de cambios por paso

---

## Licencia

Proyecto académico – Focus - Gestión de tareas con técnica Pomodoro.
