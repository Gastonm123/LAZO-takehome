class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

class SynchError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, SynchError.prototype);
    }
}

class InvalidCall extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidCall.prototype);
    }
}

export { NotFoundError, SynchError, InvalidCall }