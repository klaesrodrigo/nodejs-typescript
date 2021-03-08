import { InternalError } from "./InternalError";

export class ClientInternalError extends InternalError {
    constructor(message: string){
        const internalMessage = 'Unexpected error when trying to communicate to StormGlass';
        super(`${internalMessage}: ${message}`)
    }
}