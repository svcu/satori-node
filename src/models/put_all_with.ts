import { GetAllWithPayload } from "./get_all_with";
import { PutPayload } from "./put";

export interface PutAllWithPayload extends GetAllWithPayload{
    replace_field: string;
    replace_value: any 
}