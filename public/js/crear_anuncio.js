document.getElementById("formCrearAnuncio").addEventListener("submit", async function (e) {
  e.preventDefault();

  const usuarioId = localStorage.getItem("usuarioId"); // el que se logueó
  if (!usuarioId) {
    alert("Debes iniciar sesión para crear un anuncio.");
    return;
  }

  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);
  const categoriaNombre = document.getElementById("categoria").value.trim();
  const imagenInput = document.getElementById("imagen");
  const imagenes = Array.from(imagenInput.files).map(file => file.name); // simulación

  try {
    const response = await fetch("/anuncios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        descripcion,
        precio,
        imagenes, // por ahora solo nombres, luego puedes hacer subida real
        usuario_id: parseInt(usuarioId),
        categoria_nombre: categoriaNombre
      })
    });

    const result = await response.json();
    if (response.ok) {
      alert("Anuncio creado correctamente.");
      window.location.href = "index.html";
    } else {
      alert(result.mensaje || "Error al crear el anuncio.");
    }
  } catch (error) {
    console.error(error);
    alert("Error en el servidor.");
  }
});