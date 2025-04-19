import { FieldEntry } from "satori-node";
import { Command } from "./command"

interface DeletePayload extends Command{
    key?: string;
    field_array?: FieldEntry[];
}

export type {DeletePayload as DeletePayload}