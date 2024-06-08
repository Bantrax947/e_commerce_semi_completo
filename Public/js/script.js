document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const navSignInBtn = document.getElementById('navSignInBtn');
    const navSignUpBtn = document.getElementById('navSignUpBtn');

    // Eventos para los botones dentro de la animación de transición
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

    // Eventos para los botones de la barra de navegación
    navSignInBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

    navSignUpBtn.addEventListener('click', () => {
        container.classList.add("active");
    });
});
