import { Command } from "./command";

interface QueryPayload extends Command{
    query: string;
}

export type {QueryPayload as QueryPayload}