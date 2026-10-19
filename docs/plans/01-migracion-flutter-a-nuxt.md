# 01 — Migrar acceso y cuenta de Flutter a Nuxt

Fecha de creación: 2026-10-19
Estado: Implementado; verificación técnica completada y revisión visual a cargo del usuario
Ámbito: `KSuT/estadistica-forms-web`
Relacionada con: [fuentes](../fonts/01-flutter-cursos-y-documentacion.md), [implementación](../../bitacora-construccion/01-acceso-y-cuenta-nuxt.md), [decisión móvil](/Users/benji/Documents/FLUTTER-APP/estadistica_forms/docs/plans/03-app-solo-movil.md).
Revisión de partida: `fcc13f320f462b4648bf07e15984156818d4f1a4`, con cambios locales previos en Flutter que se conservan.

## Objetivo y alcance

Crear una aplicación web Nuxt, Vue y TypeScript con pnpm y Tailwind CSS. Migrar las pantallas existentes: bienvenida, Flow Descope, recuperación/preparación de sesión, error recuperable y cuenta con cierre de sesión. Las cuatro capturas del usuario fijan la referencia visual de escritorio. La versión móvil tendrá una columna y scroll natural.

## Inspección previa

Flutter usa `AccessController`, estados sellados y un contador de generación para invalidar respuestas tras cancelar/salir. Descope conserva y renueva la sesión; Nest valida el Bearer y devuelve un perfil local mediante `GET/PUT /api/v1/users/me`. `AppUser` admite correo y nombre nulos. El diseño usa `#163C32` y `#F6F4ED`. Solo existen pantallas de auth/cuenta, no un editor de formularios. [F1](../fonts/01-flutter-cursos-y-documentacion.md#f1--proyecto-flutter-y-api)

## Decisiones

- Nuxt estable actual confirmado en npm: 4.6.2; Vue 3.5.44; SDK Vue Descope 3.1.19. Fijar las versiones resueltas y conservar lockfile. [F3](../fonts/01-flutter-cursos-y-documentacion.md#f3--documentación-oficial)
- Seguir las convenciones Nuxt: `app/pages`, `layouts`, `components`, `composables`, `plugins`, `middleware`, `types` y `services`. No trasladar capas Dart sin una necesidad equivalente. El layout contiene la marca y el espacio compartido; las páginas contienen cada recorrido. [F2/R1](../fonts/01-flutter-cursos-y-documentacion.md#f2--cursos-locales)
- Tailwind mediante plugin Vite y tokens CSS; sin biblioteca visual adicional. [F3](../fonts/01-flutter-cursos-y-documentacion.md#f3--documentación-oficial)
- Plugin Descope únicamente cliente. Estado y perfil por instancia Nuxt; ningún JWT dentro de `useState` ni HTML SSR. El backend conserva la validación efectiva. HTTP mediante `$fetch` en acciones, con timeout, validación de respuesta y un refresh/reintento ante 401. [F1/F2/F3](../fonts/01-flutter-cursos-y-documentacion.md)
- Retorno OAuth a `/auth`, recuperación automática del Flow al volver del proveedor, cancelación y rechazo de callbacks antiguos. No crear un login con credenciales propias ni simular una cuenta activa.
- Reutilizar la configuración pública local existente por lista permitida; nunca leer/copiar el `.env` del backend. `.env` web ignorado; `.env.example` sin identificadores personales.

## Incrementos y comprobación

1. Preparar proyecto y documentación; reconstruir la lección de layouts por el helper oficial de la skill. Comprobar procedencia del Markdown y dependencias.
2. Implementar estructura, layout responsive y pantallas según capturas con Tailwind. Comprobar tipos y compilación.
3. Integrar SDK, restauración, perfil, errores, navegación y logout; comprobar recorridos de interfaz y API disponible sin realizar login en nombre del usuario.
4. Ejecutar formato, lint, typecheck y build. Documentar resultados y separar la prueba con cuenta real pendiente.

## Criterio de entrega

App instalable y ejecutable con `pnpm dev`, sin cambios en Dart ni backend; documentación de ejecución, fuentes y comprobaciones. Google/OTP/Magic Link requieren que el origen y retorno estén admitidos en Descope y que el usuario complete el login. No se despliega ni se modifica la configuración remota del proveedor.

## Ajustes durante la implementación

El usuario indicó que el proyecto debía ubicarse junto a la API: raíz definitiva `/Users/benji/Documents/KSuT/estadistica-forms-web`. Se completó la implementación desde allí. TypeScript se fijó en 6.0.3 por compatibilidad de herramientas; pnpm administra Node 24.19.0 localmente. El usuario asumió la comprobación visual final y enviará capturas; el agente continúa únicamente con verificaciones de código y documentación. Resultados en la [bitácora](../../bitacora-construccion/01-acceso-y-cuenta-nuxt.md).
