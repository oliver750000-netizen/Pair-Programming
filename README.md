# Currency Explorer

## Integrantes
- Estudiante A: Laura Beatriz Ruiz Oros
- Estudiante B: Oliver Vasquez Santiago

## Pair Programming
## Pair Programming
| Misión | Driver | Navigator | Commit / evidencia |
|---------|-------|-------|---|
| Starter | Laura | Oliver | `Starter project: estructura inicial - Laura y Oliver` |
| 04      | Laura | Oliver | `Misión 04: monedas dinámicas desde los selectores - Driver: Laura / Navigator: Oliver` |
| 05      | Oliver | Laura | `Misión 05: conversión completa con formato legible - Driver: Oliver / Navigator: Laura` |
| 06      | Laura | Oliver | `Misión 06: intercambio de monedas y recálculo - Driver: Laura / Navigator: Oliver` |
| 07      | Oliver | Laura | `Misión 07: validación completa de cantidad y monedas - Driver: Oliver / Navigator: Laura` |
| 08      | Laura | Oliver | `Misión 08: estado de carga y botones deshabilitados - Driver: Laura / Navigator: Oliver` |
| 09  | Oliver | Laura | `Misión 09: manejo de errores con response.ok y try/catch - Driver: Oliver / Navigator: Laura` |
| 10    | Laura | Oliver | `Misión 10: diseño responsive, spinner y foco accesible - Driver: Laura / Navigator: Oliver` |
| 11    | Oliver | Laura | `Misión 11: histórico mensual con gráfica SVG - Driver: Oliver / Navigator: Laura` |

## Objetivo
Completar una aplicación frontend que consuma Frankfurter API para convertir divisas y demostrar comprensión de eventos, DOM, `fetch()`, JSON, asincronía, validación y manejo de errores.

## Funcionalidades
- Conversión entre EUR, USD, MXN, GBP y JPY con tipos de cambio reales.
- Selectores dinámicos de moneda origen y destino.
- Botón ⇄ para intercambiar monedas y recalcular.
- Validación de cantidad (vacía, cero, negativa, no numérica) y de monedas iguales.
- Estado de carga con botones deshabilitados y spinner.
- Manejo de errores de red, de HTTP y de datos inválidos.
- Diseño responsive para móvil y escritorio.

## Ejecución
1. Descomprime el proyecto.
2. Abre la carpeta en VS Code.
3. Ejecuta `index.html` con Live Server o un servidor local equivalente.
4. Abre DevTools → Console y Network para observar el comportamiento.

## API
Endpoint de referencia:
`https://api.frankfurter.dev/v2/rate/{origen}/{destino}`

## Decisiones técnicas
1. Validamos el texto con `trim()` antes de convertirlo con `Number()`, porque `Number("")` devuelve 0 y no se distinguiría un campo vacío de un cero real. La validación va antes del `fetch` para no hacer peticiones inútiles.
2. Usamos `finally` para reactivar los botones, de modo que la interfaz nunca queda bloqueada, ya sea que la consulta tenga éxito o falle.

## Revisión cruzada
- Aspecto bien resuelto: Laura revisó la Misión 09 de Oliver y destacó que el `catch` distingue tres casos: sin conexión (`TypeError`), error HTTP (`response.status`) y datos inválidos. Cada caso muestra un mensaje distinto y claro al usuario.
- Error o comportamiento mejorable: Oliver revisó la Misión 08 de Laura y notó que la tasa en el detalle se mostraba con todos los decimales que devuelve la API (por ejemplo `1.1634829`), lo que se ve largo y poco uniforme en pantallas pequeñas.
- Propuesta de mejora: limitar la tasa a 4 decimales con `toFixed(4)` en la línea de `detalleTasa`.
- Cambio incorporado después de la revisión: `detalleTasa.textContent = \`1 ${monedaOrigen} = ${datos.rate.toFixed(4)} ${monedaDestino} · Actualizado: ${datos.date}\`;`

## Reflexión final (150–200 palabras)
Nuestro principal aprendizaje fue comprender que consumir una API tiene pasos separados: `fetch()` devuelve una respuesta HTTP, `response.ok` indica si fue satisfactoria y `response.json()` la convierte en un objeto del que tomamos `datos.rate`. Antes pensábamos que si la petición no fallaba todo estaba bien, pero un error 404 también llega como respuesta exitosa, por eso comprobamos `response.ok` y usamos `try/catch`. La dificultad más relevante fue probar el estado de carga, porque la API responde tan rápido que no se veía "Consultando..." por lo que la prueba que hicimos fue ponerle grandes cantidades para comprobar el cambio.


Alternar los roles nos obligó a explicar cada cambio antes de hacer commit, y así ambos pudimos entender todo el recorrido: clic, `fetch`, JSON, cálculo y actualización del DOM.

Tambien aprendimos a trabajar en un mismo proyecto usando la tecnica Pair-Programming y vimos que era efectivo al trabajo de dos personas (driver/navigator).