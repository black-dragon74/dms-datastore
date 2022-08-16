import express from "express";

function WelcomeHandler(req: express.Request, res: express.Response) {
  res.send({
    msg: "Welcome to DMS DataStore API by Nick",
    error: "No route requested",
  });
}

export default WelcomeHandler;
