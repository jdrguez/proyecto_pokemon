import ConectToFirebase from "../models/conectToFireStore.js";
import { PokemonModel } from "../models/PokemonModel.js";
import { PokemonView } from "../views/PokemonView.js";
import { Login } from "../views/Login.js";
import { Signup } from "../views/Singup.js";

export class PokemonController {
  constructor() {
    this.db = new ConectToFirebase();
    this.model = new PokemonModel();
    this.view = new PokemonView();
    this.login = new Login();
    this.signup = new Signup();

    this.pokemonsFiltered = [];
    this.newDesireList = [];
    this.initEvents();
  }

  initEvents() {
    document.querySelector("button").addEventListener("click", () => this.init());
    document.querySelectorAll(".btnBBDD").forEach(btn => {
      btn.addEventListener("click", () => this.bbddAction(btn.id));
    });

    this.login.form.querySelector("#iniciar").addEventListener("click", this.handleLogin.bind(this));
    this.signup.form.querySelector("#registrar").addEventListener("click", this.handleSignup.bind(this));
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

  async bindingEvents() {
    this.filterType = document.querySelector("#filtroTipo");
    this.filterGeneration = document.querySelector("#filtroGeneracion");
    this.filterScore = document.querySelector("#filtroPuntuacion");

    // Asignar eventos a cada filtro
    this.filterType.addEventListener("input", () => this.applyFilters());
    this.filterGeneration.addEventListener("input", () => this.applyFilters());
    this.filterScore.addEventListener("input", () => this.applyFilters());

    document.querySelector("#btnAgnadeListaDeseo").addEventListener("click", this.showWishlistPrompt.bind(this));

    document.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", () => this.selectPokemon(card.id));
    });
  }

  // Login Handler
  handleLogin(event) {
    event.preventDefault();
    const email = this.login.form.querySelector("#loginUsername").value;
    const password = this.login.form.querySelector("#loginPassword").value;
    this.login.manageacount(email, password);
  }

  // Signup Handler
  handleSignup(event) {
    event.preventDefault();
    const fields = ["#registerUsername", "#name", "#fullName", "#email", "#age", "#city", "#registerPassword", "#confirmPassword"];
    const [nickname, name, surname, email, age, city, password, confirmPassword] = fields.map(id => document.querySelector(id).value);

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    this.signup.registerUser(nickname, name, surname, email, age, city, password);
  }

  applyFilters() {
    const typeValue = this.filterType.value;
    const generationValue = this.filterGeneration.value;
    const scoreValue = parseFloat(this.filterScore.value);

    this.pokemonsFiltered = this.model.getAllPokemons().filter(pokemon => {
      const matchesType = typeValue ? pokemon.types.some(type => type.name.includes(typeValue)) : true;
      const matchesGeneration = generationValue ? this.getGeneration(pokemon.id) === parseInt(generationValue) : true;
      const matchesScore = scoreValue ? pokemon.totalScore >= scoreValue : true;
      
      return matchesType && matchesGeneration && matchesScore;
    });

    this.view.displayPokemons(this.pokemonsFiltered.length ? this.pokemonsFiltered : []);
    if (!this.pokemonsFiltered.length) {
      this.view.showNoResultsMessage("No se encontraron Pokémon para los filtros aplicados.");
    }
  }

  getGeneration(pokemonId) {
    if (pokemonId <= 151) return 1;  // Generación 1
    if (pokemonId <= 251) return 2;  // Generación 2
    if (pokemonId <= 386) return 3;  // Generación 3
    // Puedes expandir para otras generaciones...
    return 0;
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
      this.saveWishlist();
    } else {
      this.newDesireList = [];
      console.log("Lista de deseos deseleccionada.");
    }
  }

  async saveWishlist() {
    try {
      const wishlist = this.newDesireList.map(id => ({ pokemonId: id }));
      await this.db.create({ wishlist });
      alert("Lista de deseos guardada con éxito.");
    } catch (error) {
      console.error("Error al guardar la lista de deseos:", error);
      alert("Error al guardar la lista de deseos.");
    }
  }

  async bbddAction(action) {
    try {
      switch (action) {
        case "readAllPokemon":
          console.log(await this.db.readAll());
          break;
        case "addPokemon":
          await this.createPokemon({ tipo: "Iron", nombre: "Fixy" });
          break;
        case "updatePokemon":
          await this.updatePokemon("dJEvAx4dTIUY9IOeoy7E", { tipo: "Water", nombre: "Darum" });
          break;
        case "deletePokemon":
          await this.deletePokemon("PezyN0gwr0vzXhBApCxU");
          break;
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
