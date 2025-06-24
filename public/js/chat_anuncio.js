document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const conversacionId = params.get("conversacionId");
  const anuncioId = params.get("anuncioId");

  const usuarioId = localStorage.getItem("usuarioId");
  if (!usuarioId || !conversacionId || !anuncioId) {
    alert("Faltan datos para mostrar el chat.");
    return;
  }

  // Cargar info del anuncio
  try {
    const resAnuncio = await fetch(`/anuncios/${anuncioId}`);
    const anuncio = await resAnuncio.json();

    const anuncioDiv = document.getElementById("anuncio-info");
    anuncioDiv.innerHTML = `
      <h2>${anuncio.titulo}</h2>
      <p>${anuncio.descripcion}</p>
      <p><strong>Precio:</strong> Bs. ${anuncio.precio}</p>
      <p><strong>Publicado por:</strong> ${anuncio.nombre_completo}</p>
      <div>
        ${(anuncio.imagenes || []).map(img =>
          `<img src="${img.path}" alt="imagen" style="max-width: 100px; margin: 5px;">`
        ).join("")}
      </div>
    `;
  } catch (error) {
    console.error("Error cargando anuncio:", error);
  }

  // Cargar mensajes de la conversación
  const mensajesDiv = document.getElementById("mensajes");

  async function cargarMensajes() {
    try {
      const res = await fetch(`/mensajes/${conversacionId}`);
      const mensajes = await res.json();

      mensajesDiv.innerHTML = mensajes.map(m =>
        `<div style="margin: 4px 0; text-align: ${m.emisor_id == usuarioId ? 'right' : 'left'}">
          <span style="background: #eee; padding: 6px; border-radius: 6px;">
            ${m.contenido}
          </span>
        </div>`
      ).join("");
      mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    }
  }

  await cargarMensajes();

  // Enviar mensaje
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
          receptor_id: 0, // Opcional: podés reemplazar por anunciante/interesado real
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
