interface PokemonStat {
  amount: number;
  name: string;
}

interface PokemonMove {
  damage: number;
  name: string;
}

interface PokemonType {
  name: string;
  url: string;
}

interface Pokemon {
  id: number;
  height: number;
  weight: number;
  name: string;
  image: string;
  stats: PokemonStat[];
  moves: PokemonMove[];
  types: PokemonType[];
  hp: number;
}

export default Pokemon;
