import { Command } from "./command";

export interface PopPayload extends Command{
    key: string;
    array: string;
}