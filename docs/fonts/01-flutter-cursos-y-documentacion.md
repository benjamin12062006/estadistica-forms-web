# 01 — Fuentes de la migración web

Fecha de creación: 2026-10-19
Tipo de fuente: código propio, transcripciones locales, reconstrucción derivada y documentación oficial.
Fecha de consulta: 2026-10-19, America/New_York.
Relacionada con: [plan](../plans/01-migracion-flutter-a-nuxt.md), [bitácora](../../bitacora-construccion/01-acceso-y-cuenta-nuxt.md).

## F1 — Proyecto Flutter y API

Raíz Flutter: `/Users/benji/Documents/FLUTTER-APP/estadistica_forms`. Revisión de referencia `fcc13f320f462b4648bf07e15984156818d4f1a4`; se inspeccionó el árbol con modificaciones locales posteriores. La nueva aplicación web está fuera de ese repositorio, junto a la API, por indicación posterior del usuario.

- [AccessController](/Users/benji/Documents/FLUTTER-APP/estadistica_forms/apps/estadistica_forms/lib/features/auth/presentation/providers/auth_provider.dart), símbolos `restoreSession`, `_prepare`, `completeSignIn`, `cancelSignIn`, `signOut`: restauración única, generación de intentos, lectura del perfil y aprovisionamiento tras 404. **Adaptación:** controlador TypeScript por instancia Nuxt y estados discriminados, sin Riverpod.
- [AccessState](/Users/benji/Documents/FLUTTER-APP/estadistica_forms/apps/estadistica_forms/lib/features/auth/presentation/providers/access_state.dart): checking, signed out, authenticating, preparing, ready, signing out y error recuperable. **Adaptación:** unión `AccessState` y rutas `/auth`, `/session`, `/account`.
- [ProfileDatasourceImpl](/Users/benji/Documents/FLUTTER-APP/estadistica_forms/apps/estadistica_forms/lib/features/auth/infrastructure/datasources/profile_datasource_impl.dart), `_request`: Bearer, timeout, reintento después de renovar ante 401; 404 significa perfil ausente. [UserMapper](/Users/benji/Documents/FLUTTER-APP/estadistica_forms/apps/estadistica_forms/lib/features/auth/infrastructure/mappers/user_mapper.dart): campos nulos y fechas del perfil.
- [AuthScreen](/Users/benji/Documents/FLUTTER-APP/estadistica_forms/apps/estadistica_forms/lib/features/auth/presentation/screens/auth_screen.dart), [SessionScreen](/Users/benji/Documents/FLUTTER-APP/estadistica_forms/apps/estadistica_forms/lib/features/auth/presentation/screens/session_screen.dart), [AccountScreen](/Users/benji/Documents/FLUTTER-APP/estadistica_forms/apps/estadistica_forms/lib/features/auth/presentation/screens/account_screen.dart): textos, jerarquía, cancelación y salida. [AppColors](/Users/benji/Documents/FLUTTER-APP/estadistica_forms/apps/estadistica_forms/lib/config/theme/app_colors.dart): colores originales. Las capturas adjuntas aportan la distribución de escritorio que ya fue retirada del árbol Dart actual.
- [UsersController](../../../estadistica-forms-api/src/users/users.controller.ts), `getCurrentUser`/`provisionCurrentUser`: `GET/PUT /api/v1/users/me`, envoltorio `{ user }`, identidad impuesta por guard. [UsersRepository](../../../estadistica-forms-api/src/users/users.repository.ts), `provision`: UPSERT por emisor y sujeto. [bootstrap](../../../estadistica-forms-api/src/main.ts): CORS admite localhost/127.0.0.1:3000. **Límite:** inspección de código no demuestra una sesión real aceptada por el servidor.

## F2 — Cursos locales

Biblioteca: `/Users/benji/Documents/chrome-extencions/trancripciones`. Se ejecutó el buscador de la skill para Nuxt/composables/middleware y Vue/Composition API/TypeScript. Se listaron originales por sección, excluyendo `00.*` y guías generadas. No se eligieron los resultados de mapas, productos, bases de datos o contraseñas por no resolver las pantallas actuales.

### F2a / R1 — Layouts

Original: [29. Nuxt Layout - Plantillas](/Users/benji/Documents/chrome-extencions/trancripciones/Nuxt/Nuxt%20Full%20Stack/Sección%203%20Nuxt%20-%20Primeros%20pasos/29.%20Nuxt%20Layout%20-%20Plantillas.md).

