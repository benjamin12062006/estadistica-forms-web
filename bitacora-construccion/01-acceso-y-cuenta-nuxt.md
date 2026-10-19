# 01 — Acceso y cuenta web con Nuxt

Fecha de creación: 2026-10-19
Estado: Implementado, pendiente de verificación visual y login real; comprobaciones de código aprobadas
Ámbito: `KSuT/estadistica-forms-web`
Relacionada con: [plan](../docs/plans/01-migracion-flutter-a-nuxt.md), [fuentes](../docs/fonts/01-flutter-cursos-y-documentacion.md).
Revisión de partida: `fcc13f320f462b4648bf07e15984156818d4f1a4`, árbol con cambios Flutter previos conservados.

## Necesidad y decisiones propuestas

El usuario solicita la versión web profesional de las pantallas Dart en Nuxt/TypeScript/pnpm, con Tailwind. El [plan](../docs/plans/01-migracion-flutter-a-nuxt.md) detalla el inventario, la adaptación del estado de acceso, el contrato de perfil y las comprobaciones previstas. La [ficha](../docs/fonts/01-flutter-cursos-y-documentacion.md) separa evidencia original, reconstrucción y diseño propio.

## Comprobación

| Comprobación ejecutada                        | Resultado                                                                            |
| --------------------------------------------- | ------------------------------------------------------------------------------------ |
| `pnpm install` y `pnpm install --offline`     | Dependencias y Node local preparados; instalación offline posterior correcta         |
| `pnpm peers check`                            | Sin conflictos peer                                                                  |
| `pnpm lint`                                   | Aprobado sin errores ni advertencias en la revisión final                            |
| `pnpm typecheck`                              | Aprobado con TypeScript 6.0.3                                                        |
| `pnpm build`                                  | Cliente y servidor compilados; Nitro node-server, 2.33 MB totales, 587 kB gzip       |
| `pnpm format:check`                           | Formato revisado con Prettier                                                        |
| HTTP `GET /api/v1/users/me`, sin credenciales | API local responde 401; no se modificaron datos                                      |
| HTTP `GET /auth`                              | Nuxt local responde 200                                                              |
| Validación documental                         | Todos los enlaces locales existen; secuencias 01 por carpeta y fecha 2026-10-19      |
| Helper de reconstrucción `verify`             | Una guía y dos originales/contexto comprobados; instalación nueva sin sobrescrituras |

No se ha realizado un login real ni una revocación real con la cuenta del usuario. Tampoco se declara validado visualmente el último ajuste de hidratación: el usuario asume esa revisión y enviará capturas. No se añadieron suites de tests nuevas ni se publicaron despliegues.

## Evidencia, adaptación y funcionamiento

- [F1](../docs/fonts/01-flutter-cursos-y-documentacion.md#f1--proyecto-flutter-y-api): se conserva el contrato GET/PUT del perfil, los estados del acceso, errores recuperables, campos nulos y la invalidación por generaciones. [access-controller.ts](../app/services/access-controller.ts) implementa el recorrido; [profile.ts](../app/services/profile.ts) valida la respuesta y renueva una sola vez ante 401.
- [F2a/R1](../docs/fonts/01-flutter-cursos-y-documentacion.md#f2a--r1--layouts), guía de la lección 29, fase 1: [app.vue](../app/app.vue) conecta NuxtLayout con NuxtPage; [default.vue](../app/layouts/default.vue) contiene el marco compartido. La adaptación Tailwind procede de las capturas y colores Dart, no del diseño del curso.
- [F2b/F2c](../docs/fonts/01-flutter-cursos-y-documentacion.md#f2b--composable-y-petición-http): [useAccess](../app/composables/useAccess.ts) expone estado/acciones y [access.global.ts](../app/middleware/access.global.ts) devuelve la navegación correspondiente. No se copió el login por contraseña ni los roles del ejemplo.
- [F3](../docs/fonts/01-flutter-cursos-y-documentacion.md#f3--documentación-oficial): [access.client.ts](../app/plugins/access.client.ts) compone el SDK y los servicios. Los tokens permanecen dentro de Descope, fuera de useState y del HTML SSR. [DescopeFlow](../app/components/DescopeFlow.client.vue) presenta el Flow administrado con timeout de carga, cancelación y callbacks por intento.
- Propuesta propia: iniciar restauración con `onNuxtReady` y omitir redirecciones durante hidratación para evitar diferencias entre el HTML inicial y el cliente. Se contrastó `node_modules/nuxt/dist/app/composables/ready.js`, versión 4.6.2: espera `app:suspense:resolve`. `app:mounted` por sí solo podía adelantarse a páginas asíncronas.
- Propuesta propia: adaptador transparente `DescopeElement` porque el SDK Vue distribuido resuelve `descope-wc` como componente Vue. Reenvía atributos y eventos al elemento nativo sin modificar el Flow ni ocultar avisos globalmente.
- Propuesta propia: timeout del transporte, abortar refresh pendiente al salir y devolver 503 al SDK si el transporte de logout falla, permitiendo su cleanup antes de mostrar el aviso de revocación remota sin confirmar.

## Alcance y continuidad

Por indicación del usuario se movió el trabajo desde la ubicación inicial dentro de Flutter a `/Users/benji/Documents/KSuT/estadistica-forms-web`, paralelo a la API. Se actualizaron nombre del paquete, documentación y dependencias desde la nueva raíz. No se tocaron el código Dart, backend, credenciales del servidor ni configuración remota de Descope.

Se creó R1 con el helper de reconstrucción: draft, render, lectura humana, verify e install. La guía vive junto al original y declara las inferencias de etiquetas que se perdieron en la transcripción; no equivale a ejecutar el proyecto del instructor.

La primera instalación detectó TypeScript 7 incompatible con vue-tsc/ESLint y Node global 24.2 fuera del rango de Nuxt. Se corrigió fijando TypeScript 6.0.3 y Node 24.19 por proyecto. Las dependencias quedan fijadas y `pnpm peers check` no reporta conflictos. Tailwind integra Roboto local, sin petición a Google Fonts.

Antes de que el usuario asumiera la revisión se observó bienvenida y carga del Flow real; aparecieron problemas de hidratación y del resolvedor de componentes que motivaron los ajustes descritos. El usuario pidió detener toda comprobación de navegador y enviará capturas. No se volvió a abrir, controlar ni inspeccionar el navegador después de esa instrucción; no se declara validada visualmente la revisión final.
