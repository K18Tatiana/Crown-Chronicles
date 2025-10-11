# Crown Chronicles - Explorador Interactivo de Juego de Tronos

Una aplicación web que proporciona una interfaz interactiva para explorar el mundo de Juego de Tronos utilizando la fuente de datos "An API of Ice and Fire". Construida con Angular 20.

## Descripción General

Crown Chronicles es una aplicación web integral que permite a los usuarios explorar el rico universo de la serie "A Song of Ice And Fire" de George R.R. Martin. La aplicación proporciona información detallada sobre casas, personajes y libros de la serie, con características interactivas para descubrir relaciones y linajes familiares.

## Características

### Casas
- **Listados Completos de Casas**: Navega por todas las casas nobles de Westeros
- **Información Detallada de Casas**: Ve escudos de armas, lemas, regiones y detalles de fundación
- **Miembros de las Casas**: Explora vasallos y sus relaciones
- **Sistema de Favoritos**: Marca casas como favoritas con almacenamiento persistente
- **Filtro de Favoritos**: Filtra para mostrar solo casas marcadas como favoritas
- **Búsqueda Avanzada**: Encuentra casas por nombre, región o lema
- **Información del Fundador**: Ve detalles del fundador de cada casa

### Personajes
- **Base de Datos de Personajes**: Accede a información detallada de personajes
- **Relaciones Familiares**: Ve información de padre, madre y cónyuge con enlaces directos
- **Detalles de Personajes**: Género, cultura, títulos, lealtades y más
- **Funcionalidad de Búsqueda**: Encuentra personajes por nombre, cultura o títulos
- **Información Familiar Completa**: Nombres de familiares junto con enlaces de "Ver Detalles"

### Libros
- **Colección de Libros**: Información sobre todos los libros de la serie
- **Apariciones de Personajes**: Ve qué personajes aparecen en qué libros
- **Detalles de Publicación**: Autores, fechas de lanzamiento y número de páginas
- **Libros por Personaje**: En la página de detalles de personajes, ve todos los libros donde aparece cada personaje
- **Distinción POV**: Identifica si un personaje es narrador principal (POV) o solo aparece en el libro


### Experiencia de Usuario
- **Modo Oscuro Fijo**: Interfaz en tema oscuro optimizada para la experiencia visual
- **Diseño Responsivo**: Optimizado para escritorio, tablet y móvil
- **Temática de Juego de Tronos**: Estilos personalizados inspirados en la serie
- **Animaciones Suaves**: Transiciones envolventes y efectos de hover
- **Almacenamiento Local**: Favoritos persistentes en el navegador
- **Interfaz en Español**: Toda la interfaz completamente traducida al español

## Stack Tecnológico

- **Framework**: Angular 20 con componentes independientes
- **Estilos**: Tailwind CSS con tema personalizado de Juego de Tronos
- **Gestión de Estado**: Angular Signals para estado reactivo
- **Cliente HTTP**: Cliente HTTP de Angular con caché
- **Enrutamiento**: Router de Angular con carga diferida
- **TypeScript**: Tipado estricto en toda la aplicación
- **Arquitectura**: Arquitectura basada en componentes con separación clara de responsabilidades
- **Diseño y UX**: Interfaz, colores, diseño responsivo y experiencia de usuario desarrollados con asistencia de IA

## Descripción de la Arquitectura

La aplicación sigue una **arquitectura dirigida por dominio** con separación clara de responsabilidades, organizada alrededor del dominio de la **API Ice and Fire**:

### **Organización del Dominio** (`src/app/ice-and-fire/`)
- **Propósito**: Contiene toda la funcionalidad relacionada con el universo de Juego de Tronos
- **Estructura**: Organizada por dominio (relacionado con API)

### **Páginas** (`src/app/ice-and-fire/pages/`)
- **Propósito**: Contienen lógica a nivel de página y orquestan componentes
- **Responsabilidad**: Manejan enrutamiento, obtención de datos y estado específico de página
- **Ejemplos**: `houses`, `house-detail`, `characters`, `character-detail`

### **Componentes** (`src/app/ice-and-fire/components/`)
- **Propósito**: Componentes de UI reutilizables con responsabilidades únicas
- **Responsabilidad**: Manejan interacciones específicas de UI y lógica de visualización
- **Ejemplos**: `house-card`, `character-card`, `search-bar`, `loading-spinner`, `favorite-button`

