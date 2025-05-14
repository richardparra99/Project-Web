document.addEventListener("DOMContentLoaded", () => {
  const botonCategoria = document.getElementById('btn-categoria');
  const subcategorias = document.getElementById('subcategorias');

  if (botonCategoria && subcategorias) {
    botonCategoria.addEventListener('click', () => {
      subcategorias.classList.toggle('oculto');
    });
  }
});
