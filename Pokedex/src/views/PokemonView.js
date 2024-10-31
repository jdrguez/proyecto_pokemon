export class PokemonView {
  constructor() {
    this.pokedex = document.getElementById("pokedex");
    this.loadingMessage = document.querySelector(".cargandoDatos");
    this.consoleElements = document.querySelectorAll(".input, .btnMenu");

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
  }

  showLoading() {
    document.querySelector("#button").style.visibility = "hidden";
    this.loadingMessage.style.visibility = "visible";
    this.pokedex.style.visibility = "hidden";
  }

  hideLoading() {
    this.loadingMessage.style.visibility = "hidden";
    this.pokedex.style.visibility = "visible";
  }

  showConsole() {
    this.consoleElements.forEach((e) => (e.style.visibility = "visible"));
  }

  displayPokemons(pokemons) {
    this.pokedex.innerHTML = "";
    pokemons.forEach((pokemon) => {
      let types = pokemon.pkm_type.map((t) => t.type.name).join(" ");
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

      // Añadir EventListener de click
      pokemonCard.addEventListener("click", () => {
        console.log(`Clicked on ${pokemon.name}`);
        this.handlePokemonClick(pokemon, pokemonCard);
      });

      this.pokedex.appendChild(pokemonCard);
    });
  }

  // Manejo avanzado del clic en el Pokémon
  handlePokemonClick(pokemon, pokemonCard) {
    // Cambiar estilo de la tarjeta para indicar selección
    if (!pokemonCard.classList.contains("selected")) {
      pokemonCard.classList.add("selected");
      pokemonCard.style.borderColor = "#FFD700"; // Cambia el color del borde
    } else {
      pokemonCard.classList.remove("selected");
      pokemonCard.style.borderColor = ""; // Restablece el color original
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

    // Llamada para añadir el Pokémon a la lista de deseos
    this.addToWishlist(pokemon);
  }

  // Método para añadir Pokémon a la lista de deseos
  addToWishlist(pokemon) {
    const isConfirmed = window.confirm(`¿Quieres añadir a ${pokemon.name} a la lista de deseos?`);
    if (isConfirmed) {
      console.log(`${pokemon.name} añadido a la lista de deseos.`);
      // Aquí puedes implementar lógica para enviar el Pokémon al controlador y manejar la lista de deseos
    }
  }
}
