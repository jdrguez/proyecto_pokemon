import { PokemonModel } from "../models/PokemonModel.js";
import { PokemonView } from "../views/PokemonView.js";
import { Login } from "../views/Login.js";
import { Signup } from "../views/Singup.js";

export class PokemonController {
  constructor() {
    this.model = new PokemonModel();
    this.view = new PokemonView();
    this.login = new Login();
    this.signup = new Signup();

    this.newDesireList = JSON.parse(localStorage.getItem('wishlist') || '[]');
    this.initEvents();
    
    // Configura el callback para selección de Pokémon
    this.view.setOnPokemonSelectCallback(this.selectPokemon.bind(this));
    
    const verListaButton = document.querySelector("#btnVerLista");
    if (verListaButton) {
      verListaButton.addEventListener("click", this.redirectToWishlist.bind(this));
    }

    const addToWishlistButton = document.querySelector("#btnAgnadeListaDeseo");
    if (addToWishlistButton) {
      addToWishlistButton.addEventListener("click", this.handleAddToWishlist.bind(this));
    }
  }

  initEvents() {
    const button = document.querySelector("button");
    if (button) {
      button.addEventListener("click", () => this.init());
    }

    document.querySelectorAll(".btnBBDD").forEach(btn => {
      btn.addEventListener("click", () => this.bbddAction(btn.id));
    });

    const loginButton = this.login.form?.querySelector("#iniciar");
    if (loginButton) {
      loginButton.addEventListener("click", this.handleLogin.bind(this));
    }

    const signupButton = this.signup.form?.querySelector("#registrar");
    if (signupButton) {
      signupButton.addEventListener("click", this.handleSignup.bind(this));
    }
  }

  async init() {
    this.view.showLoading();
    try {
      await this.model.loadPokemons();
      this.view.hideLoading();
      this.view.displayPokemons(this.model.getAllPokemons());
      this.bindingEvents();
    } catch (error) {
      console.error("Error al cargar Pokémon:", error);
      this.view.showError("Error al cargar Pokémon. Intenta nuevamente.");
    }
  }

  bindingEvents() {
    this.filterType = document.querySelector("#filtroTipo");
    this.filterGeneration = document.querySelector("#filtroGeneracion");
    this.filterPeso = document.querySelector("#filtroPeso");
    this.filterScore = document.querySelector("#filtroPuntuacion");
    this.searchInput = document.querySelector("#searchInput");
    this.sortSelect = document.querySelector("#sortSelect");

    const addListeners = (element, event) => {
      if (element) {
        element.addEventListener(event, () => this.applyFilters());
      }
    };

    addListeners(this.filterType, "input");
    addListeners(this.filterGeneration, "input");
    addListeners(this.filterPeso, "input");
    addListeners(this.filterScore, "input");
    addListeners(this.searchInput, "input");
    addListeners(this.sortSelect, "change");

    const wishlistButton = document.querySelector("#btnAgnadeListaDeseo");
    if (wishlistButton) {
      wishlistButton.addEventListener("click", this.showWishlistPrompt.bind(this));
    }
  }

  applyFilters() {
    let filteredPokemons = this.model.getAllPokemons();

    if (this.filterType && this.filterType.value) {
      filteredPokemons = this.model.filterByType(this.filterType.value.toLowerCase());
    }

    if (this.filterGeneration && this.filterGeneration.value) {
      const generationValue = parseInt(this.filterGeneration.value);
      filteredPokemons = filteredPokemons.filter(pokemon => this.getGeneration(pokemon.id) === generationValue);
    }

    if (this.filterPeso && this.filterPeso.value) {
      const pesoValue = parseFloat(this.filterPeso.value);
      filteredPokemons = filteredPokemons.filter(pokemon => pokemon.weight >= pesoValue);
    }

    if (this.filterScore && this.filterScore.value) {
      const scoreValue = parseFloat(this.filterScore.value);
      filteredPokemons = this.model.filterByAttackRange(scoreValue, Infinity);
    }

    if (this.searchInput && this.searchInput.value) {
      filteredPokemons = this.model.searchByName(this.searchInput.value.toLowerCase());
    }

    if (this.sortSelect && this.sortSelect.value) {
      switch (this.sortSelect.value) {
        case "nameAsc":
          filteredPokemons = this.model.sortByName(true);
          break;
        case "nameDesc":
          filteredPokemons = this.model.sortByName(false);
          break;
        case "attackAsc":
          filteredPokemons = this.model.sortByAttack(true);
          break;
        case "attackDesc":
          filteredPokemons = this.model.sortByAttack(false);
          break;
      }
    }

    this.view.displayPokemons(filteredPokemons);
  }

