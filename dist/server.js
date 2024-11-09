var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_cookie_parser = __toESM(require("cookie-parser"));

// src/middleware/errorMiddleware.ts
function errorMiddleware(error, request, response, next) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  response.status(status).send({
    status,
    message
  });
}
var errorMiddleware_default = errorMiddleware;

// src/config/database.ts
var import_pg = require("pg");

// src/config/env.ts
var import_dotenv = require("dotenv");
var import_envalid = require("envalid");
(0, import_dotenv.config)();
var env = (0, import_envalid.cleanEnv)(process.env, {
  POSTGRES_USER: (0, import_envalid.str)(),
  POSTGRES_PASSWORD: (0, import_envalid.str)(),
  POSTGRES_HOST: (0, import_envalid.str)(),
  POSTGRES_PORT: (0, import_envalid.port)({ default: 5432 }),
  POSTGRES_DB: (0, import_envalid.str)(),
  POKE_API_URL: (0, import_envalid.url)(),
  JWT_SECRET: (0, import_envalid.str)()
});

// src/config/database.ts
var pool = new import_pg.Pool({
  host: env.POSTGRES_HOST,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  port: env.POSTGRES_PORT,
  idleTimeoutMillis: 3e4
});
var database_default = pool;

// src/db/seed.ts
var import_bcrypt = __toESM(require("bcrypt"));
async function createTables() {
  try {
    await database_default.query(`
        CREATE TABLE IF NOT EXISTS trainers (
          id SERIAL PRIMARY KEY,
          email VARCHAR(320) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name VARCHAR(100),
          pokeballs INTEGER DEFAULT 10
        );
      `);
    await database_default.query(`
        CREATE TABLE IF NOT EXISTS pokemons (
          id SERIAL PRIMARY KEY,
          pokemon_id INTEGER UNIQUE NOT NULL,
          hp INTEGER DEFAULT 100,
          trainer_id INTEGER REFERENCES trainers(id) ON DELETE SET NULL
        );
      `);
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}
var initializeDatabase = async () => {
  try {
    await createTables();
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

// src/app.ts
var App = class {
  constructor(controllers) {
    this.appPort = 5e3;
    this.app = (0, import_express.default)();
    initializeDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }
  initializeMiddlewares() {
    this.app.use(
      (0, import_cors.default)({
        credentials: true,
        origin: "http://localhost:3000"
      })
    );
    this.app.use(import_express.default.json());
    this.app.use((0, import_cookie_parser.default)());
  }
  initializeErrorHandling() {
    this.app.use(errorMiddleware_default);
  }
  initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }
  getApp() {
    return this.app;
  }
  appListen() {
    this.app.listen(this.appPort, () => {
      console.log(`App listening on the port ${this.appPort}`);
    });
  }
};
var app_default = App;

// src/auth/auth.controller.ts
var import_express2 = require("express");

// src/middleware/authMiddleware.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));

// src/exceptions/http.error.ts
var HttpError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }
};

// src/exceptions/unauthorized.error.ts
var UnauthorizedError = class extends HttpError {
  constructor(message) {
    super(401, message || "Unauthorized");
  }
};

// src/middleware/authMiddleware.ts
async function authMiddleware(request, _, next) {
  const token = request.cookies.Authentication;
  if (!token) return next(new UnauthorizedError());
  const decoded = import_jsonwebtoken.default.verify(token, env.JWT_SECRET);
  if (!decoded._id) return next(new UnauthorizedError());
  try {
    const result = await database_default.query("SELECT id FROM trainers WHERE id = $1", [decoded._id]);
    if (result.rows.length === 0) return next(new UnauthorizedError());
    request.userId = decoded._id;
    next();
  } catch (error) {
    next(new UnauthorizedError());
  }
}
var authMiddleware_default = authMiddleware;

// src/exceptions/bad-request.error.ts
var BadRequestError = class extends HttpError {
  constructor(message) {
    super(400, message || "Bad Request");
  }
};

// src/middleware/validation-middleware.ts
var import_zod = require("zod");
var validationMiddleware = (schema) => async (req, _, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params
    });
    return next();
  } catch (error) {
    if (error instanceof import_zod.ZodError) {
      return next(new BadRequestError(error.issues[0].message));
    }
    return next(new BadRequestError("Error in validation process."));
  }
};
var validation_middleware_default = validationMiddleware;

