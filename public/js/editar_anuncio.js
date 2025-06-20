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

  // Obtener datos del anuncio actual
  try {
    const res = await fetch(`/anuncios/${id}`);
    const anuncio = await res.json();

    titulo.value = anuncio.titulo;
    descripcion.value = anuncio.descripcion;
    precio.value = anuncio.precio;
    categoria.value = anuncio.categoria_id ?? "";
  } catch (error) {
    console.error("Error al obtener anuncio:", error);
    alert("Error al obtener los datos del anuncio.");
  }

  // Enviar cambios al backend
  document.getElementById("formEditarAnuncio").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/anuncios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: titulo.value,
          descripcion: descripcion.value,
          precio: parseFloat(precio.value),
          categoria_id: parseInt(categoria.value) || null,
          estado_id: 1, // opcional: mantener como 'Publicado'
          imagenes: [], // opcional, si no se edita
        }),
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
