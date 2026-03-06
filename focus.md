# Focus  
Aplicación web para la gestión de tareas mediante la técnica Pomodoro

## Descripción general
**Focus** es una aplicación web diseñada para ayudar a los usuarios a organizar sus tareas y administrar su tiempo mediante la técnica Pomodoro. El sistema permite registrar actividades, monitorear su progreso y gestionar sesiones de trabajo y descanso para mejorar la productividad personal. 

## Tecnologías utilizadas
- **Backend:** Java con framework Spring  
- **Frontend:** React  
- **Estilos:** Tailwind CSS y Shadcn UI  
- **Base de datos:** MySQL  

Estas tecnologías permiten construir una aplicación web moderna, modular y escalable.

## Objetivo del proyecto
Desarrollar una aplicación web que permita gestionar y hacer seguimiento de tareas utilizando la técnica Pomodoro, con el fin de mejorar la organización del tiempo y la productividad de los usuarios.

## Objetivos específicos
- Diseñar una interfaz clara e intuitiva para la gestión de tareas.
- Implementar la lógica del sistema utilizando Java y Spring.
- Integrar un temporizador Pomodoro con notificaciones de trabajo y descanso.

## Fundamentos conceptuales
El proyecto se fundamenta en principios de **Programación Orientada a Objetos (POO)**, tales como:
- **Cohesión:** cada clase cumple una función específica.
- **Bajo acoplamiento:** reducción de dependencias entre componentes.
- **Reutilización de código:** uso de interfaces y clases abstractas.

Estos principios facilitan la mantenibilidad y escalabilidad del sistema.

## Metodología de desarrollo
Se utiliza una **metodología ágil**, organizada en fases:

1. **Análisis y planificación**
   - Identificación de requerimientos.
   - Definición de funcionalidades principales.

2. **Diseño del sistema**
   - Definición de arquitectura.
   - Modelado de datos.
   - Diseño de interfaz.

3. **Desarrollo**
   - Implementación del backend y frontend.
   - Integración de módulos del sistema.

4. **Pruebas**
   - Validación del funcionamiento del sistema.
   - Corrección de errores.

5. **Despliegue y documentación**
   - Preparación para entorno web.
   - Documentación técnica.

## Funcionalidades principales

### Gestión de tareas
El sistema permite:
- Crear tareas
- Editar tareas
- Actualizar tareas
- Eliminar tareas
- Visualizar el estado de cada actividad

### Temporizador Pomodoro
- Intervalos de trabajo de aproximadamente **25 minutos**.
- Pausas cortas entre sesiones.
- Descansos prolongados tras varios ciclos.

### Sistema de notificaciones
- Alertas visuales y sonoras.
- Aviso de finalización de sesiones de trabajo.
- Aviso de inicio de descansos.

### Interfaz de usuario
- Interfaz clara e intuitiva.
- Visualización organizada de tareas.
- Seguimiento del progreso del trabajo.

## Requerimientos funcionales
- Gestión completa de tareas.
- Visualización del estado de las actividades.
- Temporizador Pomodoro.
- Pausas automáticas.
- Notificaciones y alertas.
- Interfaz gráfica de usuario intuitiva.

## Requerimientos no funcionales
- **Usabilidad:** interfaz fácil de usar.
- **Rendimiento:** respuesta rápida del sistema.
- **Seguridad:** manejo confiable de la información.
- **Compatibilidad:** funcionamiento en navegadores modernos.
- **Mantenibilidad:** arquitectura modular.
- **Escalabilidad:** capacidad de añadir nuevas funcionalidades.

## Arquitectura conceptual
El sistema se estructura en componentes principales:

- **Usuario**
  - Interactúa con la aplicación.
  - Gestiona sus tareas.

- **Tarea**
  - Representa cada actividad registrada.
  - Contiene título, descripción, estado y fecha.

- **Sesión Pomodoro**
  - Controla los intervalos de trabajo y descanso.

- **Sistema de notificaciones**
  - Informa eventos relevantes del temporizador.

## Patrones de diseño aplicados

La implementación debe seguir tres patrones que estructuran el sistema, reducen el acoplamiento y facilitan la evolución:

- **MVC (Modelo-Vista-Controlador)**
  - **Modelo:** clases que gestionan la información (`Usuario`, `Tarea`, `SesionPomodoro`) con sus atributos y comportamientos.
  - **Vista:** interfaz en React, Tailwind y Shadcn UI (tareas, temporizador, estado de actividades).
  - **Controlador:** controladores Spring que reciben peticiones, procesan la lógica y coordinan modelo y vista.
  - Separa responsabilidades y favorece mantenimiento y escalabilidad.

- **Observer**
  - Comunicación por eventos: el temporizador/sesión Pomodoro es el **sujeto** que notifica (fin de intervalo, inicio de descanso).
  - **Observadores** reaccionan sin que el temporizador los conozca: notificaciones visuales, alertas sonoras, actualización de la UI.
  - Permite añadir nuevas notificaciones o funcionalidades sin modificar la lógica del temporizador.

