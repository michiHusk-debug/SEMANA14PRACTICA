// Validación del formulario de contacto
const reglas = {
  nombre: {
    valido: function (valor) {
      return valor.trim().length >= 3;
    },
    mensaje: "Ingresa tu nombre completo (mínimo 3 caracteres)."
  },
  correo: {
    valido: function (valor) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());
    },
    mensaje: "Ingresa un correo válido, por ejemplo nombre@correo.com."
  },
  telefono: {
    valido: function (valor) {
      return /^9\d{8}$/.test(valor.trim());
    },
    mensaje: "El celular debe tener 9 dígitos y empezar con 9."
  },
  asunto: {
    valido: function (valor) {
      return valor !== "";
    },
    mensaje: "Selecciona un asunto."
  },
  consulta: {
    valido: function (valor) {
      return valor.trim().length >= 10;
    },
    mensaje: "Escribe tu mensaje (mínimo 10 caracteres)."
  }
};

function validarCampo(id) {
  const campo = document.getElementById(id);
  const error = document.getElementById("error-" + id);
  const esValido = reglas[id].valido(campo.value);

  campo.closest(".campo").classList.toggle("invalido", !esValido);
  error.textContent = esValido ? "" : reglas[id].mensaje;
  return esValido;
}

function validarFormulario() {
  let todoValido = true;
  Object.keys(reglas).forEach(function (id) {
    if (!validarCampo(id)) todoValido = false;
  });
  return todoValido;
}

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("form-contacto");
  if (!formulario) return;

  Object.keys(reglas).forEach(function (id) {
    document.getElementById(id).addEventListener("blur", function () {
      validarCampo(id);
    });
  });

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (validarFormulario()) {
      const nombre = document.getElementById("nombre").value.trim();
      mostrarMensaje("exito", "Gracias, " + nombre + ". Hemos recibido tu mensaje.");
      formulario.reset();
    } else {
      mostrarMensaje("fallo", "Revisa los campos marcados en rojo.");
    }
  });
});