// src/trainers/trainers.validation.ts
var import_zod2 = require("zod");
var createTrainerSchema = import_zod2.z.object({
  body: import_zod2.z.object({
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string(),
    name: import_zod2.z.string().min(3)
  })
});
var loginTrainerSchema = import_zod2.z.object({
  body: import_zod2.z.object({
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string()
  })
});
var updatePokeballsSchema = import_zod2.z.object({
  body: import_zod2.z.object({
    pokeballs: import_zod2.z.number()
  })
});

// src/auth/auth.controller.ts
var AuthController = class {
  constructor(authService) {
    this.authService = authService;
    this.path = "/auth";
    this.router = (0, import_express2.Router)();
    this.register = async (request, response, next) => {
      try {
        const createdTrainer = await this.authService.register(request.body);
        response.cookie(
          "Authentication",
          this.authService.createToken(createdTrainer.id),
          this.authService.createCookieOptions()
        );
        response.status(201).json({ data: createdTrainer });
      } catch (error) {
        next(error);
      }
    };
    this.login = async (request, response, next) => {
      try {
        const user = await this.authService.login(request.body);
        response.cookie(
          "Authentication",
          this.authService.createToken(user.id),
          this.authService.createCookieOptions()
        );
        response.json({ data: user });
      } catch (error) {
        console.log({ error });
        next(error);
      }
    };
    this.isLoggedIn = async (request, response, next) => {
      try {
        const loggedUser = await this.authService.isLoggedIn(request.userId);
        response.json(loggedUser);
      } catch (error) {
        next(error);
      }
    };
    this.logout = (_, response) => {
      response.setHeader("Set-Cookie", ["Authentication=; Max-Age=0; Path=/; HttpOnly"]).status(204).end();
    };
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validation_middleware_default(createTrainerSchema),
      this.register
    );
    this.router.post(`${this.path}/login`, validation_middleware_default(loginTrainerSchema), this.login);
    this.router.get(`${this.path}/me`, authMiddleware_default, this.isLoggedIn);
    this.router.post(`${this.path}/logout`, this.logout);
  }
};
var auth_controller_default = AuthController;

// src/pokemon/pokemon.controller.ts
var import_express3 = require("express");

// src/pokemon/pokemon.validation.ts
var import_zod3 = require("zod");
var createPokemonSchema = import_zod3.z.object({
  body: import_zod3.z.object({
    pokemon_id: import_zod3.z.number(),
    hp: import_zod3.z.number(),
    trainer_id: import_zod3.z.number().optional()
  })
});

// src/pokemon/pokemon.controller.ts
var PokemonController = class {
  constructor(pokemonService) {
    this.pokemonService = pokemonService;
    this.path = "/pokemons";
    this.router = (0, import_express3.Router)();
    this.createPokemon = async (request, response, next) => {
      try {
        const pokemon = await this.pokemonService.createPokemon(request.body);
        return response.json({ data: pokemon });
      } catch (error) {
        next(error);
      }
    };
    this.updatePokemonHp = async (request, response, next) => {
      try {
        const id = +request.params.id;
        const updatedPokemon = await this.pokemonService.updatePokemonHp(id, request.body.hp);
        return response.json({ data: updatedPokemon });
      } catch (error) {
        next(error);
      }
    };
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      this.path,
      validation_middleware_default(createPokemonSchema),
      authMiddleware_default,
      this.createPokemon
    );
    this.router.patch(`${this.path}/:id`, authMiddleware_default, this.updatePokemonHp);
  }
};
var pokemon_controller_default = PokemonController;

// src/trainers/trainers.controller.ts
var import_express4 = __toESM(require("express"));
var TrainerController = class {
  constructor(trainerService) {
    this.trainerService = trainerService;
    this.path = "/trainers";
    this.router = import_express4.default.Router();
    this.getTrainer = async (request, response) => {
      const id = +request.params.id;
      const pokeTrainer = await this.trainerService.getPokeTrainer(id);
      return response.json(pokeTrainer);
    };
    this.updatePokeballs = async (request, response) => {
      const id = +request.params.id;
      const pokeballs = +request.body.pokeballs;
      const updatedTrainer = await this.trainerService.updatePokeballs(
        id,
        pokeballs
      );
      return response.json(updatedTrainer);
    };
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.getTrainer);
    this.router.patch(`${this.path}/:id`, this.updatePokeballs);
  }
};

