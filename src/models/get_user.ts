import { Command } from "./command";

export interface GetUserPayload extends Command{
    get_username: string
}