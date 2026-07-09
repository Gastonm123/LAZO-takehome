class NotFoundError extends Error {
    statusCode = 404;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

class SynchError extends Error {
    statusCode = 409;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, SynchError.prototype);
    }
}

class InvalidCall extends Error {
    statusCode = 400;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidCall.prototype);
    }
}

export { NotFoundError, SynchError, InvalidCall };
