import App from "./app";
import PokemonController from "./pokemon/pokemon";
import PokeTrainerController from "./pokeTrainer/pokeTrainer";
import PokemonSocket from "./socket";

const app = new App([new PokeTrainerController(), new PokemonController()]);
const pokemonSocket = new PokemonSocket(app.getApp());

app.appListen();
pokemonSocket.ioListen();
