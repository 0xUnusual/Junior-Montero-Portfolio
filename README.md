# Premium Cinematic Portfolio // V 2.0

Este es mi portafolio web personal e interactivo de alto rendimiento. Ha sido construido con un enfoque minimalista, futurista y enfocado en la experiencia de usuario (UX/UI), utilizando código puro y animaciones cinematográficas de nivel profesional.

## 🚀 Tecnologías Core
*   **Estructura:** HTML5 Semántico
*   **Estilos:** CSS3 Puro (Vanilla CSS) utilizando variables dinámicas y adaptativas.
*   **Interactividad:** JavaScript ES6+
*   **Motores de Animación:**
    *   [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/) + **ScrollTrigger**: Para la sincronización de la línea de tiempo del scroll horizontal y la entrada fluida de componentes.
    *   [Lenis (by Studio Freight)](https://github.com/darkroomengineering/lenis): Para un desplazamiento (smooth scrolling) inercial ultra suave en sistemas de escritorio.
    *   [Typed.js](https://github.com/mattboldt/typed.js): Para la animación de la terminal autotipada del Hero principal.

---

## 💎 Características Premium

### 1. Preloader de Código Cinematográfico
*   Una terminal de bienvenida interactiva que simula la escritura de código JavaScript línea por línea.
*   **Resaltado de sintaxis real en tiempo real**: Las palabras clave, variables, métodos y strings se renderizan con colores nativos de IDE (estilo Drácula en modo oscuro y estilo Xcode Light en modo claro).
*   **Barra de Carga Dinámica**: Un indicador de porcentaje `[████████░░░░░░] % COMPLETE` corre en paralelo y realiza un boost de carga instantáneo al finalizar el tipado del código para dar paso a la web de forma fluida.

### 2. Modo Claro & Oscuro Adaptativo
*   Un selector de temas flotante e interactivo ubicado en la esquina superior derecha con micro-animaciones SVG (Sol/Luna) dinámicas.
*   **Cero parpadeo (FOUC)**: Inicialización inmediata del tema preferido del usuario basado en su configuración de `localStorage` o preferencias del sistema operativo.
*   Adaptación de todos los componentes en cascada (incluyendo la terminal interactiva, el cursor magnético y los resplandores de silueta).

### 3. Hero con Silueta Flotante y Split-Layout
*   Diseño dividido en dos columnas: tipografía fija a la izquierda y avatar recortado tridimensional a la derecha.
*   **Resplandor de silueta orgánico**: El avatar posee un efecto de brillo (`drop-shadow` de CSS) que bordea exactamente el contorno de la figura transparente (en lugar de una caja cuadrada), reaccionando magnéticamente y rotando con inercia al pasar el cursor.
*   **Tipografía Estable**: Línea tipográfica auto-adaptativa con `clamp()` y reglas de no-envoltura (`nowrap`), manteniendo el lema `"I BUILD"` estático y sólido, mientras que únicamente el objeto de la frase cambia dinámicamente.

### 4. Portafolio de Proyectos Reales Clickables
*   Acceso e integración directa a mis 5 mejores repositorios reales de GitHub:
    *   **ARQ-WEBSITE**: Plataforma interactiva de arquitectura.
    *   **LUCIAAAA-BEAUTY**: Interfaz estética y de belleza.
    *   **OWENS-BURGER**: UX concept de menú gastronómico premium.
    *   **KPININI-BEER**: Maquetación web de cervecería artesanal.
    *   **MR.SANDWICH**: Landing page para bistro gourmet.
*   Tarjetas magnéticas interactivas que redirigen a sus respectivas aplicaciones de producción o repositorios.

### 5. Terminal de Comandos Interactiva (guest@portfolio)
*   Una consola de comandos en la sección de cierre que responde a inputs del usuario:
    *   `help`: Muestra los comandos disponibles.
    *   `about`: Información sobre mi perfil y ubicación.
    *   `skills`: Listado de mis habilidades técnicas.
    *   `projects`: Carga mi base de datos de proyectos seleccionados.
    *   `contact`: Muestra mis redes y correo electrónico real (`juniormontero7@outlook.com`).
    *   `clear`: Limpia la consola.

---

## 🛠️ Estructura del Proyecto
```
Portfolio/
├── index.html          # Estructura e integración de componentes y librerías.
├── style.css           # Hoja de estilos con variables dinámicas y media-queries adaptativas.
├── app.js              # Lógica de preloader, cursor, terminal interactiva y motores de animación.
├── README.md           # Documentación técnica del proyecto.
└── Images/             # Recursos gráficos (avatar y capturas de proyectos).
    ├── mi-avatar.png
    ├── arquitecto (2).png
    ├── luciaaaa.png
    ├── owens.png
    ├── bottle-hero.png
    └── Mr.Sandwich.png
```

---

## 💻 Instalación Local
Para correr y visualizar el portafolio en tu máquina de desarrollo local:
1.  Clona el repositorio:
    ```bash
    git clone https://github.com/0xUnusual/Portfolio.git
    ```
2.  Navega a la carpeta del proyecto.
3.  Abre `index.html` directamente en tu navegador preferido o utiliza una extensión de servidor local como **Live Server** (en VS Code) para experimentar las transiciones óptimas.

---

Creado con pasión y código limpio por [Junior Montero](https://github.com/0xUnusual). ⚡
