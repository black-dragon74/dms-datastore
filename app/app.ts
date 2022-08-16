import express from "express";
import registerRoutes from "./router/Router";
import CONST from "../utils/Const";
import WithContentJSON from "./middleware/WithContentJSON";

const app = express();

function startServer() {
  // Register the routes
  registerRoutes(app);

  // Add the content-type middleware
  app.use(WithContentJSON);

  // Start listening
  try {
    if (process.env.PORT) {
      console.log("Using PORT set by env: " + process.env.PORT);
    }

    app.listen(process.env.PORT || CONST.PORT, () => {
      console.log(
        `⚡️[server]: Server is running at http://localhost:${
          process.env.PORT || CONST.PORT
        }`
      );
    });
  } catch (e) {
    console.error(`Unable to start the server ${(e as Error).toString()}`);
  }
}

export default startServer;
