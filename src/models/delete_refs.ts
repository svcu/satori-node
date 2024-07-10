import { Command } from "./command";

export interface DeleteRefsPayload extends Command{
    key: string;
}