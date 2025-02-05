export class ServerError extends Error {
    constructor(error?: any) {
        super('Server failed, Try again soon')
        this.name = 'ServerError'
        this.stack = error?.stack
    }
}

export class UnauthorizedError extends Error {
    constructor() {
        super('Unauthorized')
        this.name = 'UnauthorizedError'
    }
}