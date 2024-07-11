import { Command } from "./command";
import { Vertex } from "./vertex_list";

export interface SetVertexPayload extends Command{
    key: string;
    vertex: Vertex[],
}