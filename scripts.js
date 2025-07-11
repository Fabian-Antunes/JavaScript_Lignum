// scripts.js

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            loginMessage.textContent = data.message;
            // Aquí podrías redirigir al usuario a otra página después de un inicio de sesión exitoso
        } else {
            loginMessage.textContent = data.message;
        }
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
       loginMessage.textContent = 'Error al intentar iniciar sesión. Por favor, intenta de nuevo más tarde.';
    }
});

function cancel() {
    // Función para cancelar, puedes implementar alguna lógica aquí si es necesario
}

