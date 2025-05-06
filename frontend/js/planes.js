// Configuración de los planes
const PLANES = {
    basico: {
        nombre: 'Plan Basic',
        precio: 29.99,
        duracion: '1 mes',
        descripcion: 'Acceso a programa de entrenamiento personalizado durante 1 mes'
    },
    intermedio: {
        nombre: 'Plan GoUp',
        precio: 49.99,
        duracion: '3 meses',
        descripcion: 'Acceso a programa de entrenamiento personalizado durante 3 meses'
    },
    premium: {
        nombre: 'Plan Expert',
        precio: 79.99,
        duracion: '6 meses',
        descripcion: 'Acceso a programa de entrenamiento personalizado durante 6 meses'
    }
};

// Función para manejar la selección de plan
function handlePlanSelection(plan) {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (token) {
        // Si está autenticado, guardar el plan seleccionado y redirigir al pago
        const user = JSON.parse(localStorage.getItem('user'));
        user.plan_seleccionado = plan;
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'payment.html';
    } else {
        // Si no está autenticado, redirigir al registro con el plan seleccionado
        window.location.href = `auth/register.html?plan=${plan}`;
    }
}