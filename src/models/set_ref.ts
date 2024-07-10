import { Command } from "./command";

export interface SetRefPayload extends Command{
    key: string;
    ref: string
}