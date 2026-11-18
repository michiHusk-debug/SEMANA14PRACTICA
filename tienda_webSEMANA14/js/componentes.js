// Funciones reutilizables: carga de componentes y mensajes al usuario
async function cargarComponente(idContenedor, archivo) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  const base = document.body.dataset.base || "";
  try {
    const respuesta = await fetch(base + "componentes/" + archivo);
    if (!respuesta.ok) {
      throw new Error("No se pudo cargar " + archivo + " (" + respuesta.status + ")");
    }
    const html = await respuesta.text();
    contenedor.innerHTML = html.replaceAll("{{base}}", base);

    // Si acabamos de cargar el encabezado, actualizamos el contador del carrito inmediatamente
    if (archivo === "encabezado.html" && typeof actualizarContadorGlobal === "function") {
      actualizarContadorGlobal();
    }
  } catch (error) {
    console.error(error);
  }
}

function mostrarMensaje(tipo, texto) {
  const caja = document.getElementById("aviso");
  if (!caja) return;
  caja.textContent = texto;
  caja.className = "mensaje " + tipo;
}

function marcarMenuActivo() {
  const actual = document.body.dataset.pagina;
  const enlace = document.querySelector('.menu a[data-pagina="' + actual + '"]');
  if (enlace) enlace.classList.add("activo");
}

document.addEventListener("DOMContentLoaded", async function () {
  await cargarComponente("encabezado", "encabezado.html");
  await cargarComponente("pie", "pie.html");
  marcarMenuActivo();
});