// src/socket.ts
var import_http3 = __toESM(require("http"));
var import_socket = require("socket.io");
var PokemonSocket = class {
  constructor(app2) {
    this.socketPort = 4e3;
    this.ioServerConfig = {
      cors: {
        origin: "http://localhost:3000"
      }
    };
    this.socketServer = import_http3.default.createServer(app2);
    this.io = new import_socket.Server(this.socketServer, this.ioServerConfig);
  }
  ioListen() {
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
          pokemonId
        });
        socket.emit("game_players", { players });
        initialPosition++;
      });
      socket.on("update_player_position", (data) => {
        const newPlayers = players.map((player) => {
          if (player.trainerName === data.trainerName) {
            return __spreadProps(__spreadValues({}, player), { position: data.newPosition });
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
};
var socket_default = PokemonSocket;

// src/trainers/trainers.service.ts
var TrainerService = class {
  constructor(pool2) {
    this.pool = pool2;
    this.getPokeTrainer = async (id) => {
      const pokeTrainer = await this.pool.query(
        `
      SELECT trainers.*, pokemons.*
      FROM trainers
      LEFT JOIN pokemons ON trainers.id = pokemons.trainer_id
      WHERE trainers.id = $1;
      `,
        [id]
      );
      return pokeTrainer.rows[0];
    };
    this.updatePokeballs = async (id, pokeballs) => {
      const updatedTrainer = await this.pool.query(
        `
      UPDATE trainers
      SET pokeballs = $1
      WHERE id = $2
      RETURNING *;
      `,
        [pokeballs, id]
      );
      return updatedTrainer.rows[0];
    };
    this.createPokeTrainer = async (payload) => {
      const pokeTrainer = await this.pool.query(
        `
      INSERT INTO trainers (email, password)
      VALUES ($1, $2)
      `,
        [payload.email, payload.password]
      );
      return pokeTrainer.rows[0];
    };
  }
};

// src/auth/auth.service.ts
var import_bcrypt2 = __toESM(require("bcrypt"));

// src/exceptions/not-found.ts
var NotFoundError = class extends HttpError {
  constructor(message) {
    super(404, message || "Not Found");
  }
};

// src/auth/auth.service.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var AuthService = class {
  constructor(pool2) {
    this.pool = pool2;
  }
  async register(payload) {
    const hashedPassword = await import_bcrypt2.default.hash(payload.password, 10);
    const registeredUser = await this.pool.query(
      `
      INSERT INTO trainers (email, password, name)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [payload.email, hashedPassword, payload.name]
    );
    return registeredUser.rows[0];
  }
  async login(payload) {
    const user = await this.pool.query(
      `
      SELECT * FROM trainers WHERE email = $1;
      `,
      [payload.email]
    );
    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }
    const isPasswordCorrect = await import_bcrypt2.default.compare(payload.password, user.rows[0].password);
    if (!isPasswordCorrect) {
      throw new BadRequestError("Invalid email or password");
    }
    return user.rows[0];
  }
  async isLoggedIn(userId) {
    if (!userId) {
      throw new UnauthorizedError("User not logged in");
    }
    const user = await this.pool.query(`
      SELECT * FROM trainers WHERE id = $1;
      `);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user.rows[0];
  }
  createCookieOptions() {
    return {
      maxAge: 5 * 60 * 60 * 1e3,
      // 5 hours
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    };
  }
  createToken(userId) {
    return import_jsonwebtoken2.default.sign({ _id: userId }, env.JWT_SECRET, { expiresIn: 60 * 60 });
  }
};
var auth_service_default = AuthService;

// src/pokemon/pokemon.service.ts
var PokemonService = class {
  constructor(pool2) {
    this.pool = pool2;
    this.createPokemon = async (payload) => {
      const pokemon = await this.pool.query(
        `
      INSERT INTO pokemons (pokemon_id, hp, trainer_id)
      `,
        [payload.pokemon_id, payload.hp, payload.trainer_id]
      );
      return pokemon.rows[0];
    };
    this.updatePokemonHp = async (id, hp) => {
      const updatedPokemon = await this.pool.query(
        `
      UPDATE pokemons
      SET hp = $1
      WHERE id = $2
      RETURNING *;
      `,
        [hp, id]
      );
      return updatedPokemon.rows[0];
    };
  }
};
var pokemon_service_default = PokemonService;

// src/server.ts
var app = new app_default([
  new auth_controller_default(new auth_service_default(database_default)),
  new TrainerController(new TrainerService(database_default)),
  new pokemon_controller_default(new pokemon_service_default(database_default))
]);
var pokemonSocket = new socket_default(app.getApp());
app.appListen();
pokemonSocket.ioListen();
