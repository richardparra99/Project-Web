document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.btn_view');

  botones.forEach(boton => {
    boton.addEventListener('click', (e) => {
      e.preventDefault();

      const article = boton.closest('article');
      const img = article.querySelector('img').src;
      const nombre = article.querySelector('h3').textContent;
      const precio = article.querySelector('p').textContent;
      const descripcion = article.getAttribute('data-descripcion');

      document.getElementById('modal-img').src = img;
      document.getElementById('modal-nombre').textContent = nombre;
      document.getElementById('modal-precio').textContent = precio;
      document.getElementById('modal-descripcion').textContent = descripcion;

      document.getElementById('modal').style.display = 'flex';
    });
  });
});

function cerrarModal() {
  document.getElementById('modal').style.display = 'none';
}

