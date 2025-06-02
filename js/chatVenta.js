const chatsPorProducto = {
    nike: ['pepito', 'leo'],
    minoxidil: ['andrea', 'juan']
  };

  function mostrarChats(producto) {
    const lista = document.getElementById('lista-chats');
    lista.innerHTML = '';
    chatsPorProducto[producto].forEach(usuario => {
      const li = document.createElement('li');
      li.textContent = usuario;
      li.onclick = () => mostrarChatIndividual(usuario);
      lista.appendChild(li);
    });

    document.getElementById('chats-producto').style.display = 'block';
    document.getElementById('chat-individual').style.display = 'none';
  }

  function mostrarChatIndividual(usuario) {
    document.getElementById('chat-nombre').textContent = usuario;
    document.getElementById('chat-individual').style.display = 'flex';
    document.getElementById('chats-producto').style.display = 'none';
  }

  function enviarMensaje() {
    const input = document.getElementById('mensaje');
    const mensaje = input.value.trim();
    if (mensaje) {
      const div = document.createElement('p');
      div.innerHTML = `<strong>Tú:</strong> ${mensaje}`;
      document.getElementById('chat-mensajes').appendChild(div);
      input.value = '';
    }
  }