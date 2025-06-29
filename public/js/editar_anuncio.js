document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("ID de anuncio no especificado.");
    return;
  }

  const titulo = document.getElementById("titulo");
  const descripcion = document.getElementById("descripcion");
  const precio = document.getElementById("precio");
  const categoria = document.getElementById("categoria");
  const inputImagenes = document.getElementById("imagen");
  const previewActuales = document.getElementById("preview-imagenes-actuales");

  let imagenesActuales = [];
  let nuevasImagenes = [];

  // ✅ Cargar datos actuales del anuncio
  try {
    const res = await fetch(`/anuncios/${id}`);
    const anuncio = await res.json();

    titulo.value = anuncio.titulo;
    descripcion.value = anuncio.descripcion;
    precio.value = anuncio.precio;
    categoria.value = anuncio.categoria_id ?? "";

    imagenesActuales = anuncio.imagenes || [];

    if (previewActuales) {
      previewActuales.innerHTML = "";
      imagenesActuales.forEach(img => {
        const container = document.createElement("div");
        container.style.position = "relative";

        const imagen = document.createElement("img");
        imagen.src = img.path;
        imagen.style.width = "80px";
        imagen.style.height = "80px";
        imagen.style.objectFit = "cover";
        imagen.style.borderRadius = "4px";
        imagen.style.marginRight = "8px";

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
        btnEliminar.style.display = "flex";
        btnEliminar.style.alignItems = "center";
        btnEliminar.style.justifyContent = "center";

        btnEliminar.addEventListener("click", () => {
          previewActuales.removeChild(container);
          imagenesActuales = imagenesActuales.filter(i => i.id !== img.id);
        });

        container.appendChild(imagen);
        container.appendChild(btnEliminar);
        previewActuales.appendChild(container);
      });
    }

  } catch (error) {
    console.error("Error al obtener anuncio:", error);
    alert("Error al obtener los datos del anuncio.");
  }

  // ✅ Mostrar previews para nuevas imágenes seleccionadas
  inputImagenes.addEventListener("change", function () {
    Array.from(this.files).forEach(file => {
      nuevasImagenes.push(file);

      const reader = new FileReader();
      reader.onload = function (e) {
        const container = document.createElement("div");
        container.style.position = "relative";

        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.width = "80px";
        img.style.height = "80px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "4px";
        img.style.marginRight = "8px";

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
        btnEliminar.style.display = "flex";
        btnEliminar.style.alignItems = "center";
        btnEliminar.style.justifyContent = "center";

        btnEliminar.addEventListener("click", () => {
          previewActuales.removeChild(container);
          nuevasImagenes = nuevasImagenes.filter(f => f !== file);
        });

        container.appendChild(img);
        container.appendChild(btnEliminar);
        previewActuales.appendChild(container);
      };
      reader.readAsDataURL(file);
    });

    this.value = ""; // para volver a cargar mismos archivos
  });

  // ✅ Enviar cambios
  document.getElementById("formEditarAnuncio").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("titulo", titulo.value);
      formData.append("descripcion", descripcion.value);
      formData.append("precio", parseFloat(precio.value));
      formData.append("categoria_id", parseInt(categoria.value) || "");
      formData.append("estado_id", 1);

      imagenesActuales.forEach(img => {
        formData.append("imagenes_actuales[]", img.id);
      });

      nuevasImagenes.forEach(file => {
        formData.append("imagenes", file);
      });

      const res = await fetch(`/anuncios/${id}`, {
        method: "PUT",
        body: formData
      });

      if (res.ok) {
        alert("Anuncio actualizado con éxito.");
        window.location.href = "mis_anuncios.html";
      } else {
        alert("Error al actualizar el anuncio.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error en el servidor.");
    }
  });
});
