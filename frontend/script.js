document.addEventListener('DOMContentLoaded', function() {
    // Función para animar elementos cuando son visibles en el viewport
    function animateOnScroll() {
        // Elementos con animación fade-up
        const fadeUpElements = document.querySelectorAll('.animate-fade-up');

        // Elementos con animación slide-right
        const slideRightElements = document.querySelectorAll('.animate-slide-right');

        // Elementos con animación slide-left
        const slideLeftElements = document.querySelectorAll('.animate-slide-left');

        // Elementos con animación zoom-in
        const zoomInElements = document.querySelectorAll('.animate-zoom-in');

        // Tarjetas de planes (animación especial)
        const planCards = document.querySelectorAll('.plan-card');

        // Función para verificar si un elemento está en el viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
                rect.bottom >= 0
            );
        }

        // Animar elementos fade-up
        fadeUpElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                // Obtener el delay si existe
                const delay = element.getAttribute('data-delay') || 0;

                // Aplicar la animación con el delay
                setTimeout(() => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(40px)';
                    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                    // Forzar un reflow para que la transición funcione
                    void element.offsetWidth;

                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.classList.add('animated');
                }, delay);
            }
        });

        // Animar elementos slide-right
        slideRightElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.style.opacity = '0';
                element.style.transform = 'translateX(-40px)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                // Forzar un reflow para que la transición funcione
                void element.offsetWidth;

                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                element.classList.add('animated');
            }
        });

        // Animar elementos slide-left
        slideLeftElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.style.opacity = '0';
                element.style.transform = 'translateX(40px)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                // Forzar un reflow para que la transición funcione
                void element.offsetWidth;

                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                element.classList.add('animated');
            }
        });

        // Animar elementos zoom-in
        zoomInElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.style.opacity = '0';
                element.style.transform = 'scale(0.9)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                // Forzar un reflow para que la transición funcione
                void element.offsetWidth;

                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                element.classList.add('animated');
            }
        });

        // Animar tarjetas de planes
        planCards.forEach(card => {
            if (isElementInViewport(card) && !card.classList.contains('animated')) {
                // Obtener el delay si existe
                const delay = card.getAttribute('data-delay') || 0;

                // Aplicar la animación con el delay
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(40px)';
                    card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                    // Forzar un reflow para que la transición funcione
                    void card.offsetWidth;

                    card.style.opacity = '1';
                    card.style.transform = card.classList.contains('featured') ? 'scale(1.05)' : 'translateY(0)';
                    card.classList.add('animated');
                }, delay);

                // Agregar eventos de hover
                card.addEventListener('mouseover', () => {
                    if (card.classList.contains('featured')) {
                        card.style.transform = 'scale(1.05) translateY(-10px)';
                    } else {
                        card.style.transform = 'translateY(-10px)';
                    }
                    card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
                    card.style.borderColor = 'var(--color-accent)';
                });

                card.addEventListener('mouseout', () => {
                    if (card.classList.contains('featured')) {
                        card.style.transform = 'scale(1.05)';
                    } else {
                        card.style.transform = 'translateY(0)';
                    }
                    card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
                    card.style.borderColor = card.classList.contains('featured') ? 'var(--color-accent)' : 'var(--color-secondary)';
                });
            }
        });
    }

    // Inicializar los elementos con opacidad 0
    const allAnimatedElements = document.querySelectorAll('.animate-fade-up, .animate-slide-right, .animate-slide-left, .animate-zoom-in, .plan-card');
    allAnimatedElements.forEach(element => {
        element.style.opacity = '0';
    });

    // Ejecutar la animación al cargar la página y al hacer scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Navegación suave para enlaces internos
    const itemLinks = document.querySelectorAll('.item-link');
    itemLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
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

