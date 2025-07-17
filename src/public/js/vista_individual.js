function abrirModal(anuncio) {
  const modal = document.getElementById('modal');
  const img = document.getElementById('modal-img');
  const nombre = document.getElementById('modal-nombre');
  const descripcion = document.getElementById('modal-descripcion');
  const precio = document.getElementById('modal-precio');
  const publicado = document.getElementById('modal-publicado');

  // Cargar los datos del anuncio
  img.src = anuncio.imagenes?.[0]?.path || 'img/default.png';
  nombre.textContent = anuncio.titulo;
  descripcion.textContent = anuncio.descripcion;
  precio.textContent = `${anuncio.precio} Bs.`;
  publicado.textContent = `Publicado por: ${anuncio.nombre_completo || 'Desconocido'}`;

  // Mostrar el modal
  modal.style.display = 'flex';
}

function cerrarModal() {
  document.getElementById('modal').style.display = 'none';
}

