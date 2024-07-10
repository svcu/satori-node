import { Command } from "./command";

export interface EncryptPayload extends Command{
    encryption_key: string;
    key: string;
}