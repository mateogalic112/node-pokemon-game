import { App } from "app";
import { AuthController } from "auth/auth.controller";
import { PokemonController } from "pokemon/pokemon.controller";
import { TrainerController } from "trainers/trainers.controller";
import { PokemonSocket } from "socket";
import { TrainerService } from "trainers/trainers.service";
import pool from "config/database";
import { AuthService } from "auth/auth.service";
import { PokemonService } from "pokemon/pokemon.service";

const app = new App([
  new AuthController(new AuthService(pool)),
  new TrainerController(new TrainerService(pool)),
  new PokemonController(new PokemonService(pool))
]);
const pokemonSocket = new PokemonSocket(app.getApp());

app.listen();
pokemonSocket.ioListen();