- **Factory**
  - Creación centralizada de objetos: distintos tipos de sesión Pomodoro (trabajo, descanso corto, descanso largo).
  - Una clase/factory determina qué tipo de sesión crear según el estado del ciclo.
  - Facilita incorporar nuevas variantes de sesión o configuraciones de tiempo sin cambiar el resto de la aplicación.

## Resultados esperados
- Mejor organización del tiempo.
- Mayor productividad personal.
- Aplicación funcional basada en buenas prácticas de desarrollo de software.

## Conclusión
Focus propone una solución tecnológica para la gestión del tiempo mediante la técnica Pomodoro. El proyecto integra principios de programación orientada a objetos y tecnologías web modernas para construir una aplicación escalable, mantenible y orientada a mejorar la productividad de los usuarios.

## Preguntas para definir mejor el proyecto

1. ¿Qué tipo de usuarios objetivo tendrá la aplicación (estudiantes, profesionales, freelance, uso personal genérico) y habrá algún flujo o vista específica para cada tipo?
- Uso Generico, sin preferencias ni vistas personalizadas

2. ¿Cómo imaginas el flujo principal de uso? Por ejemplo: ¿primero crear tareas, luego seleccionar una tarea activa y desde ahí iniciar el Pomodoro, o prefieres otro flujo?
- el index debe tener el temporizador en grande en la parte superior, debajo un campo de input de texto para registrar nueva tarea, debajo el listado de tareas registradas

3. ¿Qué campos exactos debe tener una tarea (título, descripción, prioridad, etiquetas, fecha límite, estimación de pomodoros, estado, etc.) y cuáles serían obligatorios?
- Me gustan esas sugerencias, obligatorio Titulo

4. ¿Quieres manejar autenticación de usuarios (registro/login, perfiles) o por ahora la aplicación será de uso local/sin cuentas?
- Debe tener un sistema de Auth, (Login, Register) y debe guardar la info de las tareas en la cuenta, pero puede usarse sin iniciar sesion

5. ¿Deseas estadísticas e informes (por ejemplo, número de pomodoros por día/semana, tiempo total concentrado por proyecto/tarea) y en qué nivel de detalle?
- Registros por semana / Mes, tarea con más pomodoros, etiquetas con mas pomodoros

6. ¿Cómo deberían funcionar las notificaciones en web? ¿Solo dentro de la pestaña, también como notificaciones del navegador, o integraciones adicionales (sonidos personalizados, escritorio, móvil más adelante)?
- Más adelante resolvemos esto

7. En cuanto al temporizador Pomodoro, ¿quieres que los intervalos sean fijos (25/5/15 minutos) o configurables por usuario? Si son configurables, ¿qué límites o reglas te gustaría?
- de momento fijos 25 minutos

8. A nivel de interfaz, ¿tienes alguna referencia visual o estilo deseado (por ejemplo, minimalista, dark mode por defecto, similar a otras apps que te gusten)?
- Shadcn, ese estilo me gusta

9. ¿Hay algún requisito técnico especial para el backend en Spring (estructura de capas, uso de JPA/Hibernate, seguridad con Spring Security, API REST pura, etc.) que debamos respetar?
- No se

10. ¿Qué tan importante es que la aplicación esté lista para producción (despliegue en hosting real, SSL, dominios, backups) versus que sea principalmente un proyecto académico/demostrativo?
- Prioridad a proyecto academico, pero quiero desplegar con easypanel, en un vps

---

## Configuración de Spring Initializr

Usa [Spring Initializr](https://start.spring.io/) con la siguiente configuración para el backend de **Focus**, según las tecnologías del documento (Java, Spring, MySQL) y las funcionalidades (auth, tareas, API REST).

### Opciones principales

| Sección | Valor | Motivo |
|--------|--------|--------|
| **Project** | Gradle - Groovy | Coherente con tu captura; también vale Maven si lo prefieres. |
| **Language** | Java | Indicado en el documento. |
| **Spring Boot** | **3.5.x** (ej. 3.5.11) o 3.4.x | Versión estable; 4.0.x es muy reciente. Para académico + VPS, 3.5 o 3.4 es más seguro. |
| **Packaging** | Jar | Adecuado para desplegar en Easypanel/VPS (contenedor). |
| **Java** | **21** (recomendado) o 17 | LTS; mejor compatibilidad con librerías y entornos. Java 25 puede dar problemas en algunos hosts. |
| **Configuration** | Properties o YAML | Cualquiera; Properties es suficiente. |

### Project Metadata

| Campo | Valor sugerido |
|-------|-----------------|
| **Group** | `com.focus` |
| **Artifact** | `focus` |
| **Name** | `focus` |
| **Description** | `Focus - Gestión de tareas con técnica Pomodoro` |
| **Package name** | `com.focus` (se genera solo) |

### Dependencias a añadir (botón "Add Dependencies")

1. **Spring Web** — API REST para el frontend React.
2. **Spring Data JPA** — Persistencia de tareas (y usuarios) en MySQL.
3. **MySQL Driver** — Conexión a la base de datos.
4. **Spring Security** — Login y registro; proteger endpoints y asociar tareas al usuario.

Con esto tendrás un proyecto listo para: API REST, JPA + MySQL, autenticación y empaquetado en Jar para Easypanel.