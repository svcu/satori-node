import { Command } from "./command"

interface DeletePayload extends Command{
    key: string;
}

export type {DeletePayload as DeletePayload}