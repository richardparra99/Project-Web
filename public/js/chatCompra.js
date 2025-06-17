document.addEventListener('DOMContentLoaded', () => {
    const anuncios = document.querySelectorAll('.anuncio');
    const chatSection = document.getElementById('chatSection');
    const userName = document.getElementById('userName');

    anuncios.forEach(anuncio => {
      anuncio.addEventListener('click', () => {
        // Mostrar la sección del chat
        chatSection.classList.remove('oculto');

        // Cambiar el nombre del usuario o título según el producto
        const producto = anuncio.textContent.trim();
        userName.textContent = `Vendedor de ${producto}`;
      });
    });
  });