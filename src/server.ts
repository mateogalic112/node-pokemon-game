import express from "express";
const app = express();
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let players = [];
let initialPosition = 5;

io.on("connection", (socket) => {
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
    io.emit("game_players", { players });
  });

  socket.on("disconnect", () => {
    const newPlayers = players.filter((player) => player.id !== socket.id);
    players = newPlayers;
    console.log(`User disconnected ${socket.id}`);
    io.emit("game_players", { players });
  });
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

server.listen(4000, () => "Server is running on port 4000");
