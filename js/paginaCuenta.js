document.addEventListener("DOMContentLoaded", () => {
  // Para Categoría
  const botonCategoria = document.getElementById('btn-categoria');
  const subcategorias = document.getElementById('subcategorias');

  if (botonCategoria && subcategorias) {
    botonCategoria.addEventListener('click', (e) => {
      e.preventDefault(); // Evita que el <a href=""> recargue
      subcategorias.classList.toggle('oculto');
    });
  }

  // Para Chats 👇
  const botonChats = document.getElementById('btn-chats');
  const subchats = document.getElementById('subchats');

  if (botonChats && subchats) {
    botonChats.addEventListener('click', (e) => {
      e.preventDefault(); // Muy importante
      subchats.classList.toggle('oculto');
    });
  }
});

