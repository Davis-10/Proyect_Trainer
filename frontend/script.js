document.addEventListener('DOMContentLoaded', function() {
    const planCards = document.querySelectorAll('.plan-card');

    planCards.forEach(card => {
        card.addEventListener('mouseover', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mouseout', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });

    const itemLink = document.querySelector('.item-link');
    itemLink.addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('#plans').scrollIntoView({ behavior: 'smooth' });
    });

    // Obtener todos los enlaces que apuntan a secciones con #
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignorar enlaces vacíos
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Manejar el botón específico de "Ir a Contacto"
    const scrollToContactBtn = document.getElementById('scroll-to-contact');
    if (scrollToContactBtn) {
        scrollToContactBtn.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

