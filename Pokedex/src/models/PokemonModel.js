import { Pokemon } from "./Pokemon.js";

export class PokemonModel {
  constructor() {
    this.pokemons = [];
  }

  // Método para obtener los datos de un Pokémon desde la API
  async fetchPokemon(id) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      const data = await response.json();
      const pokemon = new Pokemon(data.id, data.name, data.types, data.stats);
      return pokemon;
    } catch (error) {
      console.error(`Error fetching Pokémon with ID ${id}: ${error}`);
      return null;
    }
  }

  // Cargar los Pokémon en el modelo
  async loadPokemons(limit = 151) {
    const promises = [];

    for (let i = 1; i <= limit; i++) {
      promises.push(this.fetchPokemon(i));
    }

    const pokemonList = await Promise.all(promises);
    this.pokemons = pokemonList
      .filter(pokemon => pokemon) // Filtra cualquier error de carga
      .map(pokemon => {
        pokemon.price = ((5 + pokemon.attack * (20 - 5)) / 100).toFixed(2);
        return pokemon;
      });

    return this.pokemons;
  }

  getAllPokemons() {
    return this.pokemons;
  }
}
