//cu local storage

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const t = 100; 
    let delay = 0;

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('show');
        }, delay);
        delay += t;
    });
});
