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
});