### **Servicios** (`src/app/ice-and-fire/services/`)
- **Servicios API**: Comunicación con la API Ice and Fire
- **Mapeadores**: Utilidades de transformación de datos
- **Lógica de Negocio**: Operaciones específicas del dominio

### **Interfaces** (`src/app/ice-and-fire/interfaces/`)
- **Definiciones TypeScript**: Tipado fuerte para todas las entidades del dominio
- **Contratos API**: Definiciones de interfaz para respuestas de API externas
- **Modelos de Dominio**: Definiciones de entidades de negocio

### **Beneficios de Esta Arquitectura**
- **Enfoque en el Dominio**: Toda la funcionalidad relacionada está agrupada
- **Reutilización**: Los componentes pueden usarse en múltiples páginas dentro del dominio
- **Mantenibilidad**: Límites de dominio claros hacen el código más fácil de mantener
- **Escalabilidad**: Fácil agregar nuevas características dentro del dominio o crear nuevos dominios
- **Responsabilidad Única**: Cada componente tiene un propósito claro

## Conceptos Técnicos Implementados

### Patrones de Diseño y Arquitectura
- **Observer Pattern**: Implementado a través de Angular Signals y RxJS Observables para manejo reactivo de estado y comunicación entre componentes
- **Repository Pattern**: Servicios que actúan como repositorios para la gestión de datos de la API
- **Mapper Pattern**: Transformación de datos entre capas (API ↔ Dominio ↔ UI) para mantener separación de responsabilidades

### Gestión de Estado y Datos
- **Angular Signals**: Estado reactivo moderno para actualizaciones automáticas de la UI
- **LocalStorage**: Persistencia de favoritos del usuario en el navegador
- **Sistema de Caché**: Cache inteligente con timeout configurable para optimizar peticiones HTTP
- **Paginación**: Sistema de paginación reutilizable con algoritmo inteligente para mostrar páginas relevantes

### Optimización y Performance
- **Lazy Loading**: Carga diferida de componentes para mejorar el rendimiento inicial
- **Caché HTTP**: Reducción de peticiones redundantes a la API
- **Componentes Reutilizables**: Arquitectura modular que permite reutilización de código
- **Computed Properties**: Cálculos automáticos y optimizados basados en signals

### Desarrollo Asistido por IA
- **Diseño de Interfaz**: Colores, tipografía y layout desarrollados con asistencia de IA
- **Responsive Design**: Breakpoints y adaptabilidad móvil optimizados con IA
- **UX/UI Patterns**: Implementación de mejores prácticas de experiencia de usuario
- **Optimización de Componentes**: Refactoring y mejora de código con asistencia de IA

## Estructura del Proyecto

```
src/
├── app/
│   ├── ice-and-fire/              # Funcionalidad específica del dominio
│   │   ├── pages/                 # Componentes de página
│   │   │   ├── houses/            # Páginas de casas
│   │   │   │   ├── houses.ts
│   │   │   │   ├── houses.html
│   │   │   │   └── house-detail/  # Subcarpeta para detalles
│   │   │   │       ├── house-detail.ts
│   │   │   │       └── house-detail.html
│   │   │   ├── characters/        # Páginas de personajes
│   │   │   │   ├── characters.ts
│   │   │   │   ├── characters.html
│   │   │   │   └── character-detail/  # Subcarpeta para detalles
│   │   │   │       ├── character-detail.ts
│   │   │   │       └── character-detail.html
│   │   │   └── books/             # Páginas de libros
│   │   │       ├── books.ts
│   │   │       ├── books.html
│   │   │       └── book-detail/   # Subcarpeta para detalles
│   │   │           ├── book-detail.ts
│   │   │           └── book-detail.html
│   │   ├── components/            # Componentes reutilizables
│   │   │   ├── house-card/        # Componente tarjeta de casa
│   │   │   │   ├── house-card.ts
│   │   │   │   └── house-card.html
│   │   │   ├── character-card/    # Componente tarjeta de personaje
│   │   │   │   ├── character-card.ts
│   │   │   │   └── character-card.html
│   │   │   ├── search-bar/        # Componente barra de búsqueda
│   │   │   │   ├── search-bar.ts
│   │   │   │   └── search-bar.html
│   │   │   ├── loading-spinner/   # Componente spinner de carga
│   │   │   │   ├── loading-spinner.ts
│   │   │   │   └── loading-spinner.html
│   │   │   ├── favorite-button/   # Componente botón favorito
│   │   │   │   ├── favorite-button.ts
│   │   │   │   └── favorite-button.html
│   │   │   └── pagination/        # Componente paginación reutilizable
│   │   │       ├── pagination.ts
│   │   │       └── pagination.html
│   │   ├── services/              # Servicios API y lógica de negocio
│   │   │   ├── house.service.ts
│   │   │   ├── character.service.ts
│   │   │   ├── book.service.ts
│   │   │   └── mapper/            # Transformación de datos
│   │   │       ├── house.mapper.ts
│   │   │       ├── character.mapper.ts
│   │   │       └── book.mapper.ts
│   │   └── interfaces/            # Interfaces TypeScript
│   │       ├── house.interfaces.ts
│   │       ├── character.interfaces.ts
│   │       ├── book.interfaces.ts
│   │       └── api-response.interfaces.ts
│   ├── environments/             # Configuración del entorno
│   ├── app.config.ts             # Configuración de la aplicación
│   ├── app.routes.ts             # Configuración de rutas
│   ├── app.html                  # Plantilla principal de la aplicación
│   └── app.ts                    # Componente principal de la aplicación
└── styles.css                    # Estilos globales
```

