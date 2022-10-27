import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Controller from "interfaces/controller.interface";
import errorMiddleware from "middleware/errorMiddleware";

class App {
  public app: express.Application;
  public appPort: number = 5000;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(cors());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public getApp() {
    return this.app;
  }

  public appListen() {
    this.app.listen(this.appPort, () => {
      console.log(`App listening on the port ${this.appPort}`);
    });
  }
}

export default App;
