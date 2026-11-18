document.addEventListener("DOMContentLoaded", function () {
  actualizarContadorGlobal();
  if (document.body.dataset.pagina === "carrito") {
    cargarVistaCarrito();
    configurarComprobante();
  }
});

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("miTiendaCarrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("miTiendaCarrito", JSON.stringify(carrito));
  actualizarContadorGlobal();
}

function actualizarContadorGlobal() {
  const total = obtenerCarrito().reduce((sum, item) => sum + item.cantidad, 0);
  const contador = document.getElementById("contador");
  if (contador) contador.textContent = total;
}

function agregarAlCarrito(producto) {
  let carrito = obtenerCarrito();
  const index = carrito.findIndex(i => i.id === producto.id);
  if (index > -1) {
    carrito[index].cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito(carrito);
  mostrarMensaje("exito", producto.nombre + " agregado al carrito.");
}

function cargarVistaCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalEl = document.getElementById("monto-total");
  const carrito = obtenerCarrito();
  if (!lista) return;

  lista.innerHTML = "";
  if (carrito.length === 0) {
    lista.innerHTML = '<tr><td colspan="5" style="text-align:center;">Carrito vacío</td></tr>';
    if (totalEl) totalEl.textContent = "S/ 0.00";
    return;
  }

  let totalGeneral = 0;
  carrito.forEach(item => {
    let subtotal = item.precio * item.cantidad;
    totalGeneral += subtotal;
    lista.innerHTML += `
      <tr>
        <td>${item.nombre}</td>
        <td>S/ ${item.precio.toFixed(2)}</td>
        <td>
          <button type="button" class="btn-cant" onclick="cambiarCant(${item.id}, -1)">-</button>
          ${item.cantidad}
          <button type="button" class="btn-cant" onclick="cambiarCant(${item.id}, 1)">+</button>
        </td>
        <td>S/ ${subtotal.toFixed(2)}</td>
        <td><button type="button" class="boton-eliminar" onclick="eliminarItem(${item.id})">X</button></td>
      </tr>`;
  });
  if (totalEl) totalEl.textContent = "S/ " + totalGeneral.toFixed(2);
}

function cambiarCant(id, delta) {
  let carrito = obtenerCarrito();
  const index = carrito.findIndex(i => i.id === id);
  if (index > -1) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
  }
  guardarCarrito(carrito);
  cargarVistaCarrito();
}

function eliminarItem(id) {
  let carrito = obtenerCarrito().filter(i => i.id !== id);
  guardarCarrito(carrito);
  cargarVistaCarrito();
}

function configurarComprobante() {
  const tipoSelect = document.getElementById("tipo-comprobante");
  const inputDoc = document.getElementById("doc-cliente");

  // Configuración inicial por defecto (Boleta: 8 dígitos)
  if (inputDoc) {
    inputDoc.maxLength = 8;
    inputDoc.placeholder = "Ingrese DNI de 8 dígitos";
  }

  tipoSelect.addEventListener("change", function () {
    const esFactura = this.value === "factura";
    document.getElementById("label-doc").textContent = esFactura ? "RUC" : "DNI";
    document.getElementById("label-nombre").textContent = esFactura ? "Razón Social" : "Nombre Completo";
    
    if (inputDoc) {
      inputDoc.value = "";
      inputDoc.maxLength = esFactura ? 11 : 8;
      inputDoc.placeholder = esFactura ? "Ingrese RUC de 11 dígitos" : "Ingrese DNI de 8 dígitos";
    }
  });

  document.getElementById("form-comprobante").addEventListener("submit", function (e) {
    e.preventDefault();
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
      mostrarMensaje("fallo", "El carrito está vacío.");
      return;
    }

    const tipo = tipoSelect.value;
    const doc = inputDoc.value.trim();
    const nombre = document.getElementById("nombre-cliente").value.trim();

    // Restricción estricta de dígitos con salida inmediata (evita congelamientos)
    if (tipo === "boleta" && !/^\d{8}$/.test(doc)) {
      mostrarMensaje("fallo", "El DNI debe tener exactamente 8 dígitos numéricos.");
      return;
    }
    if (tipo === "factura" && !/^\d{11}$/.test(doc)) {
      mostrarMensaje("fallo", "El RUC debe tener exactamente 11 dígitos numéricos.");
      return;
    }

    const tipoTexto = tipo.toUpperCase();
    const total = carrito.reduce((sum, i) => sum + (i.precio * i.cantidad), 0);
    const igv = total * 0.18;

    // Ocultar sección del carrito y mostrar la boleta correctamente
    const seccionCarrito = document.getElementById("seccion-carrito");
    if (seccionCarrito) seccionCarrito.style.display = "none";

    const ticket = document.getElementById("resultado-comprobante");
    if (ticket) {
      ticket.style.display = "block";
      ticket.innerHTML = `
        <h2>📄 ${tipoTexto} ELECTRÓNICA</h2>
        <p><strong>Cliente:</strong> ${nombre}<br><strong>${tipoTexto === 'FACTURA' ? 'RUC' : 'DNI'}:</strong> ${doc}</p>
        <hr>
        <p><strong>Total Pagado:</strong> S/ ${total.toFixed(2)} (Incluye IGV: S/ ${igv.toFixed(2)})</p>
        <hr>
        <p style="text-align:center;">¡Compra realizada con éxito!</p>
        <button class="boton" onclick="localStorage.removeItem('miTiendaCarrito'); window.location.href='catalogo.html';">Nuevo Comprador</button>
      `;
    }
  });
}