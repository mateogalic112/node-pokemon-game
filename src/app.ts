import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import Controller from "./interfaces/controller.interface";

class App {
  public app: express.Application;
  public socketServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  public io: Server;
  public socketPort: number = 4000;
  public appPort: number = 5000;

  private ioServerConfig = {
    cors: {
      origin: "http://localhost:3000",
    },
  };

  constructor(controllers: Controller[]) {
    this.app = express();

    this.socketServer = http.createServer(this.app);
    this.io = new Server(this.socketServer, this.ioServerConfig);

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public appListen() {
    this.app.listen(this.appPort, () => {
      console.log(`App listening on the port ${this.appPort}`);
    });
  }

  public ioListen() {
    this.socketServer.listen(this.socketPort, () => {
      console.log(`App listening on the port ${this.socketPort}`);
    });

    let players = [];
    let initialPosition = 5;

    this.io.on("connection", (socket) => {
      console.log(`User connected ${socket.id}`);

      socket.on("join_game", (data) => {
        const { trainerName, pokemonId } = data;
        players.push({
          id: socket.id,
          trainerName,
          position: initialPosition,
          pokemonId,
        });

        socket.emit("game_players", { players });

        initialPosition++;
      });

      socket.on("update_player_position", (data) => {
        const newPlayers = players.map((player) => {
          if (player.trainerName === data.trainerName) {
            return { ...player, position: data.newPosition };
          }
          return player;
        });
        players = newPlayers;
        this.io.emit("game_players", { players });
      });

      socket.on("disconnect", () => {
        const newPlayers = players.filter((player) => player.id !== socket.id);
        players = newPlayers;
        console.log(`User disconnected ${socket.id}`);
        this.io.emit("game_players", { players });
      });
    });
  }
}

export default App;
