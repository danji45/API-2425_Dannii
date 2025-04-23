// --------- SWIPE PAGINA ---------
let likedPokemons = JSON.parse(localStorage.getItem('likedPokemons')) || [];

const likeButtons = document.querySelectorAll('.like-btn');
const dislikeButtons = document.querySelectorAll('.dislike-btn');

likeButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const card = event.target.closest('.pokemon-card');
    const pokemonData = JSON.parse(card.getAttribute('data-pokemon'));

    likedPokemons.push(pokemonData);
    localStorage.setItem('likedPokemons', JSON.stringify(likedPokemons));

    card.remove();
    checkNoMoreCards();
  });
});

dislikeButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const card = event.target.closest('.pokemon-card');
    card.remove();
    checkNoMoreCards();
  });
});

function checkNoMoreCards() {
  const cards = document.querySelectorAll('.pokemon-card');
  if (cards.length === 0) {
    document.querySelector('.no-more-cards').style.display = 'block';
  }
}

// --------- LIKED PAGINA ---------
document.addEventListener('DOMContentLoaded', () => {
  const likedGrid = document.querySelector('.liked-grid');
  if (!likedGrid) return;

  const storedPokemons = JSON.parse(localStorage.getItem('likedPokemons')) || [];

  if (storedPokemons.length > 0) {
    storedPokemons.forEach(pokemon => {
      createLikedCard(pokemon, likedGrid);
    });
  } else {
    document.querySelector('.empty-state').style.display = 'block';
  }
});

function createLikedCard(pokemon, container) {
  const card = document.createElement('div');
  card.className = `liked-card ${pokemon.types[0]}`;
  card.setAttribute('data-pokemon-id', pokemon.id);
  card.innerHTML = `
    <div class="liked-card-content">
      <h2>${capitalize(pokemon.name)}</h2>
      <div class="type-container">
        ${pokemon.types.map(type => `<span class="type ${type}">${capitalize(type)}</span>`).join('')}
      </div>
      <div class="Dcircle"></div>
      <div class="Dcircle"></div>
      <div class="Dcircle"></div>
      <div class="square-small">
        <a href="/pokemon/${pokemon.id}">
          <img src="${pokemon.sprite}" alt="${pokemon.name}">
        </a>
      </div>
      <button class="dislike-btn" data-id="${pokemon.id}">Remove</button>
    </div>
  `;
  container.appendChild(card);

  card.querySelector('.dislike-btn').addEventListener('click', (event) => {
    removeLikedPokemon(event.target.getAttribute('data-id'), card);
  });
}

function removeLikedPokemon(pokemonId, cardElement) {
  let updatedPokemons = JSON.parse(localStorage.getItem('likedPokemons')) || [];
  updatedPokemons = updatedPokemons.filter(pokemon => pokemon.id != pokemonId);
  localStorage.setItem('likedPokemons', JSON.stringify(updatedPokemons));
  cardElement.remove();

  if (updatedPokemons.length === 0) {
    document.querySelector('.empty-state').style.display = 'block';
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
