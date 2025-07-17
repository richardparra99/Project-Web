function limpiarErrores() {
  const errores = document.querySelectorAll(".error");
  errores.forEach(e => e.textContent = "");

  const inputs = document.querySelectorAll("input, select, textarea");
  inputs.forEach(input => input.classList.remove("error-input"));
}

// ⚡ Nuevo: cargar categorías en el select
document.addEventListener("DOMContentLoaded", async () => {
  const selectCategoria = document.getElementById("categoria");

  try {
    const res = await fetch("/categorias");
    const categorias = await res.json();

    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.nombre;
      selectCategoria.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
});

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
  const categoriaId = document.getElementById("categoria").value;
  const imagenInput = document.getElementById("imagen");

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

  if (!categoriaId) {
    document.getElementById("error-categoria").textContent = "Por favor seleccione una categoría.";
    document.getElementById("categoria").classList.add("error-input");
    hayError = true;
  }

  if (imagenesSeleccionadas.length === 0) {
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
  formData.append("categoria_id", categoriaId);

  imagenesSeleccionadas.forEach(file => {
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
      window.location.href = "lista_anuncio.html";
    } else {
      alert(result.mensaje || "Error al crear el anuncio.");
    }
  } catch (error) {
    console.error(error);
    alert("Error en el servidor.");
  }
});

let imagenesSeleccionadas = [];

document.getElementById("imagen").addEventListener("change", function () {
  const preview = document.getElementById("preview-imagenes");

  Array.from(this.files).forEach(file => {
    imagenesSeleccionadas.push(file);

    const reader = new FileReader();
    reader.onload = function (e) {
      const container = document.createElement("div");
      container.style.display = "inline-block";
      container.style.marginRight = "8px";
      container.style.position = "relative";

      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.width = "80px";
      img.style.height = "80px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "4px";

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "X";
      btnEliminar.style.position = "absolute";
      btnEliminar.style.top = "0";
      btnEliminar.style.right = "0";
      btnEliminar.style.background = "red";
      btnEliminar.style.color = "white";
      btnEliminar.style.border = "none";
      btnEliminar.style.borderRadius = "50%";
      btnEliminar.style.width = "20px";
      btnEliminar.style.height = "20px";
      btnEliminar.style.cursor = "pointer";
      btnEliminar.style.fontSize = "12px";
      btnEliminar.style.lineHeight = "20px";

      btnEliminar.addEventListener("click", () => {
        preview.removeChild(container);
        imagenesSeleccionadas = imagenesSeleccionadas.filter(f => f !== file);
      });

      container.appendChild(img);
      container.appendChild(btnEliminar);
      preview.appendChild(container);
    };
    reader.readAsDataURL(file);
  });

  this.value = "";
});
