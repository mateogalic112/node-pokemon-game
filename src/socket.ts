import express from "express";
import http from "http";
import { Server } from "socket.io";

class PokemonSocket {
  public socketServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  public io: Server;
  public socketPort: number = 4000;

  private ioServerConfig = {
    cors: {
      origin: "http://localhost:3000",
    },
  };

  constructor(app: express.Application) {
    this.socketServer = http.createServer(app);
    this.io = new Server(this.socketServer, this.ioServerConfig);
  }

  public ioListen() {
    this.socketServer.listen(this.socketPort, () => {
      console.log(`Socket listening on the port ${this.socketPort}`);
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

export default PokemonSocket;
