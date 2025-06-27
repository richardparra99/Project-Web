document.addEventListener("DOMContentLoaded", async () => {
  const usuarioId = localStorage.getItem("usuarioId");
  if (!usuarioId) {
    alert("Debes iniciar sesión para ver tus compras.");
    return;
  }

  const contenedor = document.getElementById("mis-compras");
  contenedor.innerHTML = "<p class='no-anuncios'>Cargando tus compras...</p>";

  try {
    const res = await fetch(`/conversaciones/interesado/${usuarioId}`);
    const conversaciones = await res.json();

    if (!Array.isArray(conversaciones) || conversaciones.length === 0) {
      contenedor.innerHTML = "<p class='no-anuncios'>No has iniciado conversaciones aún.</p>";
      return;
    }

    contenedor.innerHTML = "";

    for (const conv of conversaciones) {
      const anuncio = conv.anuncio;
      const imagenSrc = anuncio?.imagenes?.[0]?.path || "img/default.png";

      const div = document.createElement("div");
      div.className = "anuncio-card";
      div.style = "border: 1px solid #ccc; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; display: flex; gap: 1rem;";

      div.innerHTML = `
        <img src="${imagenSrc}" alt="Imagen anuncio" style="width: 100px; height: 100px; object-fit: cover; border-radius: 6px;" />
        <div class="info">
          <h3>${anuncio.titulo}</h3>
          <p>${anuncio.descripcion}</p>
          <p><strong>Precio:</strong> Bs. ${anuncio.precio}</p>
          <p><strong>Publicado por:</strong> ${anuncio.nombre_completo}</p>
          <button class="btn-ver-chat" data-conversacion-id="${conv.id}" data-anuncio-id="${anuncio.id}">
            Ver Chat
          </button>
        </div>
      `;

      contenedor.appendChild(div);
    }

    document.querySelectorAll(".btn-ver-chat").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const conversacionId = e.target.getAttribute("data-conversacion-id");
        const anuncioId = e.target.getAttribute("data-anuncio-id");
        if (conversacionId && anuncioId) {
          window.location.href = `chat_anuncio.html?conversacionId=${conversacionId}&anuncioId=${anuncioId}`;
        }
      });
    });

  } catch (error) {
    console.error("Error al cargar compras:", error);
    contenedor.innerHTML = "<p class='no-anuncios'>Ocurrió un error al cargar tus compras.</p>";
  }
});
