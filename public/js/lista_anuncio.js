document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("contenedor-lista-anuncios");
  if (!contenedor) return;

  const usuarioId = localStorage.getItem("usuarioId");
  let anunciosGlobal = []; // ⭐ Para almacenar todos los anuncios

  try {
    const res = await fetch("/anuncios/listado");

    const texto = await res.text();
    console.log("Respuesta del backend:", texto);

    let anuncios;
    try {
      anuncios = JSON.parse(texto);
    } catch (error) {
      throw new Error("El servidor no devolvió JSON válido.");
    }

    anunciosGlobal = anuncios; // ⭐ guardamos global
    mostrarAnuncios(anunciosGlobal);

  } catch (error) {
    console.error("Error al cargar anuncios:", error);
    if (contenedor) {
      contenedor.innerHTML = "<p>Error al cargar los anuncios. Intenta más tarde.</p>";
    }
  }

  function mostrarAnuncios(anuncios) {
    if (!Array.isArray(anuncios) || anuncios.length === 0) {
      contenedor.innerHTML = "<p>No hay anuncios disponibles.</p>";
      return;
    }

    contenedor.innerHTML = "";

    anuncios.forEach(anuncio => {
      const card = document.createElement("article");
      card.className = "section_anuncio_articulo";

      console.log("Anuncio debug:", anuncio);

      const imagen = anuncio.imagenes?.[0]?.path || "img/default.png";

      const esMio = usuarioId && parseInt(usuarioId) === anuncio.usuario_id;

      card.innerHTML = `
        <img src="${imagen}" alt="imagen-anuncio">
        <h3>${anuncio.titulo}</h3>
        <p>${anuncio.precio} Bs.-</p>
        <p class="publicado-por">Publicado por: ${anuncio.nombre_completo || 'Desconocido'}</p>
        <div class="caja_botones">
          ${!esMio ? `
            <button class="btn_save">Guardar</button>
            <button class="btn_mensaje">Mensaje</button>
          ` : `
            <p style="font-size: 0.85rem; color: #888; margin-bottom: 0.5rem;">(Este anuncio es tuyo)</p>
          `}
          <button class="btn_view">Ver</button>
        </div>
      `;

      const btnVer = card.querySelector(".btn_view");
      btnVer.addEventListener("click", () => abrirModal(anuncio));

      if (!esMio) {
        const btnGuardar = card.querySelector(".btn_save");
        btnGuardar.addEventListener("click", async () => {
          if (!usuarioId) {
            alert("Debes iniciar sesión para guardar anuncios.");
            return;
          }

          console.log("Guardando anuncio:", { usuarioId, anuncioId: anuncio.id });

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

        const btnMensaje = card.querySelector(".btn_mensaje");
        btnMensaje.addEventListener("click", async () => {
          if (!usuarioId) {
            alert("Debes iniciar sesión para enviar mensajes.");
            return;
          }

          if (parseInt(usuarioId) === anuncio.usuario_id) {
            alert("No puedes enviarte mensajes a ti mismo.");
            return;
          }

          try {
            const res = await fetch("/conversaciones", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                anuncio_id: anuncio.id,
                interesado_id: usuarioId,
                anunciante_id: anuncio.usuario_id
              }),
            });

            if (!res.ok) {
              const err = await res.text();
              throw new Error("Respuesta no OK del servidor: " + err);
            }

            const data = await res.json();
            console.log("Conversación creada o reutilizada:", data);

            if (!data || !data.id) {
              throw new Error("No se pudo crear conversación (sin ID)");
            }

            window.location.href = `chat_anuncio.html?conversacionId=${data.id}&anuncioId=${anuncio.id}`;
          } catch (error) {
            console.error("Error al iniciar conversación:", error);
            alert("Error al iniciar conversación.");
          }
        });
      }

      contenedor.appendChild(card);
    });
  }

  // ✅ Buscador
  const formBuscar = document.querySelector("form");
  const inputBuscar = formBuscar.querySelector("input[type='search']");
  formBuscar.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = inputBuscar.value.trim().toLowerCase();

    if (!query) {
      mostrarAnuncios(anunciosGlobal);
      return;
    }

    const filtrados = anunciosGlobal.filter(anuncio =>
      anuncio.titulo.toLowerCase().includes(query) ||
      anuncio.descripcion.toLowerCase().includes(query)
    );

    mostrarAnuncios(filtrados);
  });
});

// ✅ SLIDER MODAL
function abrirModal(anuncio) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalNombre = document.getElementById("modal-nombre");
  const modalDescripcion = document.getElementById("modal-descripcion");
  const modalPrecio = document.getElementById("modal-precio");
  const modalPublicado = document.getElementById("modal-publicado");

  let imagenes = anuncio.imagenes?.map(img => img.path) || ["img/default.png"];
  let indiceActual = 0;

  function actualizarImagen() {
    modalImg.src = imagenes[indiceActual];
  }

  actualizarImagen();

  modalNombre.textContent = anuncio.titulo;
  modalDescripcion.textContent = anuncio.descripcion;
  modalPrecio.textContent = `Precio: Bs. ${anuncio.precio}`;
  modalPublicado.textContent = `Publicado por: ${anuncio.nombre_completo}`;

  modal.style.display = "block";

  document.getElementById("prevBtn").onclick = () => {
    indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
    actualizarImagen();
  };

  document.getElementById("nextBtn").onclick = () => {
    indiceActual = (indiceActual + 1) % imagenes.length;
    actualizarImagen();
  };
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}
