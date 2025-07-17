document.addEventListener("DOMContentLoaded", async () => {
  const contenedorCategorias = document.getElementById("contenedor-categorias");
  const contenedorAnuncios = document.getElementById("contenedor-anuncios");

  try {
    const res = await fetch("/categorias");
    const categorias = await res.json();

    contenedorCategorias.innerHTML = `
      <button class="btn-categoria" onclick="cargarAnunciosTodos()">Todos</button>
      ` + categorias.map(cat => `
      <button class="btn-categoria" onclick="cargarAnuncios(${cat.id})">${cat.nombre}</button>
    `).join("");
  } catch (err) {
    console.error("Error al cargar categorías:", err);
    contenedorCategorias.innerHTML = "<p>Error al cargar categorías.</p>";
  }

  window.cargarAnuncios = async (categoriaId) => {
    contenedorAnuncios.innerHTML = "<p>Cargando anuncios...</p>";
    try {
      const res = await fetch(`/categorias/${categoriaId}/anuncios`);
      const anuncios = await res.json();

      if (!Array.isArray(anuncios) || anuncios.length === 0) {
        contenedorAnuncios.innerHTML = "<p>No hay anuncios para esta categoría.</p>";
        return;
      }

      contenedorAnuncios.innerHTML = anuncios.map(anuncio => {
        const imagen = anuncio.imagenes?.[0]?.path || "img/default.png";
        return `
          <div style="border:1px solid #196eb4; padding:10px; margin:10px;">
            <img src="${imagen}" alt="imagen" style="width:100px; height:100px; object-fit:cover;">
            <h3>${anuncio.titulo}</h3>
            <p>${anuncio.descripcion}</p>
            <p><strong>Precio:</strong> Bs. ${anuncio.precio}</p>
            <p><em>Publicado por:</em> ${anuncio.nombre_completo}</p>
          </div>
        `;
      }).join("");
    } catch (err) {
      console.error("Error al cargar anuncios:", err);
      contenedorAnuncios.innerHTML = "<p>Error al cargar anuncios.</p>";
    }
  }

  // 🔥 Nuevo: cargar todos los anuncios sin filtrar por categoría
  window.cargarAnunciosTodos = async () => {
    contenedorAnuncios.innerHTML = "<p>Cargando todos los anuncios...</p>";
    try {
      const res = await fetch(`/anuncios/listado`);
      const anuncios = await res.json();

      if (!Array.isArray(anuncios) || anuncios.length === 0) {
        contenedorAnuncios.innerHTML = "<p>No hay anuncios disponibles.</p>";
        return;
      }

      contenedorAnuncios.innerHTML = anuncios.map(anuncio => {
        const imagen = anuncio.imagenes?.[0]?.path || "img/default.png";
        return `
          <div style="border:1px solid #196eb4; padding:10px; margin:10px;">
            <img src="${imagen}" alt="imagen" style="width:100px; height:100px; object-fit:cover;">
            <h3>${anuncio.titulo}</h3>
            <p>${anuncio.descripcion}</p>
            <p><strong>Precio:</strong> Bs. ${anuncio.precio}</p>
            <p><em>Publicado por:</em> ${anuncio.nombre_completo}</p>
          </div>
        `;
      }).join("");
    } catch (err) {
      console.error("Error al cargar anuncios:", err);
      contenedorAnuncios.innerHTML = "<p>Error al cargar anuncios.</p>";
    }
  }
});
