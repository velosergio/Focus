## Prompt para Lovable – Frontend de Focus

Quiero que generes una aplicación web llamada **Focus**, siguiendo estrictamente estas indicaciones. **No generes backend**; asume que ya existe un backend REST externo.

---

### 1. Contexto general

- **Nombre de la app**: Focus  
- **Propósito**: gestor de tareas con técnica Pomodoro para mejorar la productividad personal.  
- **Tipo de usuarios**: uso genérico (estudiantes, profesionales, freelance, uso personal), sin roles ni vistas especiales por tipo de usuario.  
- **Idioma de la interfaz**: todo el UI en **español neutro**.

---

### 2. Tecnologías y stack de frontend

Diseña un frontend moderno con este stack:

- **Framework**: React.
- **Empaquetador**: Vite (preferible) o Create React App si es más cómodo.
- **Lenguaje**: TypeScript.
- **Estilos**: Tailwind CSS + componentes de **shadcn/ui**.
- **Ruteo**: React Router.
- **Estado global**: React Query o Zustand (elige uno coherente, documenta la elección en el código).
- **Comunicación con backend**: cliente HTTP basado en `fetch` o `axios`, separado en una capa de servicios (por ejemplo `services/api`).

Requisitos:

- Estructura el proyecto en carpetas claras: `pages/`, `components/`, `features/`, `hooks/`, `services/`, `types/`, etc.
- Configura **dark mode por defecto**, con soporte para cambiar a light mode (por ejemplo, con un toggle en el header) reutilizando utilidades de shadcn.
- Aplica buenas prácticas de accesibilidad (labels, roles, foco visible, atajos de teclado donde tenga sentido).

---

### 3. Flujo principal de uso (vista Home)

Crea una página principal (ruta `/`) con este diseño en desktop:

1. **Encabezado fijo superior**  
   - Logotipo o texto “Focus”.  
   - Botones de **Login** y **Registro** (cuando el usuario no está autenticado).  
   - Menú simple de navegación (por ejemplo: “Inicio”, “Estadísticas”).  
   - Toggle de **tema oscuro/claro**.

2. **Contenido principal centrado**, con layout tipo “dashboard” vertical:
   - En la parte superior, un **temporizador Pomodoro grande** ocupando el ancho principal.
   - Debajo del temporizador, un **campo de entrada** para registrar una nueva tarea.
   - Debajo del input, el **listado de tareas** registradas.

---

### 4. Temporizador Pomodoro

Implementa un componente de temporizador Pomodoro visualmente atractivo:

- Intervalos **fijos** por ahora: 25 minutos de trabajo, descansos cortos (5 min) y descansos largos (15 min) tras varios ciclos.  
- Permite los siguientes estados: “Listo”, “En foco”, “Descanso corto”, “Descanso largo”, “Pausado”, “Finalizado”.
- Elementos del UI:
  - Contador grande en formato `MM:SS`.
  - Indicador textual del estado actual (por ejemplo, “Sesión de enfoque”, “Descanso corto”).
  - Botones: **Iniciar**, **Pausar/Reanudar**, **Reiniciar**, **Saltar descanso** (opcional).
  - Barra de progreso o indicador de los ciclos Pomodoro completados.
- Comportamiento:
  - El usuario puede seleccionar una tarea activa y asociar la sesión Pomodoro a esa tarea.
  - Al terminar un Pomodoro, marca un incremento de conteo para la tarea seleccionada.
  - Muestra pequeñas notificaciones visuales dentro de la página (toasts) al iniciar/terminar una sesión.

---

### 5. Modelo y gestión de tareas

Cada **tarea** debe tener, al menos, estos campos en el frontend:

- `id`
- `titulo` (obligatorio)
- `descripcion` (opcional)
- `prioridad` (por ejemplo: baja, media, alta)
- `etiquetas` (lista de strings)
- `fechaLimite` (opcional)
- `estimacionPomodoros` (número estimado)
- `pomodorosCompletados` (número real)
- `estado` (por ejemplo: pendiente, en progreso, completada)
- `creadaEn`, `actualizadaEn`

