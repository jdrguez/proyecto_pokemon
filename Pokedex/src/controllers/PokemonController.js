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

    this.newDesireList = [];
    this.initEvents();
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
    document.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", () => this.selectPokemon(card.id));
    });

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
    if (!this.newDesireList.includes(cardId)) {
      this.newDesireList.push(cardId);
    }
  }

  showWishlistPrompt() {
    if (!this.newDesireList.length) {
      alert("No tienes Pokémon seleccionados en tu lista de deseos.");
      return;
    }

    const message = `¿Quieres añadir los siguientes Pokémon a la Lista de Deseos?\n${this.newDesireList.join(", ")}`;
    if (window.confirm(message)) {
      console.log("Guardando lista de deseos...");
      // Aquí puedes implementar la lógica para guardar la lista de deseos
    } else {
      this.newDesireList = [];
      console.log("Lista de deseos deseleccionada.");
    }
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
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    this.signup.registerUser(nickname, name, surname, email, age, city, password);
  }

  async bbddAction(action) {
    try {
      switch (action) {
        case "readAllPokemon":
          console.log(await this.model.readAllPokemons());
          break;
        case "addPokemon":
          // Implementa la lógica para añadir un Pokémon
          break;
        case "updatePokemon":
          // Implementa la lógica para actualizar un Pokémon
          break;
        case "deletePokemon":
          // Implementa la lógica para eliminar un Pokémon
          break;
        default:
          console.log("Acción no reconocida");
      }
    } catch (error) {
      console.error(`Error en acción de BBDD (${action}):`, error);
    }
  }

  async createPokemon(data) {
    return await this.db.create(data);
  }

  async updatePokemon(id, data) {
    return await this.db.update(id, data);
  }

  async deletePokemon(id) {
    return await this.db.delete(id);
  }
}
