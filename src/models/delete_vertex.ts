import { DeletePayload } from "./delete";
import { SetVertexPayload } from "./set_vertex";

export interface DeleteVertexPayload extends DeletePayload{
    vertex: string;
}