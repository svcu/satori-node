import tls from 'tls';

interface Command {
    command?: string;
    username?: string;
    token?: string;
    encryption_key?: string;
    type?: string;
}

interface EncryptPayload extends Command {
    encryption_key: string;
    key: string;
}

interface GetPayload extends Command {
    key: string;
}

interface PutPayload extends Command {
    key: string;
    replace_field: string;
    replace_value: any;
}

interface SetPayload extends Command {
    key?: string;
    data: object;
    vertices?: string[];
    expiration_time?: number;
    expires?: boolean;
    type?: string;
}

interface Vertex {
    relation?: string;
    neighbor: string;
}

interface SetVertexPayload extends Command {
    key: string;
    vertex: Vertex[];
}

interface DeletePayload extends Command {
    key: string;
}

interface DeleteVertexPayload extends DeletePayload {
    vertex: string;
}

interface DFSPayload extends Command {
    node: string;
    relation?: string;
}

interface FieldEntry {
    field: string;
    value: string;
}

interface GetAllWithPayload extends Command {
    field_array: FieldEntry[];
    type?: string;
}

interface PutAllWithPayload extends GetAllWithPayload {
    replace_field: string;
    replace_value: any;
}

interface SetUserPayload extends Command {
    role: string;
    set_username: string;
}

interface GetUserPayload extends Command {
    get_username: string;
}

interface PutUserPayload extends Command {
    put_username: string;
    role: string;
}

interface DeleteUserPayload extends Command {
    delete_username: string;
}

interface InjectPayload extends Command {
    code: string;
}

interface GetAllPayload extends Command {
    type: string;
}

interface SetRefPayload extends Command {
    key: string;
    ref: string;
}

interface DeleteRefsPayload extends Command {
    key: string;
}

interface DeleteAllWithPayload extends GetAllWithPayload {
}

interface PushPayload extends Command {
    key: string;
    array: string;
    value: any;
}

interface PopPayload extends Command {
    key: string;
    array: string;
}

interface PutAllPayload extends Command {
    replace_field: string;
    replace_value: any;
    type: string;
}

interface DeleteRefPayload extends Command {
    ref: string;
}

declare class Satori {
    host: string;
    port: number;
    username: string;
    token: string;
    network_pwd: string;
    constructor(host: string, port: number, username?: string, token?: string, network_pwd?: string);
    setHost(host: string): void;
    setPort(port: number): void;
    getSocket(): Promise<tls.TLSSocket>;
    set(payload: SetPayload): Promise<string | boolean>;
    get(payload: GetPayload): Promise<any | undefined>;
    put(payload: PutPayload): Promise<boolean>;
    delete(payload: DeletePayload): Promise<boolean>;
    encrypt(payload: EncryptPayload): Promise<boolean>;
    setVertex(payload: SetVertexPayload): Promise<boolean>;
    getVertex(payload: GetPayload): Promise<any | undefined>;
    deleteVertex(payload: DeleteVertexPayload): Promise<Boolean>;
    dfs(payload: DFSPayload): Promise<any | undefined>;
    getAllWith(payload: GetAllWithPayload): Promise<any[] | undefined>;
    getOneWith(payload: GetAllWithPayload): Promise<any | undefined>;
    putAllWith(payload: PutAllWithPayload): Promise<Boolean>;
    putOneWith(payload: PutAllWithPayload): Promise<Boolean>;
    deleteOneWith(payload: GetAllWithPayload): Promise<Boolean>;
    setRef(payload: SetRefPayload): Promise<Boolean>;
    deleteRefs(payload: DeleteRefsPayload): Promise<Boolean>;
    getRefs(payload: DeleteRefsPayload): Promise<any[] | undefined>;
    setUser(payload: SetUserPayload): Promise<Boolean>;
    getUser(payload: GetUserPayload): Promise<any | undefined>;
    putUser(payload: PutUserPayload): Promise<Boolean>;
    deleteUser(payload: DeleteUserPayload): Promise<Boolean>;
    deleteAuth(payload: Command): Promise<Boolean>;
    inject(payload: InjectPayload): Promise<any | undefined>;
    getAll(payload: GetAllPayload): Promise<any[] | undefined>;
    deleteAll(payload: GetAllPayload): Promise<Boolean>;
    deleteAllWith(payload: DeleteAllWithPayload): Promise<Boolean>;
    push(payload: PushPayload): Promise<Boolean>;
    remove(payload: PushPayload): Promise<Boolean>;
    pop(payload: PopPayload): Promise<Boolean>;
    splice(payload: PopPayload): Promise<Boolean>;
    decrypt(payload: EncryptPayload): Promise<Boolean>;
    put_all(payload: PutAllPayload): Promise<Boolean>;
    delete_ref(payload: DeleteRefPayload): Promise<Boolean>;
}

declare class Schema<T extends object> {
    satori: Satori;
    schemaName: string;
    body: T;
    key: string;
    constructor(body: T, satori: Satori, schemaName: string, key?: string);
    set(): Promise<string | boolean>;
    delete(): Promise<boolean>;
    encrypt(encryption_key: string): Promise<boolean>;
    setVertex(vertex: Vertex[], encryption_key?: string): Promise<boolean>;
    getVertex(): Promise<any | undefined>;
    deleteVertex(vertex: string, encryption_key?: string): Promise<Boolean>;
    dfs(relation?: string): Promise<any | undefined>;
    getAllWith(field_array: FieldEntry[]): Promise<any[] | undefined>;
    getOneWith(field_array: FieldEntry[]): Promise<any | undefined>;
    putAllWith(field_array: FieldEntry[], replaceField: string, replaceValue: any): Promise<Boolean>;
    putOneWith(field_array: FieldEntry[], replaceField: string, replaceValue: any): Promise<Boolean>;
    deleteOneWith(field_array: FieldEntry[]): Promise<Boolean>;
    setRef(ref: string): Promise<Boolean>;
    deleteRefs(encryption_key?: string): Promise<Boolean>;
    getRefs(): Promise<any[] | undefined>;
    getAll(): Promise<T[] | undefined>;
    deleteAll(): Promise<Boolean>;
    deleteAllWith(field_array: FieldEntry[]): Promise<Boolean>;
    push(value: any, array: string): Promise<Boolean>;
    pop(array: string): Promise<Boolean>;
    splice(array: string): Promise<Boolean>;
    remove(value: any, array: string): Promise<Boolean>;
    decrypt(encryption_key: string): Promise<Boolean>;
}

export { type Command, type DFSPayload, type DeletePayload, type DeleteUserPayload, type DeleteVertexPayload, type EncryptPayload, type FieldEntry, type GetAllPayload, type GetAllWithPayload, type GetPayload, type GetUserPayload, type InjectPayload, type PutAllWithPayload, type PutPayload, type PutUserPayload, Satori, Schema, type SetPayload, type SetRefPayload, type SetUserPayload, type SetVertexPayload };
