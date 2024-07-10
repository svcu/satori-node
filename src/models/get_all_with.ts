import { Command } from "./command";
import { FieldEntry } from "./field_entry";

export interface GetAllWithPayload extends Command{
    field_array: FieldEntry[];
    type?: string;
}