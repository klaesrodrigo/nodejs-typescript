import { InternalError } from "./InternalError"

export class StormGlassResponseError extends InternalError {
    constructor(message: string){
        const internalMessage = 'Unexpected error returned by the StormGlass service';
        super(`${internalMessage}: ${message}`)
    }
}