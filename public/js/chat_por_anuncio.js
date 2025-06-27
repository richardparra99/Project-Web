document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const anuncioId = params.get("anuncioId");
  const usuarioId = localStorage.getItem("usuarioId");

  if (!anuncioId || !usuarioId) {
    alert("Faltan datos para mostrar esta vista.");
    return;
  }

  try {
    // ✅ Mostrar detalle del anuncio
    const resAnuncio = await fetch(`/anuncios/${anuncioId}`);
    const anuncio = await resAnuncio.json();

    document.getElementById("anuncio-detalle").innerHTML = `
      <img src="${anuncio.imagenes?.[0]?.path || 'img/default.png'}" alt="Imagen"
           style="width: 100%; max-width: 300px; border-radius: 8px; box-shadow: 0 0 8px rgba(0,0,0,0.2);" />
      <h3>${anuncio.titulo}</h3>
      <p><strong>Precio:</strong> Bs. ${anuncio.precio}</p>
    `;

    // ✅ Obtener conversaciones por anuncio
    const resConversaciones = await fetch(`/conversaciones/anuncio/${anuncioId}`);
    const conversaciones = await resConversaciones.json();

    const contenedor = document.getElementById("conversaciones-lista");

    if (!Array.isArray(conversaciones) || conversaciones.length === 0) {
      contenedor.innerHTML = `<p>No hay conversaciones todavía.</p>`;
      return;
    }

    // ✅ Mostrar cada interesado con último mensaje
    contenedor.innerHTML = conversaciones.map(conv => `
      <div style="border: 1px solid #ccc; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
        <strong>${conv.interesado_nombre || 'Interesado desconocido'}</strong>
        <p style="color: #444;">${conv.ultimo_mensaje || '(Sin mensajes aún)'}</p>
        <button class="btnAbrirChat" onclick="window.location.href='chat_anuncio.html?conversacionId=${conv.id}&anuncioId=${anuncioId}'">
          Abrir chat
        </button>
      </div>
    `).join("");

  } catch (err) {
    console.error("Error al cargar conversaciones:", err);
    document.getElementById("conversaciones-lista").innerHTML = `<p>Error al cargar las conversaciones.</p>`;
  }
});
