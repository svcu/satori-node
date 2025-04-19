import { FieldEntry } from "satori-node";
import { Command } from "./command";

export interface PopPayload extends Command{
    key?: string;
    array: string;
    field_array?: FieldEntry[]
}