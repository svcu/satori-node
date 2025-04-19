import { FieldEntry } from "satori-node";
import { Command } from "./command";

export interface PushPayload extends Command{
    key?: string;
    array: string;
    value: any;
    field_array?: FieldEntry[];
}