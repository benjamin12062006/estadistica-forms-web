# Estadística Forms Web

Fecha de creación: 2026-10-19
Relacionada con: [plan de migración](docs/plans/01-migracion-flutter-a-nuxt.md), [fuentes consultadas](docs/fonts/01-flutter-cursos-y-documentacion.md), [bitácora](bitacora-construccion/01-acceso-y-cuenta-nuxt.md).

Versión web de las pantallas de acceso y cuenta de Flutter. Nuxt 4.6.2, Vue 3.5.44, TypeScript 6.0.3, Tailwind CSS 4.3.3, Descope Vue SDK 3.1.19 y pnpm 12.5.1. TypeScript 6 se fija porque los comprobadores actuales de Vue y ESLint todavía no admiten TypeScript 7.

## Ubicación

```text
KSuT/
├── estadistica-forms-api/    # API Nest existente
└── estadistica-forms-web/    # Esta app Nuxt
```

Flutter permanece en `/Users/benji/Documents/FLUTTER-APP/estadistica_forms/apps/estadistica_forms`. No se modificaron sus archivos para esta implementación. La aplicación web tiene un repositorio Git independiente en [benjamin12062006/estadistica-forms-web](https://github.com/benjamin12062006/estadistica-forms-web). La revisión mencionada en los documentos de migración pertenece al proyecto Flutter de origen.

## Ejecutar

```sh
cd /Users/benji/Documents/KSuT/estadistica-forms-web
pnpm install
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000). pnpm administra Node 24.19.0 para este proyecto mediante `devEngines.runtime`; no hace falta reemplazar el Node global. La primera instalación necesita Internet para descargar dependencias y runtime.

En este equipo ya está preparado el `.env` ignorado con los valores públicos permitidos del proyecto Flutter. En otra máquina:

```sh
cp .env.example .env
```

Completar `NUXT_PUBLIC_DESCOPE_PROJECT_ID`. El Flow por defecto es `sign-up-or-in`; el dominio personalizado de Descope es opcional. Nunca introducir Management Key, claves Turso ni tokens en variables públicas. Reiniciar Nuxt después de cambiar `.env`.

La API existente debe estar activa:

```sh
cd /Users/benji/Documents/KSuT/estadistica-forms-api
pnpm start:dev
```

La URL cliente predeterminada es `http://127.0.0.1:8080/api/v1`. La API ya admite el origen `http://localhost:3000`. Si se cambia el puerto, debe autorizarse el nuevo origen en la API y en Descope. El retorno del Flow es `http://localhost:3000/auth`; también se conservan los parámetros si una configuración anterior devuelve al `/`.

## Organización

```text
app/
├── pages/          # /auth, /session, /account y entrada
├── layouts/        # Marca, texto, gráfico y tarjeta compartidos
├── components/     # Piezas visuales y Flow solo cliente
├── composables/    # useAccess: estado reactivo y acciones
├── plugins/        # Composición de SDK, servicios y controlador
├── middleware/     # Navegación coherente con el estado
├── services/       # Controlador de acceso y HTTP del perfil
├── types/          # AppUser, AccessState y contratos usados
├── utils/          # Validación de configuración y destino por estado
└── assets/css/     # Tailwind, colores y Roboto local
```

Las páginas presentan el estado. `useAccess` comparte únicamente estado serializable de interfaz, nunca tokens. El plugin solo cliente conecta el SDK oficial con el controlador y `$fetch`. La restauración comienza con `onNuxtReady`, cuando termina la hidratación. Nest valida la identidad y devuelve el perfil; el middleware del navegador organiza el recorrido, no sustituye al guard del servidor.

El SDK conserva y renueva los tokens. El perfil se lee mediante `GET /users/me`; un `404` permite aprovisionarlo con `PUT`. Después del login se usa el mismo `PUT` idempotente. Un `401` provoca una renovación y un único reintento; otros errores conservan una acción de recuperación. Cancelar o salir invalida las respuestas anteriores. La salida aborta renovaciones pendientes y permite al SDK limpiar su persistencia aun cuando no se confirme la revocación remota.

## Comprobaciones

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
pnpm preview
```

`preview` sirve la compilación local en el puerto 3000; detener antes `dev` si usa ese puerto. Para producción, ejecutar `.output/server/index.mjs` con un Node compatible e inyectar las variables `NUXT_PUBLIC_*` en el entorno del proceso: el servidor compilado no carga automáticamente `.env`.

La verificación de tipos y compilación se registra en la [bitácora](bitacora-construccion/01-acceso-y-cuenta-nuxt.md). La revisión visual final y el login real quedan a cargo del usuario, que enviará capturas. Recorridos a comprobar: Continuar → Flow → Google/OTP → cuenta, recargar `/account`, cancelar el Flow y cerrar sesión. Un problema de conexión con Nest debe mostrar Reintentar, sin presentar una cuenta simulada.

Esta entrega cubre las pantallas existentes. El editor de formularios y los espacios estadísticos todavía no estaban implementados en Flutter y quedan fuera de esta migración.
