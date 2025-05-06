// Constantes para los planes
const PLAN_DURATIONS = {
    'basic': '1 mes',
    'goup': '3 meses',
    'expert': '6 meses'
};

// Función para cargar los datos del usuario
async function loadUserData() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = 'auth/login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Si hay un error de autorización, redirigir al login
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'auth/login.html';
                return;
            }
            throw new Error('Error al cargar datos del usuario');
        }

        const userData = await response.json();
        updateDashboard(userData);
    } catch (error) {
        console.error('Error:', error);
        // Usar los datos almacenados en localStorage como respaldo
        if (user) {
            updateDashboard(user);
        }
    }
}

// Función para actualizar el dashboard con los datos del usuario
function updateDashboard(userData) {
    // Actualizar nombre de usuario
    document.getElementById('userName').textContent = userData.nombre;
    
    // Actualizar información personal
    document.getElementById('profileName').textContent = userData.nombre;
    document.getElementById('profileEmail').textContent = userData.email;
    document.getElementById('profileGender').textContent = userData.genero;
    
    // Calcular edad
    const birthDate = new Date(userData.fecha_nacimiento);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    document.getElementById('profileAge').textContent = `${age} años`;
    
    // Actualizar estadísticas físicas
    document.getElementById('profileWeight').textContent = userData.datos_fisicos.peso;
    document.getElementById('profileHeight').textContent = userData.datos_fisicos.altura;
    document.getElementById('profileIMC').textContent = userData.datos_fisicos.imc;
    
    // Calcular calorías diarias
    const calories = calcularCaloriasTotales(
        calcularCaloriasBase(
            userData.datos_fisicos.peso,
            userData.datos_fisicos.altura,
            age,
            userData.genero
        ),
        userData.datos_fisicos.nivel_actividad
    );
    document.getElementById('profileCalories').textContent = Math.round(calories);
    
    // Actualizar información del plan
    const planName = userData.plan_seleccionado ? 
        userData.plan_seleccionado.charAt(0).toUpperCase() + userData.plan_seleccionado.slice(1) :
        'No seleccionado';
    document.getElementById('profilePlan').textContent = planName;
    document.getElementById('profileDuration').textContent = PLAN_DURATIONS[userData.plan_seleccionado] || '-';
    document.getElementById('profileGoal').textContent = formatearObjetivo(userData.objetivos.principal);
    document.getElementById('profileActivity').textContent = formatearNivelActividad(userData.datos_fisicos.nivel_actividad);
}

// Función para calcular calorías base (BMR)
function calcularCaloriasBase(peso, altura, edad, genero) {
    if (genero === 'masculino') {
        return 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad);
    } else {
        return 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
    }
}

// Función para calcular calorías totales según nivel de actividad
function calcularCaloriasTotales(bmr, nivelActividad) {
    const factores = {
        'sedentario': 1.2,
        'ligero': 1.375,
        'moderado': 1.55,
        'activo': 1.725
    };
    return bmr * factores[nivelActividad];
}

// Función para formatear el objetivo
function formatearObjetivo(objetivo) {
    const objetivos = {
        'perdida_peso': 'Pérdida de Peso',
        'ganancia_muscular': 'Ganancia Muscular',
        'tonificacion': 'Tonificación',
        'resistencia': 'Mejorar Resistencia'
    };
    return objetivos[objetivo] || objetivo;
}

// Función para formatear el nivel de actividad
function formatearNivelActividad(nivel) {
    const niveles = {
        'sedentario': 'Sedentario',
        'ligero': 'Actividad Ligera',
        'moderado': 'Actividad Moderada',
        'activo': 'Muy Activo'
    };
    return niveles[nivel] || nivel;
}

// Manejar navegación del sidebar
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        
        // Ocultar todas las secciones
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Mostrar la sección seleccionada
        document.getElementById(targetId).classList.remove('hidden');
        
        // Actualizar clase activa
        document.querySelectorAll('.sidebar-nav a').forEach(a => {
            a.classList.remove('active');
        });
        link.classList.add('active');
    });
});

// Manejar cierre de sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', loadUserData);