Interfaz de usuario para tareas:

- Debajo del temporizador, coloca un **formulario compacto** para añadir nueva tarea, con al menos:
  - Input de texto para el **título** (obligatorio).
  - Campos opcionales en un panel desplegable: descripción, prioridad, etiquetas, estimación de pomodoros y fecha límite.
  - Botón principal “Agregar tarea”.
- Lista de tareas:
  - Muestra tarjetas o filas con: título, estado, número de pomodoros completados / estimados, etiquetas y prioridad.
  - Permite acciones: **Editar**, **Completar/Marcar como hecha**, **Eliminar**.
  - Permite seleccionar una tarea como “tarea activa” para el siguiente Pomodoro (resáltenla visualmente).
- Filtros y ordenación:
  - Filtro por estado (todas, pendientes, en progreso, completadas).
  - Filtro por etiquetas.
  - Ordenación por prioridad, fecha límite o más recientes.

Persistencia:

- Si el usuario **no está autenticado**, guarda las tareas y el estado básico del temporizador en `localStorage` para mantener la sesión en el mismo navegador.
- Si el usuario **está autenticado**, sincroniza tareas con el backend via API REST y muestra un indicador de sincronización.

---

### 6. Autenticación (solo UI y llamadas al backend)

Implementa un flujo de autenticación clásico, **solo en el frontend**:

- Vistas o modales para:
  - **Login**: email, contraseña.
  - **Registro**: nombre, email, contraseña, confirmación de contraseña.
- Requisitos:
  - Formularios con validación básica en el frontend (campos obligatorios, formato de email, etc.).
  - Manejo de errores amigables (toasts, textos de ayuda bajo los campos).
  - Guardar el token o sesión en memoria/localStorage de forma segura, y reflejar el estado autenticado en la UI (mostrar nombre, botón de “Cerrar sesión”, etc.).
  - Seguir buenas prácticas de UX: mensajes claros, feedback visual mientras se envía un formulario.

El backend ya existe; solo crea la **capa de servicios** en el frontend (por ejemplo, `authService.login`, `authService.register`, `taskService.getTasks`, etc.) con endpoints configurables, de forma que sea fácil conectar luego con el backend real.

---

### 7. Vista de estadísticas

Crea una ruta `/estadisticas` accesible desde el menú:

- Muestra estadísticas a nivel semanal y mensual:
  - Número total de pomodoros completados por semana y por mes.
  - Tarea con más pomodoros completados.
  - Etiquetas con más pomodoros (ranking).
- UI sugerida:
  - Tarjetas con KPIs (por ejemplo, “Pomodoros esta semana”, “Pomodoros este mes”).
  - Gráficas simples (por ejemplo, barras o líneas) utilizando una librería ligera de charts compatible con React.
  - Tabla o lista de tareas/etiquetas destacadas.

Utiliza datos provenientes del backend si el usuario está autenticado; en caso contrario, usa únicamente los datos locales de las tareas almacenadas en el navegador.

---

### 8. Estilo visual y usabilidad

Sigue el estilo y patrones de **shadcn/ui**:

- Estética **minimalista, moderna y limpia**, con enfoque en legibilidad y poco ruido visual.
- Usa tokens de diseño consistentes (espaciados, tipografías, radios, sombras) y componentes reusables para botones, inputs, tarjetas y modales.
- Asegura que la interfaz se vea bien tanto en desktop como en pantallas pequeñas (diseño responsive básico).
- Usa feedback visual claro en las interacciones: estados hover, focus, loading, disabled.

---

### 9. Requisitos de calidad del código

- Usa **TypeScript estricto** en componentes y servicios.
- Componentes pequeños, reutilizables y bien nombrados.
- Evita lógica compleja en el JSX; extrae hooks personalizados (`usePomodoroTimer`, `useTasks`, etc.) cuando sea necesario.
- Documenta en comentarios breves las decisiones no obvias (por qué se eligió cierto patrón, etc.).
- Añade pruebas básicas (aunque sean mínimas) para el temporizador Pomodoro y la lógica de tareas si el flujo de trabajo de Lovable lo permite.

---

