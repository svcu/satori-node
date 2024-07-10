import { Command } from "./command";

interface PutPayload extends Command{
    
    key: string;
    replace_field: string;
    replace_value: any 

}

export type {PutPayload as PutPayload}