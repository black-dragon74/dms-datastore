import express from "express";

export default function (req: express.Request, res: express.Response, next: express.NextFunction) {
    // Set the header
    res.setHeader("Content-Type", "application/json")

    // Delegate
    next()
}