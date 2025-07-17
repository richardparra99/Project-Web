document.addEventListener("DOMContentLoaded", async () => {
  const menuLinks = document.getElementById("menu-links");
  const usuarioId = localStorage.getItem("usuarioId");
  const paginaActual = window.location.pathname;

  if (!menuLinks) return;

  if (usuarioId) {
    let botones = "";

    if (!paginaActual.includes("index.html")) {
      botones += `
        <li>
          <button class="navbar__buttons__i"><a href="index.html">Inicio</a></button>
        </li>
      `;
    }

    botones += `
      <li>
        <button class="navbar__buttons__la"><a href="lista_anuncio.html">Lista de Anuncios</a></button>
      </li>
      <li>
        <button class="navbar__buttons__i"><a href="categorias.html">Categorías</a></button>
      </li>
      <li>
        <button class="navbar__buttons__i"><a href="mis_anuncios.html">Mis Anuncios</a></button>
      </li>
      ${
        !paginaActual.includes("chat_anuncio.html") &&
        !paginaActual.includes("chat_venta.html") &&
        !paginaActual.includes("chats_por_anuncio.html") &&
        !paginaActual.includes("chat_compraHeader.html") &&
        !paginaActual.includes("categorias.html")
          ? `
          <li style="position: relative;">
            <button class="navbar__buttons__i" id="btn-chats">Chats</button>
            <div id="subchats" class="subcategorias oculto">
              <button class="btn-ventas" onclick="window.location.href='chat_venta.html'">Ventas</button>
              <button class="btn-compras" onclick="window.location.href='chat_compraHeader.html'">Compras</button>
            </div>
          </li>
        `
          : ""
      }
      <li>
        <button class="navbar__buttons__r"><a href="producto_guardado.html">Guardados</a></button>
      </li>
      <li>
        <button class="navbar__buttons__r" id="btnCerrarSesion"><a href="#">Cerrar Sesión</a></button>
      </li>
    `;

    if (paginaActual.includes("mis_anuncios.html")) {
      botones =
        `<li>
          <button class="navbar__buttons__i"><a href="crear_anuncio.html">Crear</a></button>
        </li>` + botones;
    }

    menuLinks.innerHTML = botones;

    setTimeout(() => {
      document.getElementById("btn-chats")?.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("subchats")?.classList.toggle("oculto");
      });

      document.getElementById("btnCerrarSesion")?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("usuarioId");
        localStorage.removeItem("nombreUsuario");
        location.reload();
      });
    }, 0);

    // ✅ Mostrar nombre del usuario en index.html
    if (paginaActual.includes("index.html") || paginaActual === "/" || paginaActual === "/index.html") {
      const nombreUsuario = localStorage.getItem("nombreUsuario");
      if (nombreUsuario) {
        const titulo = document.querySelector(".container__title");
        if (titulo) {
          titulo.innerHTML = `Bienvenido <span style="color:#196eb4">${nombreUsuario}</span>`;
        }
      }
    }

  } else {
    let botones = "";

    if (paginaActual.includes("categorias.html") || paginaActual.includes("lista_anuncio.html")) {
      botones += `
        <li>
          <button class="navbar__buttons__i"><a href="index.html">Inicio</a></button>
        </li>
      `;
    }

    botones += `
      <li>
        <button class="navbar__buttons__i"><a href="inicio_sesion.html">Iniciar sesión</a></button>
      </li>
      <li>
        <button class="navbar__buttons__i"><a href="categorias.html">Categorías</a></button>
      </li>
      <li>
        <button class="navbar__buttons__l"><a href="lista_anuncio.html">Lista anuncio</a></button>
      </li>
      <li>
        <button class="navbar__buttons__r"><a href="registrarse.html">Registrarse</a></button>
      </li>
    `;

    menuLinks.innerHTML = botones;
  }
});