  getGeneration(pokemonId) {
    if (pokemonId <= 151) return 1;
    if (pokemonId <= 251) return 2;
    if (pokemonId <= 386) return 3;
    if (pokemonId <= 493) return 4;
    if (pokemonId <= 649) return 5;
    if (pokemonId <= 721) return 6;
    if (pokemonId <= 809) return 7;
    if (pokemonId <= 905) return 8;
    return 9;
  }

  selectPokemon(cardId) {
    const pokemonId = cardId.replace('pokemon-', '');
    const index = this.newDesireList.indexOf(pokemonId);
    
    if (index === -1) {
      this.newDesireList.push(pokemonId);
      console.log(`Pokemon ${pokemonId} añadido a la lista de deseos`);
    } else {
      this.newDesireList.splice(index, 1);
      console.log(`Pokemon ${pokemonId} eliminado de la lista de deseos`);
    }
    
  }

  showWishlistPrompt() {
    if (!this.newDesireList.length) {
      alert("No tienes Pokémon seleccionados en tu lista de deseos.");
      return;
    }

    // Crear un mensaje más legible con los nombres de los Pokémon
    const selectedPokemons = this.newDesireList.map(id => {
      const pokemon = this.model.getPokemonById(parseInt(id));
      return pokemon ? pokemon.name : id;
    });

    const message = `¿Quieres confirmar tu Lista de Deseos con los siguientes Pokémon?\n${selectedPokemons.join(", ")}`;
    
    if (window.confirm(message)) {
      console.log("Lista de deseos guardada");
      alert("Lista de deseos guardada correctamente. Puedes verla haciendo clic en 'Ver lista de deseos'.");
    } else {
      this.newDesireList = [];
      localStorage.removeItem('wishlist');
      // Actualizar la vista para mostrar que se han deseleccionado los Pokémon
      document.querySelectorAll('.card.selected').forEach(card => {
        card.classList.remove('selected');
        card.style.borderColor = '';
      });
      console.log("Lista de deseos deseleccionada.");
      alert("La lista de deseos ha sido borrada.");
    }
  }

  handleAddToWishlist() {
    if (this.newDesireList.length === 0) {
      alert("No has seleccionado ningún Pokémon para añadir a la lista de deseos.");
      return;
    }

    const selectedPokemons = this.newDesireList.map(id => {
      const pokemon = this.model.getPokemonById(parseInt(id));
      return pokemon ? pokemon.name : id;
    });

    const message = `¿Quieres añadir los siguientes Pokémon a la Lista de Deseos?\n${selectedPokemons.join(", ")}`;
    
    if (window.confirm(message)) {
      localStorage.setItem('wishlist', JSON.stringify(this.newDesireList));
      alert("Pokémon añadidos a la lista de deseos. Puedes verla haciendo clic en 'Ver lista de deseos'.");
      
      // Limpiamos la selección visual
      document.querySelectorAll('.card.selected').forEach(card => {
        card.classList.remove('selected');
        card.style.borderColor = '';
      });
    } else {
      // Si el usuario cancela, no hacemos nada con la lista
      console.log("Operación cancelada por el usuario.");
    }
  }






  redirectToWishlist() {
    window.location.href = 'wishlist.html';
  }

  handleLogin(event) {
    event.preventDefault();
    const email = this.login.form?.querySelector("#loginUsername")?.value;
    const password = this.login.form?.querySelector("#loginPassword")?.value;
    if (email && password) {
      this.login.manageacount(email, password);
    } else {
      console.error("Campos de login no encontrados");
    }
  }

  handleSignup(event) {
    event.preventDefault();
    const fields = ["#registerUsername", "#name", "#fullName", "#email", "#age", "#city", "#registerPassword", "#confirmPassword"];
    const values = fields.map(id => document.querySelector(id)?.value);
    const [nickname, name, surname, email, age, city, password, confirmPassword] = values;

    if (values.some(v => v === undefined)) {
      console.error("Algunos campos de registro no fueron encontrados");
    }
  }
}