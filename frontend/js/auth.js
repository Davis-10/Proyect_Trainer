// Configuración de la API
const API_URL = 'http://localhost:5000/api';

// Función para obtener parámetros de la URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Función para mostrar mensajes de error/éxito
function showMessage(message, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert ${isError ? 'alert-error' : 'alert-success'}`;
    messageDiv.textContent = message;

    const form = document.querySelector('.auth-form');
    form.insertBefore(messageDiv, form.firstChild);

    setTimeout(() => messageDiv.remove(), 5000);
}

// Función para validar el formulario de registro
function validateRegisterForm(formData) {
    const errors = [];

    if (formData.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    const edad = new Date().getFullYear() - new Date(formData.fecha_nacimiento).getFullYear();
    if (edad < 18 || edad > 100) {
        errors.push('Debes tener entre 18 y 100 años');
    }

    if (formData.datos_fisicos.peso < 30 || formData.datos_fisicos.peso > 300) {
        errors.push('El peso debe estar entre 30 y 300 kg');
    }

    if (formData.datos_fisicos.altura < 100 || formData.datos_fisicos.altura > 250) {
        errors.push('La altura debe estar entre 100 y 250 cm');
    }

    return errors;
}

// Función para manejar el inicio de sesión
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar el token y datos del usuario
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirigir al dashboard después de un pequeño retraso para asegurar que los datos se guarden
            setTimeout(() => {
                window.location.href = '../dashboard.html';
            }, 100);
        } else {
            showMessage(data.message || 'Error al iniciar sesión', true);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al conectar con el servidor', true);
    }
}

// Función para manejar el registro
async function handleRegister(event) {
    event.preventDefault();

    // Obtener el plan seleccionado de la URL
    const planSeleccionado = getUrlParameter('plan');

    // Recoger todos los datos del formulario
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
        genero: document.getElementById('genero').value,
        datos_fisicos: {
            peso: parseFloat(document.getElementById('peso').value),
            altura: parseInt(document.getElementById('altura').value),
            nivel_actividad: document.getElementById('nivel_actividad').value
        },
        objetivos: {
            principal: document.getElementById('objetivo').value,
            tiempo_disponible: parseInt(document.getElementById('tiempo_disponible').value)
        },
        plan_seleccionado: planSeleccionado
    };

    // Validar el formulario
    const errors = validateRegisterForm(formData);
    if (errors.length > 0) {
        errors.forEach(error => showMessage(error, true));
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar el token y datos del usuario
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Mostrar mensaje de éxito
            showMessage('Registro exitoso', false);

            // Redirigir según el plan seleccionado
            setTimeout(() => {
                if (planSeleccionado) {
                    window.location.href = '../payment.html';
                } else {
                    window.location.href = '../index.html';
                }
            }, 2000);
        } else {
            showMessage(data.message || 'Error en el registro', true);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al conectar con el servidor', true);
    }
}

// Función para mostrar/ocultar contraseña
function togglePassword(event) {
    // Obtener el contenedor del toggle (puede ser el icono o el span)
    const toggleWrapper = event.currentTarget.closest('.password-toggle-wrapper');

    // Obtener el icono dentro del wrapper
    const toggleIcon = toggleWrapper.querySelector('i');

    // Obtener el campo de contraseña asociado (está en el input-icon-wrapper anterior)
    const passwordInput = toggleWrapper.previousElementSibling.querySelector('input[type="password"], input[type="text"]');

    // Cambiar el tipo de input y el icono
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
        toggleWrapper.querySelector('span').textContent = 'Ocultar contraseña';
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
        toggleWrapper.querySelector('span').textContent = 'Mostrar contraseña';
    }
}

// Función para calcular el IMC
function calcularIMC(peso, altura) {
    const alturaMetros = altura / 100;
    return (peso / (alturaMetros * alturaMetros)).toFixed(2);
}

// Función para calcular las calorías base (BMR)
function calcularCaloriasBase(peso, altura, edad, genero) {
    if (genero === 'masculino') {
        return 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad);
    } else {
        return 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
    }
}

// Función para calcular las calorías totales según nivel de actividad
function calcularCaloriasTotales(bmr, nivelActividad) {
    const factores = {
        'sedentario': 1.2,
        'ligero': 1.375,
        'moderado': 1.55,
        'activo': 1.725
    };
    return bmr * factores[nivelActividad];
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);

        // Mostrar plan seleccionado si existe
        const planSeleccionado = getUrlParameter('plan');
        if (planSeleccionado) {
            const planInfo = document.createElement('div');
            planInfo.className = 'plan-info';
            planInfo.innerHTML = `
                <div class="selected-plan">
                    <h4>Plan Seleccionado</h4>
                    <p>${planSeleccionado.toUpperCase()}</p>
                </div>
            `;
            registerForm.insertBefore(planInfo, registerForm.firstChild);
        }
    }

    // Toggle password visibility - para todos los contenedores de mostrar/ocultar contraseña
    const togglePasswordWrappers = document.querySelectorAll('.password-toggle-wrapper');
    if (togglePasswordWrappers.length > 0) {
        togglePasswordWrappers.forEach(wrapper => {
            wrapper.addEventListener('click', togglePassword);
        });
    }

    // Botón de logout si existe
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});