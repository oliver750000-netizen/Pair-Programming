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
    estadoCarga(true);    
    const respuesta = await fetch(url);

    if(!respuesta.ok) {
      const err= new Error(`Error HTTP ${respuesta.status}`);
      throw err;
    }

    // TODO · MISIÓN 09: comprobar response.ok y lanzar un error si corresponde.
    const datos = await respuesta.json();
    if(!Number.isFinite(datos.rate)) {
      throw new Error("La API no devolvio una tasa valida");
    }

    const conversion = valor * datos.rate;

    resultado.classList.remove("error");
    resultadoTexto.textContent = `${formatearNumero(valor)} ${monedaOrigen} = ${formatearNumero(conversion)} ${monedaDestino}`;
    detalleTasa.textContent = `1 ${monedaOrigen} = ${datos.rate} ${monedaDestino} · Actualizado: ${datos.date}`;

  } catch (error) {
    
    // TODO · MISIÓN 09: mejora el mensaje y analiza qué errores pueden llegar aquí.
    console.error(error);
    if(error instanceof TypeError) {
      mostrarError("Sin conexion: revisa tu red e intentalo de nuevo.");
    }else if (error.status=== 404 || error.status === 422) {
      mostrarError("La API  no renoconoce ese par de monedas.");
    }else if(error.status=== 500) {
      mostrarError("El servicion no esta disponible. Intenta mas tarde.");
    }else {
    mostrarError("No fue posible completar la consulta.");
    console.error(error);
    } 
  }finally {                             
    estadoCarga(false);
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

function estadoCarga(cargando) {
  btnConvertir.disabled = cargando;
  btnIntercambiar.disabled = cargando;
  btnConvertir.textContent = cargando ? "Consultando..." : "Convertir";

  if (cargando) {
    resultado.classList.remove("error");
    resultadoTexto.textContent = "Consultando...";
    detalleTasa.textContent = "Esperando respuesta de la API.";
  }
}


// MISIÓN 07: implementar ValidarEntrada() para comprobar que la cantidad es un número válido y que las monedas son diferentes.
function ValidarEntrada(texto,valor) {
  if (texto === "") return "escribe una cantidad ";
  if (!Number.isFinite(valor)) return "la cantidad no es un número válido";
  if (valor <= 0) return "la cantidad debe ser mayor que cero";
  if (origen.value === destino.value) return "Elige dos monedas diferentes";
  return null;
}


// 5. HISTÓRICO (Misión 11)
const btnHistorico = document.querySelector("#historico");
const grafica = document.querySelector("#grafica");
btnHistorico.addEventListener("click", cargarHistorico);

async function cargarHistorico() {
  const url = `https://api.frankfurter.dev/v2/rates?base=${origen.value}&quotes=${destino.value}&from=2026-01-01&group=month`;

  try {
    btnHistorico.disabled = true;
    btnHistorico.textContent = "Cargando histórico…";

    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    const datos = await respuesta.json();
    console.log(datos); // verificar la estructura aquí

    if (!Array.isArray(datos) || datos.length === 0) {
      throw new Error("La API no devolvió datos históricos.");
    }

    const fechas = datos.map(item => item.date);
    const tasas = datos.map(item => item.rate);

    dibujarGrafica(fechas, tasas);

  } catch (error) {
    console.error(error);
    grafica.textContent = "No se pudo cargar el histórico.";
  } finally {
    btnHistorico.disabled = false;
    btnHistorico.textContent = "Ver histórico (desde enero)";
  }
}

function dibujarGrafica(fechas, tasas) {
  const W = 600, H = 260, P = 40;
  const min = Math.min(...tasas);
  const max = Math.max(...tasas);
  const rango = max - min || 1;

  const x = i => P + (i * (W - 2 * P)) / Math.max(tasas.length - 1, 1);
  const y = t => H - P - ((t - min) / rango) * (H - 2 * P);

  const puntos = tasas.map((t, i) => `${x(i)},${y(t)}`).join(" ");

  const marcas = tasas.map((t, i) => `
    <circle cx="${x(i)}" cy="${y(t)}" r="4" fill="#16758b"/>
    <text x="${x(i)}" y="${H - 12}" font-size="10" text-anchor="middle">
      ${fechas[i].slice(0, 7)}
    </text>
  `).join("");

  grafica.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;margin-top:16px;background:#f8fafc;border-radius:12px">
      <polyline points="${puntos}" fill="none" stroke="#16758b" stroke-width="2"/>
      ${marcas}
      <text x="${P}" y="16" font-size="11" fill="#334155">
        ${origen.value}→${destino.value}: ${min.toFixed(4)} – ${max.toFixed(4)}
      </text>
    </svg>`;
}