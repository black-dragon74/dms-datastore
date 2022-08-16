import express from "express";
import WelcomeHandler from "../handler/WelcomeHandler";
import NotFoundHandler from "../handler/NotFoundHandler";
import MessMenuHandler from "../handler/MessMenuHandler";
import ContactsHandler from "../handler/ContactsHandler";

function registerRoutes(app: express.Application) {
  // Welcome route
  app.get("/", WelcomeHandler);

  // The routes which actually matter
  app.get("/mess", MessMenuHandler);
  app.get("/contacts", ContactsHandler);

  // This should be at the end to handle all the 404 requests
  app.get("/*", NotFoundHandler);
}

export default registerRoutes;
