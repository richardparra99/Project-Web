document.addEventListener("DOMContentLoaded", () => {
  // 🔐 Proteger acceso si no hay usuario logueado
  const usuarioId = localStorage.getItem('usuarioId');
  if (!usuarioId) {
    window.location.href = 'inicio_sesion.html'; // o '../index.html'
    return;
  }

  // 📂 Mostrar subcategorías
  const botonCategoria = document.getElementById('btn-categoria');
  const subcategorias = document.getElementById('subcategorias');

  if (botonCategoria && subcategorias) {
    botonCategoria.addEventListener('click', (e) => {
      e.preventDefault();
      subcategorias.classList.toggle('oculto');
    });
  }

  // 💬 Mostrar subchats
  const botonChats = document.getElementById('btn-chats');
  const subchats = document.getElementById('subchats');

  if (botonChats && subchats) {
    botonChats.addEventListener('click', (e) => {
      e.preventDefault();
      subchats.classList.toggle('oculto');
    });
  }

  // 🚪 Cerrar sesión
  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuarioId');
      window.location.href = '/index.html'; // o '../index.html'
    });
  }
});
