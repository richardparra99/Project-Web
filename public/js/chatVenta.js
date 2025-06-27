document.addEventListener("DOMContentLoaded", async () => {
  const usuarioId = localStorage.getItem("usuarioId");
  if (!usuarioId) {
    alert("Debes iniciar sesión para ver tus ventas.");
    return;
  }

  const contenedor = document.getElementById("mis-anuncios");
  contenedor.innerHTML = "<p class='no-anuncios'>Cargando anuncios...</p>";

  try {
    const res = await fetch(`/anuncios/chats/ventas/${usuarioId}`);
    const anuncios = await res.json();

    if (!Array.isArray(anuncios) || anuncios.length === 0) {
      contenedor.innerHTML = "<p class='no-anuncios'>No has publicado ningún anuncio.</p>";
      return;
    }

    contenedor.innerHTML = ""; // Limpiar

    for (const anuncio of anuncios) {
      const div = document.createElement("div");
      div.className = "anuncio-card";

      const imagenSrc = anuncio.imagenes?.[0]?.path || "img/default.png";

      div.innerHTML = `
        <img src="${imagenSrc}" alt="Imagen anuncio" />
        <div class="info">
          <h3>${anuncio.titulo}</h3>
          <p>${anuncio.descripcion}</p>
          <p><strong>Precio:</strong> Bs. ${anuncio.precio}</p>
          <p><strong>Conversaciones:</strong> ${anuncio.cantidad_chats}</p>
          <button class="btn-ver-chats" data-anuncio-id="${anuncio.id}">Ver Chats</button>
        </div>
      `;

      contenedor.appendChild(div);
    }

    // Escuchar eventos de los botones
    document.querySelectorAll(".btn-ver-chats").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const anuncioId = e.target.getAttribute("data-anuncio-id");
        if (anuncioId) {
          window.location.href = `chats_por_anuncio.html?anuncioId=${anuncioId}`;
        }
      });
    });

  } catch (error) {
    console.error("Error al cargar tus anuncios:", error);
    contenedor.innerHTML = "<p class='no-anuncios'>Ocurrió un error al cargar tus anuncios.</p>";
  }
});
