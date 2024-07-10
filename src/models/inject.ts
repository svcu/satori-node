import { Command } from "./command";

export interface InjectPayload extends Command{
    code: string
}