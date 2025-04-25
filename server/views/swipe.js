document.addEventListener("DOMContentLoaded", () => {
  const likeButtons = document.querySelectorAll(".like-btn");
  const dislikeButtons = document.querySelectorAll(".dislike-btn");

  let likedPokemons = JSON.parse(localStorage.getItem("likedPokemons")) || [];

  // LIKE knop
  likeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const card = event.currentTarget.closest(".pokemon-card");
      const pokemonData = JSON.parse(card.getAttribute("data-pokemon"));

      // Opslaan in localStorage
      likedPokemons.push(pokemonData);
      localStorage.setItem("likedPokemons", JSON.stringify(likedPokemons));

      // Forceer reflow en voeg swipe animatie toe
      void card.offsetWidth;
      card.classList.add("swipe-right");

      // Na animatie verwijderen + reset
      setTimeout(() => {
        card.remove();
        requestAnimationFrame(() => {
          resetTopCard();
          checkNoMoreCards();
        });
      }, 500);
    });
  });

  // DISLIKE knop
  dislikeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const card = event.currentTarget.closest(".pokemon-card");

      // Forceer reflow en voeg swipe animatie toe
      void card.offsetWidth;
      card.classList.add("swipe-left");

      // Na animatie verwijderen + reset
      setTimeout(() => {
        card.remove();
        requestAnimationFrame(() => {
          resetTopCard();
          checkNoMoreCards();
        });
      }, 500);
    });
  });

  // Zorgen dat juiste kaart bovenop ligt
  function resetTopCard() {
    const cards = Array.from(document.querySelectorAll(".pokemon-card"));

    // Draai om zodat de laatst toegevoegde (onderste in DOM) bovenop ligt
    cards.reverse().forEach((card, index) => {
      card.style.zIndex = index + 1;
    });
  }

  // Laat no-more-cards zien als alles weg is
  function checkNoMoreCards() {
    const cards = document.querySelectorAll(".pokemon-card");
    if (cards.length === 0) {
      document.querySelector(".no-more-cards").style.display = "block";
    }
  }

  // Initieel ook meteen juiste z-index toekennen bij opstart
  resetTopCard();
});
