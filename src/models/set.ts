import { Command } from "./command";

interface SetPayload extends Command{
    
    key?: string;
    data: object;
    vertices?: string[];
    expiration_time?:number;
    expires?: boolean;
    type?: string;

}

export type {SetPayload as SetPayload}

