// Definición de precios por plan
const PLAN_PRICES = {
    'basic': 29.99,
    'goup': 49.99,
    'expert': 79.99
};

const PLAN_DURATIONS = {
    'basic': '1 mes',
    'goup': '3 meses',
    'expert': '6 meses'
};

// Función para formatear precio
const formatPrice = (price) => `$${price.toFixed(2)}`;

// Cargar los detalles del plan seleccionado
document.addEventListener('DOMContentLoaded', () => {
    // Obtener datos del usuario del localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.plan_seleccionado) {
        window.location.href = 'planes.html';
        return;
    }

    const plan = user.plan_seleccionado.toLowerCase();
    const price = PLAN_PRICES[plan];
    const duration = PLAN_DURATIONS[plan];

    // Actualizar la información en la página
    document.getElementById('planName').textContent = plan.charAt(0).toUpperCase() + plan.slice(1);
    document.getElementById('planPrice').textContent = formatPrice(price);
    document.getElementById('summaryPlan').textContent = plan.charAt(0).toUpperCase() + plan.slice(1);
    document.getElementById('summaryDuration').textContent = duration;
    document.getElementById('summaryTotal').textContent = formatPrice(price);

    // Configurar el formulario de pago
    const form = document.getElementById('paymentForm');
    form.addEventListener('submit', handlePayment);
});

// Validar y formatear número de tarjeta
document.getElementById('cardNumber').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16);
});

// Validar y formatear fecha de expiración
document.getElementById('expiryDate').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

// Validar y formatear CVV
document.getElementById('cvv').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
});

// Manejar el envío del formulario de pago
async function handlePayment(e) {
    e.preventDefault();

    const button = e.target.querySelector('button');
    button.disabled = true;
    button.textContent = 'Procesando...';

    try {
        // Simular procesamiento de pago
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Guardar el plan seleccionado en localStorage
        const plan = JSON.parse(localStorage.getItem('selectedPlan'));
        localStorage.setItem('paymentCompleted', 'true');
        
        // Mostrar mensaje de éxito
        alert('¡Pago procesado con éxito! Por favor, inicia sesión para acceder a tu plan.');
        
        // Redirigir al login
        window.location.href = 'auth/login.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
        button.disabled = false;
        button.textContent = 'Confirmar Pago';
    }
}