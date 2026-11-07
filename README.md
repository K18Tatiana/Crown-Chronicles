# Crown Chronicles

Angular app to explore Game of Thrones books, houses and characters using a public API.

Aplicación web en Angular para explorar el universo de *Canción de Hielo y Fuego*: casas, personajes y libros, con datos de [An API of Ice and Fire](https://anapioficeandfire.com).

![Casas](docs/screenshots/01-houses.png)

## Contenido

- [Contexto del proyecto](#contexto-del-proyecto)
- [Características](#características)
- [Capturas](#capturas)
- [Inicio rápido](#inicio-rápido)
- [Scripts disponibles](#scripts-disponibles)
- [Limitaciones conocidas](#limitaciones-conocidas)
- [Arquitectura](#arquitectura)
- [Configuración](#configuración)
- [Estructura del repositorio](#estructura-del-repositorio)

## Contexto del proyecto

Proyecto académico de la especialización en Desarrollo de Software II. Es una aplicación de una sola página (SPA) que solo consume una API pública; no tiene backend propio ni base de datos.

## Características

- **Casas**: listado con lema, región, número de miembros y escudo de armas; detalle con fundador, títulos y vasallos (miembros de la casa).
- **Personajes**: listado con búsqueda por nombre, cultura o título; detalle con alias, cultura, estado, títulos, relaciones familiares y libros donde aparece.
- **Libros**: listado con búsqueda por título, autor o ISBN; detalle con estadísticas y los personajes del libro.
- **Favoritos** solo en las casas: se marcan con la estrella, se filtran con el botón "Todas las Casas" y se guardan en el `localStorage` del navegador.
- Paginación en los listados de casas y personajes, y en los personajes de cada libro.
- Caché en memoria de las respuestas de la API (5 minutos en desarrollo, 10 en producción).

## Capturas

| Casas | Detalle de una casa |
|---|---|
| ![Casas](docs/screenshots/01-houses.png) | ![Detalle de casa](docs/screenshots/02-house-detail.png) |

| Personajes | Detalle de un personaje |
|---|---|
| ![Personajes](docs/screenshots/03-characters.png) | ![Detalle de personaje](docs/screenshots/04-character-detail.png) |

| Libros | Detalle de un libro |
|---|---|
| ![Libros](docs/screenshots/05-books.png) | ![Detalle de libro](docs/screenshots/06-book-detail.png) |

## Inicio rápido

Requisitos: [Node.js](https://nodejs.org/) compatible con Angular 20 (v20.19+ o v22.12+) y conexión a internet, porque los datos vienen de la API pública.

```bash
git clone https://github.com/K18Tatiana/Crown-Chronicles.git
cd Crown-Chronicles
npm install
npm start
```

Después abre **http://localhost:4200**.

> La página de **Personajes** descarga todos los personajes de la API en peticiones de 12 en 12, así que puede tardar unos segundos en mostrar las tarjetas. La búsqueda y la paginación se hacen en el navegador, sobre los datos ya descargados.

## Limitaciones conocidas

- **Las pruebas actuales fallan.** El proyecto solo tiene `src/app/app.spec.ts`, generado por la plantilla de Angular: sus 2 pruebas fallan (falta el proveedor de `ActivatedRoute` y esperan un `<h1>` "Hello, CrownChronicles" que la aplicación no tiene). No hay pruebas de servicios ni de componentes, ni integración continua.
- Dependen de la disponibilidad de la API pública: si no responde, los listados quedan vacíos.
- Los datos de la API están incompletos en muchos casos (por ejemplo, varias casas sin lema o con 0 miembros, y personajes sin relaciones familiares); la interfaz muestra "Sin lema", "Desconocido" o un mensaje de que no hay datos.
- Los nombres de casas y personajes, y los datos de la API, están en inglés; la interfaz está en español.
- `d3` figura como dependencia, pero el código actual no lo utiliza.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Servidor de desarrollo con recarga (`ng serve`) en el puerto 4200 |
| `npm run build` | Compila la aplicación a `dist/` |
| `npm run watch` | Compilación continua en modo desarrollo |
| `npm test` | Pruebas con Karma y Jasmine (requiere Chrome). Actualmente fallan, ver [Limitaciones conocidas](#limitaciones-conocidas) |

## Arquitectura

```
┌──────────────────────────────┐   HTTP    ┌──────────────────────────┐
│   Angular 20 (SPA, :4200)    │ ────────► │  An API of Ice and Fire  │
│ Páginas → Servicios → Mappers│           │ anapioficeandfire.com    │
└──────────────┬───────────────┘           └──────────────────────────┘
               │
        localStorage (favoritos)
```

| Capa | Descripción |
|---|---|
| `pages/` | Componentes de página (listados y detalles), cargados de forma diferida por ruta |
| `components/` | Componentes reutilizables: tarjetas, búsqueda, paginación, favoritos y spinner |
| `services/` | Acceso a la API con `HttpClient`, señales de Angular y caché en memoria |
| `services/mapper/` | Transforman las respuestas de la API en los modelos de la aplicación |
| `interfaces/` | Tipos de personajes, casas, libros y respuestas |

| Tecnología | Uso |
|---|---|
| Angular 20 | Framework, enrutamiento y `HttpClient` |
| Tailwind CSS 4 | Estilos |
| RxJS | Peticiones y composición de flujos |
| Karma + Jasmine | Pruebas unitarias |

Las rutas usan *hash* (`/#/houses`, `/#/characters`, `/#/books`) y cada listado tiene su detalle en `/:id`.

## Configuración

La URL de la API y los valores por defecto están en [`src/environments/environment.ts`](src/environments/environment.ts):

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `apiBaseUrl` | `https://anapioficeandfire.com` | URL base de la API |
| `cacheTimeout` | `300000` | Duración de la caché en milisegundos (5 min). En `environment.prod.ts` es `600000` (10 min) |
| `defaultPageSize` | `12` | Elementos por página |

## Estructura del repositorio

```
CrownChronicles/
├── docs/screenshots/        # Capturas usadas en este README
├── public/                  # Recursos estáticos
└── src/
    ├── environments/        # Configuración de desarrollo y producción
    └── app/
        ├── app.routes.ts    # Rutas de la aplicación
        └── ice-and-fire/
            ├── pages/       # houses, characters y books (listado y detalle)
            ├── components/  # book-card, character-card, house-card, search-bar...
            ├── services/    # book, character y house (+ mappers)
            └── interfaces/  # Modelos y tipos
```
