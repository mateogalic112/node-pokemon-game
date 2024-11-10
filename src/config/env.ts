import { config } from "dotenv";
import { cleanEnv, port, str, url } from "envalid";

config();

export const env = cleanEnv(process.env, {
  APP_SERVER_PORT: port({ default: 5000 }),
  SOCKET_SERVER_PORT: port({ default: 4000 }),

  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_HOST: str(),
  POSTGRES_PORT: port(),
  POSTGRES_DB: str(),

  POKE_API_URL: url(),
  JWT_SECRET: str()
});
