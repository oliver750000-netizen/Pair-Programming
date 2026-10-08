// ============================================================
// CURRENCY EXPLORER · STARTER PROJECT
// Archivo principal de trabajo para las misiones de JavaScript
// ============================================================

// 1. REFERENCIAS AL DOM
const cantidad = document.querySelector("#cantidad");
const origen = document.querySelector("#origen");
const destino = document.querySelector("#destino");
const btnConvertir = document.querySelector("#convertir");
const btnIntercambiar = document.querySelector("#intercambiar");
const resultado = document.querySelector("#resultado");
const resultadoTexto = document.querySelector("#resultadoTexto");
const detalleTasa = document.querySelector("#detalleTasa");

// 2. EVENTOS
btnConvertir.addEventListener("click", convertirMoneda);
btnIntercambiar.addEventListener("click", intercambiarMonedas);

// 3. FUNCIÓN PRINCIPAL
async function convertirMoneda() {
  const textoCantidad = cantidad.value.trim();
  
  // Misiones guiadas 1-3: ya existe un flujo mínimo funcional EUR -> USD.
  // A partir de la Misión 4 debes convertirlo en una solución dinámica.

  const valor = Number(cantidad.value);
  
  const mensajeError = ValidarEntrada(textoCantidad, valor);
  if (mensajeError) {
    mostrarError(mensajeError);
    return;
  }

  // TODO · MISIÓN 07: sustituir esta validación mínima por una validación completa.
  if (!Number.isFinite(valor) || valor <= 0) {
    mostrarError("Escribe una cantidad mayor que cero.");
    return;
  }

  // TODO · MISIÓN 04: reemplazar EUR y USD por los valores elegidos en los <select>.
  const monedaOrigen = origen.value;
  const monedaDestino = destino.value;

  const url = `https://api.frankfurter.dev/v2/rate/${monedaOrigen}/${monedaDestino}`;

  try {
    // TODO · MISIÓN 08: activar un estado visual de carga antes de consultar.
    const respuesta = await fetch(url);

    // TODO · MISIÓN 09: comprobar response.ok y lanzar un error si corresponde.
    const datos = await respuesta.json();

    const conversion = valor * datos.rate;

    resultado.classList.remove("error");
    resultadoTexto.textContent = `${formatearNumero(valor)} ${monedaOrigen} = ${formatearNumero(conversion)} ${monedaDestino}`;
    detalleTasa.textContent = `1 ${monedaOrigen} = ${datos.rate} ${monedaDestino} · Actualizado: ${datos.date}`;

  } catch (error) {
    // TODO · MISIÓN 09: mejora el mensaje y analiza qué errores pueden llegar aquí.
    mostrarError("No fue posible completar la consulta.");
    console.error(error);
  }
}
// MISIÓN 06: implementar la función intercambiarMonedas() para que invierta los valores de los <select> y vuelva a calcular la conversión.

function intercambiarMonedas() {
  const temporal = origen.value;
  origen.value = destino.value;
  destino.value = temporal;
  convertirMoneda(); 
}

// 4. UTILIDADES DE INTERFAZ
// TODO · MISIÓN 05: implementar formatearNumero() para mostrar el resultado con separadores de miles y dos decimales.
function formatearNumero(numero) {
  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero);
}
function mostrarError(mensaje) {
  resultado.classList.add("error");
  resultadoTexto.textContent = mensaje;
  detalleTasa.textContent = "Revisa los datos e inténtalo nuevamente.";
}
// MISIÓN 07: implementar ValidarEntrada() para comprobar que la cantidad es un número válido y que las monedas son diferentes.
function ValidarEntrada(texto,valor) {
  if (texto === "") return "escribe una cantidad ";
  if (!Number.isFinite(valor)) return "la cantidad no es un número válido";
  if (valor <= 0) return "la cantidad debe ser mayor que cero";
  if (origen.value === destino.value) return "Elige dos monedas diferentes";
  return null;
}
// PISTA PARA EL RETO:
// origen.value        -> moneda seleccionada como origen
// destino.value       -> moneda seleccionada como destino
// cantidad.value      -> texto escrito en el input
// Number(...)         -> convierte texto a número
// response.ok         -> indica si la respuesta HTTP fue satisfactoria
// resultado.textContent -> permite modificar texto del DOM
