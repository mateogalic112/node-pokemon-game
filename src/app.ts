import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Controller } from "interfaces/controller.interface";
import errorMiddleware from "middleware/error.middleware";
import { initializeDatabase } from "db/seed";
import { env } from "config/env";

export class App {
  private app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    initializeDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);

    this.app.use(errorMiddleware);
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true
      })
    );
    this.app.use(cookieParser());
  }

  public getApp() {
    return this.app;
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(env.APP_SERVER_PORT, () => {
      console.log(`App listening on the port ${env.APP_SERVER_PORT}`);
    });
  }
}
