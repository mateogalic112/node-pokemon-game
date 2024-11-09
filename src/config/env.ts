import { config } from "dotenv";
import { cleanEnv, port, str, url } from "envalid";

config();

export const env = cleanEnv(process.env, {
  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_HOST: str(),
  POSTGRES_PORT: port({ default: 5432 }),
  POSTGRES_DB: str(),

  POKE_API_URL: url(),
  JWT_SECRET: str(),
});
