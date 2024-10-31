// Exportamos por defecto la clase Pokemon
export class Pokemon {
  // Constructor que recibe como parámetro data que contiene los datos de los Pokemon que obtenemos desde la API
  constructor(data) {
    this.name = data.name; // Nombre del pokemon
    this.id = data.id; // Id del pokemon
    this.attack = this.getAttackFromStats(data);
    this.price = 0;
    this.weight = 0; // Pokemon peso
    this.pkm_front = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    this.pkm_back =`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`;
    this.pkm_type = data.types; // Tipo del pokemon (Devuelve un array)
  }

  getAttackFromStats(stats) {
    if (!stats || !Array.isArray(stats)) return 0;
    const attackStat = stats.find(stat => stat.stat.name === 'attack');
    return attackStat ? attackStat.base_stat : 0;
  }


}
