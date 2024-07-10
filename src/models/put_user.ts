import { Command } from "./command";

export interface PutUserPayload extends Command{
    put_username: string;
    role: string
}