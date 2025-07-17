document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("contenedor-anuncios-guardados");
  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    contenedor.innerHTML = "<p>Debes iniciar sesión para ver tus anuncios guardados.</p>";
    return;
  }

  try {
    const res = await fetch(`/guardados/usuario/${usuarioId}`);
    const texto = await res.text();

    let anuncios;
    try {
      anuncios = JSON.parse(texto);
    } catch (error) {
      console.error("Respuesta no es JSON válido:", texto);
      throw new Error("El servidor no devolvió JSON válido.");
    }

    if (!Array.isArray(anuncios) || anuncios.length === 0) {
      contenedor.innerHTML = "<p>No tienes anuncios guardados aún.</p>";
      return;
    }

    contenedor.innerHTML = "";

    anuncios.forEach(anuncio => {
      const card = document.createElement("article");
      card.className = "section_anuncio_articulo";

      const imagen = anuncio.imagen || "img/default.png";

      card.innerHTML = `
        <img src="${imagen}" alt="imagen-anuncio">
        <h3>${anuncio.titulo}</h3>
        <p>${anuncio.precio} Bs.</p>
        <p>${anuncio.descripcion}</p>
        <button class="btn_ver_guardado">Ver</button>
        <button class="btn_eliminar_guardado">Eliminar</button>
      `;


      card.querySelector(".btn_ver_guardado").addEventListener("click", () => {
        document.getElementById("modal-img").src = imagen;
        document.getElementById("modal-nombre").textContent = anuncio.titulo;
        document.getElementById("modal-descripcion").textContent = anuncio.descripcion;
        document.getElementById("modal-precio").textContent = `${anuncio.precio} Bs.`;
        document.getElementById("modal-creador").textContent = `Publicado por: ${anuncio.nombre_completo || 'Desconocido'}`;

        document.getElementById("modal").style.display = "flex";
      });

      card.querySelector(".btn_eliminar_guardado").addEventListener("click", async () => {
        try {
          const res = await fetch(`/guardados/${usuarioId}/${anuncio.id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            card.remove();
          } else {
            alert("No se pudo eliminar el anuncio guardado.");
          }
        } catch (error) {
          console.error("Error al eliminar anuncio guardado:", error);
          alert("Error del servidor al eliminar el anuncio.");
        }
      });

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar anuncios guardados:", error);
    contenedor.innerHTML = "<p>Error al cargar anuncios guardados.</p>";
  }
});


function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}