Curso en metadatos: «Server API, Middleware, Layouts, Caché, NuxtUI, Tailwind, Script Setup, Auth, Sesiones, SSR, SSG, SPA, Despliegues y más». Carpeta: `Nuxt/Nuxt Full Stack/Sección 3 Nuxt - Primeros pasos`. Instructor: la transcripción lo llama Fernando; no contiene apellido verificable. Localizadores: líneas 13–31, frases `NuxtLayout`, `definePageMeta()` y `los hijos que vengan acorde a la ruta`.

**Evidencia:** la navegación compartida pertenece al layout; la plantilla inserta los hijos y una página puede elegir otra plantilla. **R1:** [guía reconstruida de la lección 29](/Users/benji/Documents/chrome-extencions/trancripciones/Nuxt/Nuxt%20Full%20Stack/Sección%203%20Nuxt%20-%20Primeros%20pasos/29.%20Nuxt%20Layout%20-%20Plantillas%20-%20Reconstrucción%20guiada.md), fases 1–2 y `app/app.vue`, `app/layouts/default.vue`. Generada con `reconstruction.py draft/render`, leída y contrastada, `verify` correcto e instalada junto al original. Contexto mínimo: [28. Navegación entre rutas - NuxtLink](/Users/benji/Documents/chrome-extencions/trancripciones/Nuxt/Nuxt%20Full%20Stack/Sección%203%20Nuxt%20-%20Primeros%20pasos/28.%20Navegación%20entre%20rutas%20-%20NuxtLink.md), leída completa. La guía declara etiquetas perdidas, contenedores inferidos y el CSS adjunto ausente.

**Adaptación:** [app.vue](../../app/app.vue) conecta NuxtLayout y NuxtPage; [default.vue](../../app/layouts/default.vue) comparte marca, gráfico y tarjeta mediante slot. El curso no enseña el diseño de Estadística ni sus medidas Tailwind; esas son adaptación de las capturas.

### F2b — Composable y petición HTTP

Original: [85. useAuthentication - Composable personalizado](/Users/benji/Documents/chrome-extencions/trancripciones/Nuxt/Nuxt%20Full%20Stack/Sección%207%20Autenticación%20y%20autorización/85.%20useAuthentication%20-%20Composable%20personalizado.md), mismo curso, sección 7. Leída completa; líneas 17–25, frase `Nunca usen el "useFetch()" dentro de métodos`.

**Evidencia:** devolver estado reactivo y acciones desde un composable; usar `$fetch` para la petición disparada por una acción. **Interpretación:** evitar instanciar hooks de carga dentro del callback de login. **Adaptación:** [useAccess](../../app/composables/useAccess.ts) y [createProfileService](../../app/services/profile.ts). El curso emplea `useUserSession` y login propio; aquí Descope conserva identidad y tokens, Nest valida el acceso. No se atribuye esa integración al curso ni se reconstruye un login por contraseña ajeno al proyecto.

### F2c — Middleware de ruta

Original: [88. Route Middlewares](/Users/benji/Documents/chrome-extencions/trancripciones/Nuxt/Nuxt%20Full%20Stack/Sección%207%20Autenticación%20y%20autorización/88.%20Route%20Middlewares.md), misma sección. Leída completa. Líneas 13–23 y 27–37: diferencia entre middleware de navegación y servidor, sufijo `.global`, devolver `navigateTo`, evitar bucles.

**Adaptación:** [access.global.ts](../../app/middleware/access.global.ts) dirige las tres pantallas según estado; el guard de Nest sigue siendo el límite de autorización. No se copian roles de administrador del ejemplo. El middleware cliente no protege una API por sí mismo.

### F2d — Vue y Script Setup

Original: [13. Consideraciones del Script Setup](/Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue%203%20con%20TypeScript%20y%20Quasar/Sección%202%20Vue.js%20+%20Composition%20API%20+%20TypeScript%20-%20Primeros%20Pasos/13.%20Consideraciones%20del%20Script%20Setup.md). Curso en metadatos: «Vue 3, Pinia, Vite, TypeScript, Composition API, Script Setup, Vue-Query, Quasar, Caché y más». Instructor no identificado en el archivo. Sección 2, leída completa. Líneas 23–25: macros de props/emisiones y extracción a composables cuando el componente crece.

