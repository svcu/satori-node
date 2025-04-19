import { FieldEntry } from "satori-node";
import { Command } from "./command";

interface PutPayload extends Command{
    
    key?: string;
    replace_field: string;
    replace_value: any;
    field_array?: FieldEntry[];

}

export type {PutPayload as PutPayload}