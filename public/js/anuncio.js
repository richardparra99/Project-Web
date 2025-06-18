export async function mostrarAnunciosPublicos() {
  const contenedor = document.getElementById("contenedor-destacados");
  const seccion = document.getElementById("anuncios-publicos");

  contenedor.innerHTML = "";
  seccion.style.display = "block";

  try {
    const res = await fetch('/anuncios/destacados');
    const anuncios = await res.json();

    if (anuncios.length === 0) {
      contenedor.innerHTML = "<p>No hay anuncios disponibles por ahora.</p>";
      return;
    }

    anuncios.forEach(anuncio => {
      const card = document.createElement("article");
      card.className = "section_anuncio_articulo";

      card.innerHTML = `
        <img src="../img/default.png" alt="imagen-anuncio">
        <h3>${anuncio.titulo}</h3>
        <p>${anuncio.precio} Bs.</p>
        <p>${anuncio.descripcion}</p>
        <div class="caja_botones">
          <button class="btn_save">Guardar</button>
          <button class="btn_mensaje">Mensaje</button>
          <button class="btn_view">Ver</button>
        </div>
      `;

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar anuncios públicos:", error);
    contenedor.innerHTML = "<p>Error al cargar anuncios.</p>";
  }
}
