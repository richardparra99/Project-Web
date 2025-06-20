document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("contenedor-mis-anuncios");
  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    contenedor.innerHTML = "<p>Debes iniciar sesión para ver tus anuncios.</p>";
    return;
  }

  try {
    const response = await fetch(`/anuncios/usuario/${usuarioId}`);
    const anuncios = await response.json();

    if (!anuncios.length) {
      contenedor.innerHTML = "<p>No has creado ningún anuncio aún.</p>";
      return;
    }

    anuncios.forEach((anuncio) => {
      const card = document.createElement("article");
      card.className = "section_anuncio_articulo";

      card.innerHTML = `
        <img src="img/default.png" alt="imagen-anuncio">
        <h3>${anuncio.titulo}</h3>
        <p>${anuncio.precio} Bs.</p>
        <p>${anuncio.descripcion}</p>
        <div class="caja_botones">
          <button class="btn_editar">Editar</button>
          <button class="btn_toggle_estado">${anuncio.estado === 'Activo' ? 'Deshabilitar' : 'Habilitar'}</button>
          <button class="btn_eliminar">Eliminar</button>
        </div>
      `;

      // Editar
      card.querySelector(".btn_editar").addEventListener("click", () => {
        window.location.href = `editar_anuncio.html?id=${anuncio.id}`;
      });

      // Eliminar
      card.querySelector(".btn_eliminar").addEventListener("click", async () => {
        if (confirm("¿Eliminar este anuncio?")) {
          const res = await fetch(`/anuncios/${anuncio.id}`, { method: "DELETE" });
          if (res.ok) card.remove();
          else alert("Error al eliminar.");
        }
      });

      // Habilitar / Deshabilitar
      card.querySelector(".btn_toggle_estado").addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        const res = await fetch(`/anuncios/${anuncio.id}/estado`, { method: "PUT" });
        if (res.ok) {
          btn.textContent = btn.textContent === "Habilitar" ? "Deshabilitar" : "Habilitar";
        } else {
          alert("Error al cambiar estado.");
        }
      });

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = "<p>Error al cargar tus anuncios.</p>";
  }
});
