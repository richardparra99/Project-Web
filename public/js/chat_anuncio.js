document.addEventListener("DOMContentLoaded", async () => {
  let receptorId = null;
  const params = new URLSearchParams(window.location.search);
  const conversacionId = params.get("conversacionId");
  const anuncioId = params.get("anuncioId");

  const usuarioId = localStorage.getItem("usuarioId");
  if (!usuarioId || !conversacionId || !anuncioId) {
    alert("Faltan datos para mostrar el chat.");
    return;
  }

  try {
    // 🔹 Cargar detalle del anuncio
    const resAnuncio = await fetch(`/anuncios/${anuncioId}`);
    const anuncio = await resAnuncio.json();

    const anuncioDiv = document.getElementById("anuncio-info");
    anuncioDiv.innerHTML = `
      <img src="${anuncio.imagenes?.[0]?.path || 'img/default.png'}"
           alt="Imagen anuncio"
           style="width: 100%; max-width: 300px; border-radius: 8px; box-shadow: 0 0 8px rgba(0,0,0,0.2); margin-bottom: 1rem;">
      <h2>${anuncio.titulo}</h2>
      <p>${anuncio.descripcion}</p>
      <p><strong>Precio:</strong> Bs. ${anuncio.precio}</p>
      <p><strong>Publicado por:</strong> ${anuncio.nombre_completo}</p>
    `;

    // 🔹 Obtener datos de la conversación (interesado y anunciante)
    const resConv = await fetch(`/conversaciones/${conversacionId}`);
    const conversacion = await resConv.json();

    // 🔹 Determinar quién es el receptor (la otra persona)
    let nombreReceptor = "Usuario";
    if (parseInt(usuarioId) === conversacion.anunciante_id) {
      receptorId = conversacion.interesado_id;
      nombreReceptor = conversacion.interesado_nombre;
    } else {
      receptorId = conversacion.anunciante_id;
      nombreReceptor = conversacion.anunciante_nombre;
    }

    // 🔹 Mostrar encabezado con el nombre del receptor
    const chatHeader = document.querySelector(".chat-header");
    if (chatHeader) {
      chatHeader.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${anuncio.imagenes?.[0]?.path || 'img/default.png'}"
              alt="Imagen anuncio"
              style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%; box-shadow: 0 0 4px rgba(0,0,0,0.2);">
          <span style="font-weight: bold; font-size: 1rem;">${nombreReceptor}</span>
        </div>
      `;
    }

  } catch (error) {
    console.error("Error cargando anuncio o conversación:", error);
  }

  // 🔹 Cargar mensajes
  const mensajesDiv = document.getElementById("mensajes");

  async function cargarMensajes() {
    try {
      const res = await fetch(`/mensajes/${conversacionId}`);
      const mensajes = await res.json();

      mensajesDiv.innerHTML = mensajes.map(m =>
        `<div class="${m.emisor_id == usuarioId ? 'enviado' : 'recibido'}">
          ${m.contenido}
        </div>`
      ).join("");
      mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    }
  }

  await cargarMensajes();

  // 🔹 Enviar mensaje
  const input = document.getElementById("mensaje-input");
  const btnEnviar = document.getElementById("enviar");

  btnEnviar.addEventListener("click", async () => {
    const texto = input.value.trim();
    if (texto === "") return;

    try {
      const res = await fetch("/mensajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenido: texto,
          emisor_id: usuarioId,
          receptor_id: receptorId,
          conversacion_id: conversacionId
        })
      });

      if (res.ok) {
        input.value = "";
        await cargarMensajes();
      } else {
        console.error("Error al enviar mensaje");
      }
    } catch (error) {
      console.error("Error al enviar:", error);
    }
  });
});
