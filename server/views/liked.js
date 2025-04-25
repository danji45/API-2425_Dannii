document.addEventListener("DOMContentLoaded", () => {
  const likedGrid = document.querySelector(".liked-grid");
  if (!likedGrid) return;

  const storedPokemons = JSON.parse(localStorage.getItem("likedPokemons")) || [];

  if (storedPokemons.length > 0) {
    storedPokemons.forEach((pokemon) => {
      createLikedCard(pokemon, likedGrid);
    });
  } else {
    document.querySelector(".empty-state").style.display = "block";
  }
});

function createLikedCard(pokemon, container) {
  const card = document.createElement("div");
  card.className = `liked-card ${pokemon.types[0]}`;
  card.setAttribute("data-pokemon-id", pokemon.id);
  card.innerHTML = `
    <div class="liked-card-content">
      <h2>${capitalize(pokemon.name)}</h2>
      <div class="type-container">
        ${pokemon.types.map((type) => `<span class="type ${type}">${capitalize(type)}</span>`).join("")}
      </div>
      <div class="square-small">
        <a href="/pokemon/${pokemon.id}">
          <img src="${pokemon.sprite}" alt="${pokemon.name}">
        </a>
      </div>
      <button class="remove-btn" data-id="${pokemon.id}">Remove</button>
    </div>
  `;
  container.appendChild(card);

  card.querySelector(".remove-btn").addEventListener("click", (event) => {
    removeLikedPokemon(event.target.getAttribute("data-id"), card);
  });
}

function removeLikedPokemon(pokemonId, cardElement) {
  let updatedPokemons = JSON.parse(localStorage.getItem("likedPokemons")) || [];
  updatedPokemons = updatedPokemons.filter((pokemon) => pokemon.id != pokemonId);
  localStorage.setItem("likedPokemons", JSON.stringify(updatedPokemons));
  cardElement.remove();

  if (updatedPokemons.length === 0) {
    document.querySelector(".empty-state").style.display = "block";
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
