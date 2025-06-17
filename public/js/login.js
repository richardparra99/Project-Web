document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Limpiar errores anteriores
    document.getElementById('error-email').textContent = '';
    document.getElementById('error-password').textContent = '';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    let hayError = false;

    if (!email) {
        document.getElementById('error-email').textContent = 'Por favor ingrese su correo';
        hayError = true;
    }

    if (!password) {
        document.getElementById('error-password').textContent = 'Por favor ingrese su contraseña';
        hayError = true;
    }

    if (hayError) return;

    try {
        const response = await fetch('/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Inicio de sesión exitoso');
            // Puedes guardar el ID o token si es necesario
            localStorage.setItem('usuarioId', result.id);
            window.location.href = 'index.html';
        } else {
            alert(result.mensaje || 'Credenciales inválidas');
        }
    } catch (error) {
        alert('Error en el servidor');
        console.error(error);
    }
});