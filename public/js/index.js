document.addEventListener("DOMContentLoaded", () => {
  const menuLinks = document.getElementById("menu-links");
  const usuarioId = localStorage.getItem("usuarioId");

  if (!menuLinks) return;

  if (usuarioId) {
    // Usuario logueado
    if (usuarioId) {
    menuLinks.innerHTML = `
      <li>
        <button class="navbar__buttons__i"><a href="crear_anuncio.html">Crear</a></button>
      </li>
      <li style="position: relative;">
        <button class="navbar__buttons__i" id="btn-categoria"><a>Categoría</a></button>
        <div id="subcategorias" class="subcategorias oculto">
          <button>Vehículos</button>
          <button>Relojes</button>
        </div>
      </li>
      <li style="position: relative;">
        <button class="navbar__buttons__i" id="btn-chats"><a>Chats</a></button>
        <div id="subchats" class="subcategorias oculto">
          <a href="chat_compra.html"><button class="subchats-compras">Compras</button></a>
          <a href="chat_venta.html"><button class="subchats-ventas">Ventas</button></a>
        </div>
      </li>
      <li>
        <button class="navbar__buttons__i" id="btnAnuncios"><a href="#">Anuncios</a></button>
      </li>
      <li>
        <button class="navbar__buttons__r" id="btnMisAnuncios"><a href="#">Mis Anuncios</a></button>
      </li>
      <li>
        <button class="navbar__buttons__r"><a href="producto_guardado.html">Guardados</a></button>
      </li>
      <li>
        <button class="navbar__buttons__r" id="btnCerrarSesion"><a href="#">Cerrar Sesión</a></button>
      </li>
    `;

    // 🔁 Esperar al siguiente ciclo de render antes de agregar eventos
    setTimeout(() => {
      document.getElementById('btn-categoria')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('subcategorias')?.classList.toggle('oculto');
      });

      document.getElementById("btnAnuncios")?.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarAnunciosPublicos();
      });
      

      document.getElementById('btn-chats')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('subchats')?.classList.toggle('oculto');
      });

      document.getElementById('btnCerrarSesion')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('usuarioId');
        location.reload();
      });
    }, 0);

          // Mostrar anuncios del usuario
      document.getElementById('btnMisAnuncios')?.addEventListener('click', async (e) => {
        e.preventDefault();

        const contenedor = document.getElementById("contenedor-anuncios");
        const seccion = document.getElementById("mis-anuncios");

        contenedor.innerHTML = ""; // limpia anteriores
        seccion.style.display = "block"; // muestra la sección

        try {
          const res = await fetch(`/anuncios/usuario/${usuarioId}`);
          const anuncios = await res.json();

          if (anuncios.length === 0) {
            contenedor.innerHTML = "<p>No has creado ningún anuncio aún.</p>";
            return;
          }

          anuncios.forEach(anuncio => {
            const card = document.createElement("article");
            card.className = "section_anuncio_articulo";

            card.innerHTML = `
              <img src="../img/default.png" alt="imagen-anuncio">
              <h3>${anuncio.titulo}</h3>
              <p>${anuncio.precio} Bs.</p>
              <p>${anuncio.descripcion}</p>
              <div class="caja_botones">
                <button class="btn_editar">Editar</button>
                <button class="btn_toggle_estado">${anuncio.estado === 'Activo' ? 'Deshabilitar' : 'Habilitar'}</button>
                <button class="btn_eliminar">Eliminar</button>
              </div>
            `;

            card.querySelector(".btn_editar")?.addEventListener("click", () => {
              window.location.href = `editar_anuncio.html?id=${anuncio.id}`;
            });

            card.querySelector(".btn_eliminar")?.addEventListener("click", async () => {
              if (confirm("¿Estás seguro de eliminar este anuncio?")) {
                await fetch(`/anuncios/${anuncio.id}`, { method: 'DELETE' });
                card.remove(); // quitar de la vista
              }
            });

            card.querySelector(".btn_toggle_estado")?.addEventListener("click", async (e) => {
              const boton = e.currentTarget;

              try {
                const response = await fetch(`/anuncios/${anuncio.id}/estado`, {
                  method: 'PUT'
                });

                if (response.ok) {
                  // Cambiar el estado del botón dinámicamente
                  const nuevoTexto = boton.textContent === "Habilitar" ? "Deshabilitar" : "Habilitar";
                  boton.textContent = nuevoTexto;
                  alert("Estado del anuncio actualizado correctamente.");
                } else {
                  alert("No se pudo cambiar el estado.");
                }
              } catch (error) {
                console.error("Error al cambiar estado:", error);
                alert("Error del servidor.");
              }
            });


            contenedor.appendChild(card);
          });
        } catch (error) {
          console.error("Error al cargar tus anuncios:", error);
          contenedor.innerHTML = "<p>Error al cargar tus anuncios.</p>";
        }
      });

  }

  } else {
    // Usuario no logueado
      // Cargar anuncios destacados (de todos menos del usuario actual)
  fetch('/anuncios/destacados') // 👈 este endpoint debe devolver todos menos los del usuario
    .then(res => res.json())
    .then(anuncios => {
      const contenedor = document.getElementById("contenedor-destacados");

      anuncios.forEach(anuncio => {
        const card = document.createElement("article");
        card.className = "section_anuncio_articulo";

        card.innerHTML = `
          <img src="../img/default.png" alt="imagen-anuncio">
          <h3>${anuncio.titulo}</h3>
          <p>${anuncio.precio} Bs.</p>
          <div class="caja_botones">
            <button class="btn_save">Guardar</button>
            <button class="btn_mensaje">Mensaje</button>
            <button class="btn_view">Ver</button>
          </div>
        `;

        contenedor.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error al cargar anuncios destacados:", err);
    });

    menuLinks.innerHTML = `
      <li>
        <button class="navbar__buttons__i"><a href="inicio_sesion.html">Iniciar sesión!</a></button>
      </li>
      <li>
        <button class="navbar__buttons__l"><a href="lista_anuncio.html">Lista anuncio</a></button>
      </li>
      <li>
        <button class="navbar__buttons__r"><a href="registrarse.html">Registrarse</a></button>
      </li>
    `;
  }
});
