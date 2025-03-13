import { Command } from "./command";
import { Vertex } from "./vertex_list";

interface SetPayload extends Command{
    
    key?: string;
    data: object;
    vertices?: Vertex[];
    expiration_time?:number;
    expires?: boolean;
    type?: string;

}

export type {SetPayload as SetPayload}