**Interpretación y adaptación:** componentes SFC con `script setup lang="ts"`, props tipadas y lógica de red/estado fuera del template. El umbral de veinte líneas mencionado por el instructor se toma como sugerencia, no regla del proyecto. No hace falta reconstruir el contador para usar este principio conceptual.

## F3 — Documentación oficial

Consulta: 2026-10-19. La herramienta web devolvió contenido no soportado en algunas páginas de Nuxt; se descargaron y leyeron directamente por HTTPS desde el sitio oficial, sin recurrir a resúmenes de terceros.

- [Nuxt, plugins](https://nuxt.com/docs/4.x/directory-structure/app/plugins), secciones Registered Plugins y `.client`: plugin solo cliente. [Runtime Config](https://nuxt.com/docs/4.x/guide/going-further/runtime-config), Exposing y Environment Variables: `runtimeConfig.public` se expone al navegador, variables `NUXT_PUBLIC_*`. **Aplicación:** solo configuración pública en [nuxt.config.ts](../../nuxt.config.ts); JWT fuera del estado SSR.
- [Releases Nuxt](https://github.com/nuxt/nuxt/releases), contrastadas con `pnpm view nuxt version`: versión instalada 4.6.2. Vue 3.5.44 y SDK 3.1.19 confirmados con npm. TypeScript 7 actual resultó incompatible con vue-tsc/ESLint; se eligió 6.0.3 según el rango peer observado (`<6.1.0`). La versión resuelta queda fijada en manifest y lockfile.
- [Tailwind, instalación en Nuxt](https://tailwindcss.com/docs/installation/framework-guides/nuxt), pasos 2–5: plugin `@tailwindcss/vite`, import CSS global. **Aplicación:** Tailwind 4.3.3 con tokens en [main.css](../../app/assets/css/main.css); clases para medidas, responsive, foco y movimiento reducido.
- [Descope Vue SDK, README oficial](https://github.com/descope/descope-js/tree/main/packages/sdks/vue-sdk), Add Descope plugin, render specific flow, session token server validation, token persistence. Contraste con código/tipos instalados 3.1.19 y `@descope/web-js-sdk` 1.54.4: `getSdk`, `refresh`, `getSessionToken`, `logout`, `onIsAuthenticatedChange`. **Aplicación:** [access.client.ts](../../app/plugins/access.client.ts), [DescopeFlow](../../app/components/DescopeFlow.client.vue). El SDK gestiona persistencia y renovación; no se implementa almacenamiento manual de tokens ni lectura manual de JWT.
- Código distribuido de Descope, source map `withPersistTokens/index.ts`, `logoutWrapper`: limpia tokens después de que logout devuelve respuesta. **Propuesta propia:** el transporte convierte el error de red del endpoint de logout en una respuesta fallida 503 para permitir que termine el cleanup del SDK; se muestra aviso si no se confirma revocación remota. No equivale a confirmar el cierre remoto de una cookie HttpOnly si el proveedor no estuvo accesible.
- [pnpm, devEngines.runtime](https://pnpm.io/package_json#devenginesruntime): instalación local y scripts con runtime fijado. **Aplicación:** Node 24.19.0 por proyecto para satisfacer el rango de Nuxt y evitar cambiar el Node global del usuario.

## Relación compacta de decisiones

| Necesidad                            | Original / pasaje                       | Reconstrucción                        | Interpretación                     | Alternativa                      | Decisión                             |
| ------------------------------------ | --------------------------------------- | ------------------------------------- | ---------------------------------- | -------------------------------- | ------------------------------------ |
| Pantallas comparten marca y tarjeta  | F2a, líneas 13–31                       | R1, fase 1, NuxtLayout/slot           | Plantilla común                    | Duplicar layout por página       | Layout Nuxt + componentes Tailwind   |
| Acción de perfil con token           | F1 `_request`, F2b líneas 21–25, F3 SDK | No necesaria para proveedor diferente | HTTP fuera del template            | Login propio del curso           | Descope + `$fetch` a Nest            |
| Reanudar/cancelar sin estado antiguo | F1 `AccessController`                   | No aplica a Dart existente            | Generación invalida respuestas     | Flags sueltos por página         | Controlador TypeScript por instancia |
| URLs consistentes                    | F2c líneas 27–37                        | No se copia la política de roles      | Devolver redirección; evitar bucle | Guard de administrador del curso | Middleware según estado + guard API  |
| Componente comprensible              | F2d líneas 23–25                        | Conceptual                            | Extraer lógica aplicada            | Red dentro de SFC                | SFC + composable + servicios         |
