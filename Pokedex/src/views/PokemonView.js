export class PokemonView {
  constructor() {
    this.pokedex = document.getElementById("pokedex") || document.getElementById("wishlist-container");
    this.loadingMessage = document.querySelector(".cargandoDatos");
    this.consoleElements = document.querySelectorAll(".input, .btnMenu");
    this.button = document.querySelector("#button");
    this.onPokemonSelect = null; // Callback para seleccionar Pokémon

    // Modal para mostrar detalles
    this.modal = document.createElement("div");
    this.modal.classList.add("pokemon-modal");
    this.modal.style.display = "none";
    document.body.appendChild(this.modal);

    // Botón de cerrar el modal
    this.closeModalButton = document.createElement("button");
    this.closeModalButton.innerText = "Cerrar";
    this.closeModalButton.addEventListener("click", () => {
      this.modal.style.display = "none";
    });
    this.modal.appendChild(this.closeModalButton);

    // Mensaje de no resultados
    this.noResultsMessage = document.createElement("p");
    this.noResultsMessage.classList.add("no-results-message");
    this.noResultsMessage.style.display = "none"; // Inicialmente oculto
  }

  // Método para establecer el callback
  setOnPokemonSelectCallback(callback) {
    this.onPokemonSelect = callback;
  }

  showLoading() {
    if (this.button) {
      this.button.style.display = "none";
    }
    this.loadingMessage.style.visibility = "visible";
    this.pokedex.style.visibility = "hidden";
  }

  hideLoading() {
    this.loadingMessage.style.visibility = "hidden";
    this.pokedex.style.visibility = "visible";
    this.showConsole();
  }

  showConsole() {
    this.consoleElements.forEach(element => {
      element.style.visibility = "visible";
    });
  }

  showNoResultsMessage(message) {
    this.noResultsMessage.textContent = message;
    this.noResultsMessage.style.display = "block";
  }

  hideNoResultsMessage() {
    this.noResultsMessage.style.display = "none";
  }

  displayPokemons(pokemons, isWishlist = false) {
    if (!this.pokedex) return;

    this.pokedex.innerHTML = "";
    if (pokemons.length === 0) {
      this.showNoResultsMessage(isWishlist ? "No hay Pokémon en tu lista de deseos." : "No se encontraron Pokémon para los filtros aplicados.");
    } else {
      this.hideNoResultsMessage();
      pokemons.forEach(pokemon => {
        const types = pokemon.pkm_type.map(t => t.type.name).join(" ");
        const pokemonCard = document.createElement("div");
        pokemonCard.classList.add("card");
        pokemonCard.id = `pokemon-${pokemon.id}`;
        pokemonCard.innerHTML = `
          <div class="cardTop">
            <div class="attack">Attack ${pokemon.attack}</div>
            <div class="price">${pokemon.price}€</div>
          </div>   
          <img src="${pokemon.pkm_back}" alt="${pokemon.name} back">
          <img class="front" src="${pokemon.pkm_front}" alt="${pokemon.name} front"><br>
          ${pokemon.id}. ${pokemon.name}<br>
          Weight ${pokemon.weight}<br>
          <div class="types">${types}</div>
        `;

        if (!isWishlist) {
          pokemonCard.addEventListener("click", () => {
            this.handlePokemonClick(pokemon, pokemonCard);
          });
        }

        this.pokedex.appendChild(pokemonCard);
      });
    }
  }

  handlePokemonClick(pokemon, pokemonCard) {
    // Cambiar estilo de la tarjeta para indicar selección
    if (!pokemonCard.classList.contains("selected")) {
      pokemonCard.classList.add("selected");
      pokemonCard.style.borderColor = "#FFD700";
      
      // Llamar al callback si existe
      if (this.onPokemonSelect) {
        this.onPokemonSelect(`pokemon-${pokemon.id}`);
      }
    } else {
      pokemonCard.classList.remove("selected");
      pokemonCard.style.borderColor = "";
    }

    // Mostrar detalles del Pokémon en un modal
    this.modal.style.display = "block";
    this.modal.innerHTML = `
      <h2>${pokemon.name}</h2>
      <p>Attack: ${pokemon.attack}</p>
      <p>Weight: ${pokemon.weight}</p>
      <p>Types: ${pokemon.pkm_type.map((t) => t.type.name).join(", ")}</p>
      <img src="${pokemon.pkm_front}" alt="${pokemon.name} front image">
    `;
    this.modal.appendChild(this.closeModalButton);
  }
}