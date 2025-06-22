document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("contenedor-lista-anuncios");
  if (!contenedor) return;

  try {
    const res = await fetch("/anuncios/listado");

    // Leemos primero el texto crudo para poder inspeccionarlo si falla
    const texto = await res.text();
    console.log("Respuesta del backend:", texto);

    // Intentamos parsear el JSON
    let anuncios;
    try {
      anuncios = JSON.parse(texto);
    } catch (error) {
      throw new Error("El servidor no devolvió JSON válido.");
    }

    if (!Array.isArray(anuncios) || anuncios.length === 0) {
      contenedor.innerHTML = "<p>No hay anuncios disponibles.</p>";
      return;
    }

    contenedor.innerHTML = ""; // limpia antes de agregar

    anuncios.forEach(anuncio => {
      const card = document.createElement("article");
      card.className = "section_anuncio_articulo";

      // Si hay imagen, úsala; si no, usa una por defecto
      const imagen = anuncio.imagenes?.[0]?.path || "img/default.png";

      card.innerHTML = `
        <img src="${imagen}" alt="imagen-anuncio">
        <h3>${anuncio.titulo}</h3>
        <p>${anuncio.precio} Bs.-</p>
        <p class="publicado-por">Publicado por: ${anuncio.nombre_completo || 'Desconocido'}</p>
        <div class="caja_botones">
          <button class="btn_save">Guardar</button>
          <button class="btn_mensaje">Mensaje</button>
          <button class="btn_view">Ver</button>
        </div>
      `;

      const btnVer = card.querySelector(".btn_view");
      btnVer.addEventListener("click", () => abrirModal(anuncio));

      const btnGuardar = card.querySelector(".btn_save");
      btnGuardar.addEventListener("click", async () => {
        const usuarioId = localStorage.getItem("usuarioId");

        if (!usuarioId) {
          alert("Debes iniciar sesión para guardar anuncios.");
          return;
        }

        console.log("Guardando anuncio:", { usuarioId, anuncioId: anuncio.id }); // 👈 Útil para debug

        try {
          const res = await fetch("/guardados", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: usuarioId, anuncio_id: anuncio.id }),
          });

          const data = await res.json();
          alert(data.mensaje);
        } catch (error) {
          console.error("Error al guardar:", error);
          alert("No se pudo guardar el anuncio.");
        }
      });


      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar anuncios:", error);
    const contenedor = document.getElementById("contenedor-lista-anuncios");
    if (contenedor) {
      contenedor.innerHTML = "<p>Error al cargar los anuncios. Intenta más tarde.</p>";
    }
  }
});
