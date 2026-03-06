# Focus

Aplicación web para la gestión de tareas mediante la técnica Pomodoro. Permite organizar actividades, monitorear el progreso y gestionar sesiones de trabajo y descanso para mejorar la productividad personal.

---

## Tecnologías

| Capa      | Stack                                                                 |
|-----------|-----------------------------------------------------------------------|
| **Backend** | Java 25, Spring Boot 4.1, Spring Data JPA, Spring Security, JWT, MySQL |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, React Query      |
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

### 3. Frontend

```powershell
cd frontend
npm install
npm run dev
```

El frontend se sirve en **http://localhost:5173** (o el puerto que indique Vite).

Configurar la URL del API en `frontend/.env` o `frontend/.env.local`:

```
VITE_API_URL=http://localhost:8080
```

---

## API REST (Backend)

### Rutas públicas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Información básica de la API |
| GET | `/health` | Estado del servicio |
| POST | `/auth/register` | Registro de usuario |
| POST | `/auth/login` | Login (devuelve JWT) |

### Rutas protegidas (requieren `Authorization: Bearer <token>`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/auth/me` | Usuario autenticado |

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
3. **Paso 3** – API REST de tareas, pomodoros y estadísticas
4. **Paso 4** – Integración frontend-backend
5. **Paso 5** – Despliegue (Easypanel, VPS)

---

## Documentación adicional

- [focus.md](focus.md) – Especificación y requisitos del proyecto
- [roadmap.md](roadmap.md) – Plan de implementación detallado
- [changenotes.md](changenotes.md) – Registro de cambios por paso

---

## Licencia

Proyecto académico – Focus - Gestión de tareas con técnica Pomodoro.
