import { Command } from "./command";

export interface DeleteRefPayload extends Command{
    ref: string;
}