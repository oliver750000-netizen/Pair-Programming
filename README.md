# Currency Explorer

## Integrantes
- Estudiante A: Laura Beatriz Ruiz Oros
- Estudiante B: Oliver Vasquez Santiago

## Pair Programming
| Misión | Driver | Navigator | Commit / evidencia |
|---|---|---|---|
| 04 | Laura | Oliver | `hash` |
| 05 | Oliver | Laura | `hash` |
| 06 | Laura | Oliver | `hash` |
| 07 | Oliver | Laura | `hash` |
| 08 | Laura | Oliver | `hash` |
| 09 | Oliver | Laura | `hash` |
| 10 | Laura | Oliver | `hash` |

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