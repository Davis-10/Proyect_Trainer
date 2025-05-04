// Configuración de la API
const API_URL = 'http://localhost:5000/api';

// Función para obtener parámetros de la URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
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
            // Guardar el token en localStorage
            localStorage.setItem('token', data.token);
            // Redirigir al dashboard
            window.location.href = '/dashboard.html';
        } else {
            alert(data.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
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
        plan_seleccionado: planSeleccionado // Agregar el plan seleccionado
    };

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
            // Guardar el token en localStorage
            localStorage.setItem('token', data.token);
            // Redirigir al dashboard o proceso de pago
            window.location.href = planSeleccionado ? '/payment.html' : '/dashboard.html';
        } else {
            alert(data.message || 'Error en el registro');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

// Función para mostrar/ocultar contraseña
function togglePassword() {
    const passwordInput = document.querySelector('input[type="password"]');
    const toggleIcon = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
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
        
        // Si hay un plan seleccionado, mostrarlo en el formulario
        const planSeleccionado = getUrlParameter('plan');
        if (planSeleccionado) {
            const planInfo = document.createElement('div');
            planInfo.className = 'plan-info';
            planInfo.innerHTML = `<p>Plan seleccionado: ${planSeleccionado.toUpperCase()}</p>`;
            registerForm.insertBefore(planInfo, registerForm.firstChild);
        }
    }

    // Toggle password
    const togglePasswordBtn = document.querySelector('.toggle-password');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePassword);
    }
}); 