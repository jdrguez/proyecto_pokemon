// src/views/WishlistView.js
import { PokemonModel } from "../models/PokemonModel.js";

export class WishlistView {
    constructor() {
        this.wishlistTable = document.getElementById("wishlistTable").getElementsByTagName('tbody')[0];
        this.backButton = document.getElementById("backToPokedex");
        this.backButton.addEventListener("click", () => {
            window.location.href = "pokedex.html";
        });
        this.model = new PokemonModel();
        this.loadWishlist();
    }

    async loadWishlist() {
        // Cargar la lista de deseos desde el almacenamiento local
        const wishlistIds = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Asegurarse de que los Pokémon estén cargados
        await this.model.loadPokemons();

        // Obtener los Pokémon de la lista de deseos
        const wishlistPokemons = wishlistIds.map(id => this.model.getPokemonById(id)).filter(pokemon => pokemon);

        // Mostrar la lista de deseos
        this.displayWishlist(wishlistPokemons);
    }

    displayWishlist(pokemonList) {
        // Limpia la tabla antes de mostrar los Pokémon
        this.wishlistTable.innerHTML = "";

        pokemonList.forEach(pokemon => {
            const row = this.wishlistTable.insertRow();
            row.insertCell(0).textContent = pokemon.id;
            row.insertCell(1).textContent = pokemon.name;
            row.insertCell(2).textContent = pokemon.weight;
            row.insertCell(3).textContent = pokemon.attack;
        });
    }
}

// Inicializar la vista cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new WishlistView();
});