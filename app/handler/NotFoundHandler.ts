import express from "express";
import {errorToJSON} from "../../utils/Helpers";

function NotFoundHandler(req: express.Request, res: express.Response) {
    res.status(404).send(errorToJSON("Invalid route!"))
}

export default NotFoundHandler