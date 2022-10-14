import App from "./app";
import PokemonController from "./pokemon/pokemon";
import PokeTrainerController from "./pokeTrainer/pokeTrainer";

const app = new App([new PokeTrainerController(), new PokemonController()]);
app.appListen();
app.ioListen();
