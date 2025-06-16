document.getElementById('registroForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Limpiar errores
    document.getElementById('error-nombre').textContent = '';
    document.getElementById('error-email').textContent = '';
    document.getElementById('error-password').textContent = '';

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    let hayError = false;

    if (!nombre) {
        document.getElementById('error-nombre').textContent = 'Por favor ingrese su nombre completo';
        hayError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        document.getElementById('error-email').textContent = 'Por favor ingrese un correo válido';
        hayError = true;
    }

    if (!password || password.length < 6) {
        document.getElementById('error-password').textContent = 'La contraseña debe tener al menos 6 caracteres';
        hayError = true;
    }

    if (hayError) return;

    const data = { nombre, email, password };

    try {
        const response = await fetch('/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Usuario registrado correctamente');
            window.location.href = '../index.html';
        } else {
            alert(result.mensaje || 'Error al registrar usuario');
        }
    } catch (error) {
        alert('Error en el servidor');
        console.error(error);
    }
});