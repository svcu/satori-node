import { Command } from "./command";

export interface SetUserPayload extends Command{
    role: string;
    set_username: string
}