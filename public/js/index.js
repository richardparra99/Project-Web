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
  }

  } else {
    // Usuario no logueado
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
