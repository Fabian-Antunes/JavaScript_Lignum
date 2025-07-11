// scripts.js

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            loginMessage.textContent = data.message;
            loginMessage.className = 'success';
            // Redireccionar si lo deseás:
            // window.location.href = '/dashboard.html';
        } else {
            loginMessage.textContent = data.message;
            loginMessage.className = 'error';
        }
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        loginMessage.textContent = 'Error al intentar iniciar sesión. Por favor, intenta de nuevo más tarde.';
        loginMessage.className = 'error';
    }
});

function cancel() {
    loginForm.reset();
    loginMessage.textContent = '';
    loginMessage.className = '';
}
