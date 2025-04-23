const likeButtons = document.querySelectorAll('.like-btn');
const dislikeButtons = document.querySelectorAll('.dislike-btn');

likeButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const card = event.target.closest('.pokemon-card');
    card.classList.add('swipe-right');

    // Verwijder de kaart na de animatie
    setTimeout(() => {
      card.remove();
      checkNoMoreCards();
    }, 500);
  });
});

dislikeButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const card = event.target.closest('.pokemon-card');
    card.classList.add('swipe-left');

    // Verwijder de kaart na de animatie
    setTimeout(() => {
      card.remove();
      checkNoMoreCards();
    }, 500);
  });
});

// Extra: check of er nog kaarten zijn
function checkNoMoreCards() {
  const cards = document.querySelectorAll('.pokemon-card');
  if (cards.length === 0) {
    document.querySelector('.no-more-cards').style.display = 'block';
  }
}
