// Catálogo: genera las tarjetas desde una lista de productos
const productos = [
  { id: 1, nombre: "Mochila urbana", precio: 89.9 },
  { id: 2, nombre: "Audífonos inalámbricos", precio: 129.5 },
  { id: 3, nombre: "Botella térmica", precio: 45 },
  { id: 4, nombre: "Libreta ejecutiva", precio: 18.9 },
  { id: 5, nombre: "Teclado compacto", precio: 99 },
  { id: 6, nombre: "Lámpara de escritorio", precio: 59.9 }
];

let totalCarrito = 0;

function crearTarjetaProducto(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta";
  tarjeta.innerHTML =
    "<h2>" + producto.nombre + "</h2>" +
    '<p class="precio">S/ ' + producto.precio.toFixed(2) + "</p>";

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "boton";
  boton.textContent = "Agregar";
  boton.addEventListener("click", function () {
    agregarAlCarrito(producto);
  });

  tarjeta.appendChild(boton);
  return tarjeta;
}

function agregarAlCarrito(producto) {
  totalCarrito++;
  const contador = document.getElementById("contador");
  if (contador) contador.textContent = totalCarrito;
  mostrarMensaje("exito", producto.nombre + " se agregó al carrito.");
}

document.addEventListener("DOMContentLoaded", function () {
  const lista = document.getElementById("lista-productos");
  if (!lista) return;

  productos.forEach(function (producto) {
    lista.appendChild(crearTarjetaProducto(producto));
  });
});