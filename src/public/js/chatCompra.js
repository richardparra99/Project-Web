document.addEventListener("DOMContentLoaded", async () => {
  const usuarioId = localStorage.getItem("usuarioId");
  const listaConversaciones = document.getElementById("conversaciones-lista");
  const chatSection = document.getElementById("chatSection");
  const userName = document.getElementById("userName");
  const mensajesContainer = document.getElementById("chat-mensajes");
  const mensajeInput = document.getElementById("mensajeInput");
  const enviarBtn = document.getElementById("enviarBtn");

  let conversacionActualId = null;
  let receptorId = null;

  async function cargarConversaciones() {
    try {
      const res = await fetch(`/conversaciones/usuario/${usuarioId}`);
      const conversaciones = await res.json();

      if (conversaciones.length === 0) {
        listaConversaciones.innerHTML += `<p>No tienes conversaciones iniciadas.</p>`;
        return;
      }

      conversaciones.forEach(conv => {
        const div = document.createElement("div");
        div.className = "anuncio";
        div.textContent = conv.titulo;
        div.addEventListener("click", async () => {
          conversacionActualId = conv.id;
          receptorId = usuarioId == conv.anunciante_id ? conv.interesado_id : conv.anunciante_id;

          userName.textContent = conv.nombre_completo;
          chatSection.classList.remove("oculto");

          await cargarMensajes(conv.id);
        });
        listaConversaciones.appendChild(div);
      });
    } catch (error) {
      console.error("Error al cargar conversaciones:", error);
    }
  }

  async function cargarMensajes(conversacionId) {
    try {
      const res = await fetch(`/mensajes/${conversacionId}`);
      const mensajes = await res.json();

      mensajesContainer.innerHTML = "";
      mensajes.forEach(msg => {
        const div = document.createElement("div");
        div.className = msg.emisor_id == usuarioId ? "mensaje-propio" : "mensaje-ajeno";
        div.textContent = msg.contenido;
        mensajesContainer.appendChild(div);
      });
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    }
  }

  enviarBtn.addEventListener("click", async () => {
    const contenido = mensajeInput.value.trim();
    if (!contenido || !conversacionActualId || !receptorId) return;

    try {
      const res = await fetch("/mensajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenido,
          emisor_id: usuarioId,
          receptor_id: receptorId,
          conversacion_id: conversacionActualId,
        }),
      });

      if (res.ok) {
        mensajeInput.value = "";
        await cargarMensajes(conversacionActualId);
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  });

  await cargarConversaciones();
});
