import { FieldEntry } from "satori-node";
import { Command } from "./command";

interface GetPayload extends Command{
    key?: string;
    field_array?: FieldEntry[]
}

export type {GetPayload as GetPayload}