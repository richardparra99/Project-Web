function limpiarErrores() {
  const errores = document.querySelectorAll(".error");
  errores.forEach(e => e.textContent = "");

  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => input.classList.remove("error-input"));
}

document.getElementById("formCrearAnuncio").addEventListener("submit", async function (e) {
  e.preventDefault();
  limpiarErrores();

  let hayError = false;

  const usuarioId = localStorage.getItem("usuarioId");
  if (!usuarioId) {
    alert("Debes iniciar sesión para crear un anuncio.");
    return;
  }

  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);
  const categoriaNombre = document.getElementById("categoria").value.trim();
  const imagenInput = document.getElementById("imagen");
  const archivos = Array.from(imagenInput.files);

  // Validaciones visuales
  if (!titulo) {
    document.getElementById("error-titulo").textContent = "Por favor ingrese el título.";
    document.getElementById("titulo").classList.add("error-input");
    hayError = true;
  }

  if (!descripcion) {
    document.getElementById("error-descripcion").textContent = "Por favor ingrese la descripción.";
    document.getElementById("descripcion").classList.add("error-input");
    hayError = true;
  }

  if (isNaN(precio) || precio <= 0) {
    document.getElementById("error-precio").textContent = "El precio debe ser un número mayor a 0.";
    document.getElementById("precio").classList.add("error-input");
    hayError = true;
  }

  if (!categoriaNombre) {
    document.getElementById("error-categoria").textContent = "Por favor ingrese la categoría.";
    document.getElementById("categoria").classList.add("error-input");
    hayError = true;
  }

  if (archivos.length === 0) {
    document.getElementById("error-imagen").textContent = "Debe subir al menos una imagen.";
    document.getElementById("imagen").classList.add("error-input");
    hayError = true;
  }

  if (hayError) return;

  // Crear el FormData y agregar campos
  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("descripcion", descripcion);
  formData.append("precio", precio);
  formData.append("usuario_id", usuarioId);
  formData.append("categoria_nombre", categoriaNombre);

  Array.from(imagenInput.files).forEach(file => {
    formData.append("imagenes", file);
  });

  try {
    const response = await fetch("/anuncios", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert("Anuncio creado correctamente.");
      localStorage.setItem("nuevoAnuncioId", result.id);
      window.location.href = "lista_anuncio.html";
    } else {
      alert(result.mensaje || "Error al crear el anuncio.");
    }
  } catch (error) {
    console.error(error);
    alert("Error en el servidor.");
  }
});
