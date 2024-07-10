import { Command } from "./command";

export interface DFSPayload extends Command{
    node: string;
    relation?: string
}