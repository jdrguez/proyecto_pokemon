import { Pokemon } from "./Pokemon.js";

export class PokemonModel {
  constructor() {
    this.pokemons = [];
  }

  // Método para obtener los datos de un Pokémon desde la API
  async fetchPokemon(id) {
    try {
      // Realizar la petición a la API
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      
      // Verificar si la respuesta es correcta
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Convertir la respuesta a JSON
      const data = await response.json();

      // Crear un nuevo objeto Pokemon con los datos necesarios
      const pokemon = {
        id: data.id,
        name: data.name,
        pkm_type: data.types,
        attack: data.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0,
        weight: data.weight,
        pkm_front: data.sprites.front_default,
        pkm_back: data.sprites.back_default,
        stats: data.stats
      };

      // Calcular el precio basado en el ataque
      pokemon.price = this.calculatePrice(pokemon.attack);

      return pokemon;

    } catch (error) {
      console.error(`Error fetching Pokémon with ID ${id}:`, error);
      return null;
    }
  }

  // Método para calcular el precio del Pokémon
  calculatePrice(attack) {
    return ((5 + attack * (20 - 5)) / 100).toFixed(2);
  }

  // Método para cargar todos los Pokémon
  async loadPokemons(limit = 151) {
    // Si ya hemos cargado los Pokémon, no los volvemos a cargar
    if (this.pokemons.length > 0) return this.pokemons;

    try {
        const promises = [];
        for (let i = 1; i <= limit; i++) {
            promises.push(this.fetchPokemon(i));
        }
        const results = await Promise.all(promises);
        this.pokemons = results.filter(pokemon => pokemon !== null);
        return this.pokemons;
    } catch (error) {
        console.error("Error loading Pokémon:", error);
        throw error;
    }
}

  // Método para obtener todos los Pokémon cargados
  getAllPokemons() {
    return this.pokemons;
  }

  // Método para obtener un Pokémon por su ID
  getPokemonById(id) {
    return this.pokemons.find(pokemon => pokemon.id === id);
  }

  // Método para filtrar Pokémon por tipo
  filterByType(type) {
    return this.pokemons.filter(pokemon => 
      pokemon.pkm_type.some(t => t.type.name.toLowerCase() === type.toLowerCase())
    );
  }

  // Método para filtrar Pokémon por rango de ataque
  filterByAttackRange(minAttack, maxAttack) {
    return this.pokemons.filter(pokemon => 
      pokemon.attack >= minAttack && pokemon.attack <= maxAttack
    );
  }

  // Método para ordenar Pokémon por nombre
  sortByName(ascending = true) {
    return [...this.pokemons].sort((a, b) => {
      return ascending 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
  }

  // Método para ordenar Pokémon por ataque
  sortByAttack(ascending = true) {
    return [...this.pokemons].sort((a, b) => {
      return ascending 
        ? a.attack - b.attack
        : b.attack - a.attack;
    });
  }

  // Método para buscar Pokémon por nombre
  searchByName(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.pokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(term)
    );
  }
}