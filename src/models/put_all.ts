import { Command } from "./command";


export interface PutAllPayload extends Command{
    replace_field: string;
    replace_value: any;
    type: string;
}