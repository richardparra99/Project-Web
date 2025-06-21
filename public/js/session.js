document.addEventListener("DOMContentLoaded", () => {
  const menuLinks = document.getElementById("menu-links");
  if (!menuLinks) return;

  const usuarioId = localStorage.getItem("usuarioId");
  const paginaActual = window.location.pathname; // Ej: /mis_anuncios.html

  if (usuarioId) {
    // Usuario logueado
    let botones = `
      <li>
        <button class="navbar__buttons__i"><a href="index.html">Inicio</a></button>
      </li>
      <li>
        <button class="navbar__buttons__la"><a href="lista_anuncio.html">Lista de Anuncios</a></button>
      </li>
      <li>
        <button class="navbar__buttons__i"><a href="mis_anuncios.html">Mis Anuncios</a></button>
      </li>
      <li style="position: relative;">
        <button class="navbar__buttons__i" id="btn-chats">Chats</button>
        <div id="subchats" class="subcategorias oculto">
          <a href="chat_compra.html"><button class="subchats-compras">Compras</button></a>
          <a href="chat_venta.html"><button class="subchats-ventas">Ventas</button></a>
        </div>
      </li>
      <li>
        <button class="navbar__buttons__r" id="btnCerrarSesion"><a href="#">Cerrar Sesión</a></button>
      </li>
    `;

    // Solo si estamos en mis_anuncios.html se agrega el botón Crear
    if (paginaActual.includes("mis_anuncios.html")) {
      botones =
        `<li>
          <button class="navbar__buttons__i"><a href="crear_anuncio.html">Crear</a></button>
        </li>` + botones;
    }

    menuLinks.innerHTML = botones;

    // Eventos después del render
    setTimeout(() => {
      document.getElementById("btn-chats")?.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("subchats")?.classList.toggle("oculto");
      });

      document.getElementById("btnCerrarSesion")?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("usuarioId");
        location.reload();
      });
    }, 0);
  } else {
    // Usuario no logueado
    menuLinks.innerHTML = `
      <li>
        <button class="navbar__buttons__i"><a href="inicio_sesion.html">Iniciar sesión</a></button>
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
