import { Command } from "./command";

export interface DeleteUserPayload extends Command{
    delete_username: string
}