## Para comenzar

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm (versión 9 o superior)
- Angular CLI (versión 20 o superior)

### Instalación

1. **Clona el repositorio**
  ```bash
  git clone <url-del-repositorio>
  cd crown-chronicles
  ```

2. **Instala las dependencias**
  ```bash
  npm install
  ```

3. **Inicia el servidor de desarrollo**
  ```bash
  ng serve
  ```

4. **Abre tu navegador**
  Navega a `http://localhost:4200` para ver la aplicación.

### Construir para Producción

```bash
npm run build
```

Los artefactos de construcción se almacenarán en el directorio `dist/`.

## Uso

### Explorando Casas
1. Navega a la sección "Casas" desde la navegación principal
2. Explora la lista de casas nobles
3. Usa la funcionalidad de búsqueda para encontrar casas específicas
4. Haz clic en el botón de corazón para filtrar solo casas favoritas
5. Haz clic en cualquier casa para ver información detallada
6. Usa el ícono de estrella para agregar casas a tus favoritos
7. Usa la paginación para navegar entre múltiples páginas de resultados

### Viendo Personajes
1. Ve a la sección "Personajes"
2. Busca personajes por nombre, cultura o títulos
3. Haz clic en cualquier personaje para ver su información detallada
4. Explora relaciones familiares (padre, madre, cónyuge) con nombres y enlaces directos
5. En la página de detalles, ve todos los libros donde aparece el personaje
6. Usa la paginación para navegar entre múltiples páginas de resultados

### Usando Favoritos
- Haz clic en el ícono de estrella (⭐) en cualquier casa para agregarla a favoritos
- Los favoritos se guardan automáticamente en el almacenamiento local de tu navegador
- Usa el botón de filtro de favoritos para ver solo tus casas favoritas
- Combina el filtro de favoritos con la búsqueda por texto

## Configuración

### Variables de Entorno

La aplicación utiliza archivos de entorno para la configuración:

- `src/environments/environment.ts` - Configuración de desarrollo
- `src/environments/environment.prod.ts` - Configuración de producción

Opciones de configuración clave:
- `apiBaseUrl`: URL base para la API "An API of Ice and Fire"
- `cacheTimeout`: Duración del caché para respuestas de API
- `defaultPageSize`: Número predeterminado de elementos por página
- `companyName`: Nombre de la aplicación

### Configuración de API

La aplicación se conecta a "An API of Ice and Fire" en `https://anapioficeandfire.com`. No se requiere clave de API ya que esta es una API pública.

## Temática

La aplicación cuenta con un tema personalizado inspirado en Juego de Tronos:

- **Colores**: 
  - Rojo Primario (`#8B0000`) - Colores de casas y acentos
  - Dorado (`#DAA520`) - Acentos secundarios y destacados
  - Tema oscuro fijo con escalas de grises personalizadas

- **Tipografía**: 
  - Familia de fuentes Cinzel para encabezados (estética de Juego de Tronos)
  - Fuentes del sistema para texto del cuerpo

- **Componentes**: 
  - Diseños de tarjetas personalizados con efectos hover
  - Botones y elementos de formulario temáticos
  - Transiciones y animaciones suaves
  - Cards de altura uniforme para mejor organización visual
