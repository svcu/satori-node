import { Command } from "./command";

export interface SetVertexPayload extends Command{
    key: string;
    vertex: string[]
}