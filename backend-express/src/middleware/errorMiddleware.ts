import type { NextFunction, Request, Response } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (
    err: Error & { statusCode?: number },
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const statusCode =
        err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    const message = err.message;

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === "production" ? "" : err.stack,
    });
};

export { notFound, errorHandler };
