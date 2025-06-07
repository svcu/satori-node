// satori.ts
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

/**
 * Represents a field-value condition for filtering operations.
 * @example
 * { field: "email", value: "test@example.com" }
 */
export interface FieldCondition {
  field: string;
  value: string;
}

/**
 * Payload for SET operation.
 * @example
 * {
 *   key: "user:123",
 *   data: { name: "John" },
 *   type: "user",
 *   expires: true,
 *   expiration_time: 60000
 * }
 */
export interface SetPayload {
  key?: string;
  vertices?: string[];
  data?: Record<string, any>;
  type?: string;
  expires?: boolean;
  expiration_time?: number;
  field_array?: FieldCondition[];
  one?: boolean;
}

/**
 * Payload for GET operation.
 * @example
 * { key: "user:123" }
 */
export interface GetPayload {
  key?: string;
  encryption_key?: string;
  field_array?: FieldCondition[];
  one?: boolean;
}

/**
 * Payload for PUT operation.
 * @example
 * {
 *   key: "user:123",
 *   replace_field: "name",
 *   replace_value: "Jane"
 * }
 */
export interface PutPayload {
  key?: string;
  replace_field: string;
  replace_value: string;
  encryption_key?: string;
  field_array?: FieldCondition[];
  one?: boolean;
  type?: string;
}

/**
 * Payload for DELETE operation.
 * @example
 * { key: "user:123" }
 */
export interface DeletePayload {
  key?: string;
  field_array?: FieldCondition[];
  one?: boolean;
  type?: string;
}

/**
 * Payload for SET_VERTEX operation.
 * @example
 * {
 *   key: "user:123",
 *   vertex: "friend:456",
 *   encryption_key: "secret"
 *   relation: "friend"
 * }
 */
export interface SetVertexPayload {
  key: string;
  vertex: string | string[];
  relation?: string;
  encryption_key: string;
}

/**
 * Payload for GET_VERTEX operation.
 * @example
 * {
 *   key: "user:123",
 *   encryption_key: "secret"
 * }
 */
export interface GetVertexPayload {
  key: string;
  encryption_key: string;
  relation?: string;
}

/**
 * Payload for DELETE_VERTEX operation.
 * @example
 * {
 *   key: "user:123",
 *   vertex: "friend:456"
 * }
 */
export interface DeleteVertexPayload {
  key: string;
  vertex: string;
  encryption_key?: string;
}

/**
 * Payload for DFS traversal.
 * @example
 * {
 *   node: "user:123",
 *   encryption_key: "secret"
 * }
 */
export interface DfsPayload {
  node: string;
  encryption_key: string;
  relation?: string;
}

/**
 * Payload for ENCRYPT operation.
 * @example
 * {
 *   key: "user:123",
 *   encryption_key: "secret"
 * }
 */
export interface EncryptPayload {
  key: string;
  encryption_key: string;
}

/**
 * Payload for DECRYPT operation.
 * @example
 * {
 *   key: "user:123",
 *   encryption_key: "secret"
 * }
 */
export interface DecryptPayload {
  key: string;
  encryption_key: string;
}

/**
 * Payload with type only.
 * @example
 * { type: "user" }
 */
export interface TypeOnlyPayload {
  type: string;
}

/**
 * Payload for reference operations.
 * @example
 * {
 *   key: "user:123",
 *   ref: "profile:123"
 * }
 */
export interface RefPayload {
  key: string;
  ref?: string;
  encryption_key?: string;
}

interface CommandPayload {
  command: string;
  [key: string]: any;
}

/**
 * Satori WebSocket client class for interacting with the database.
 * @example
 * const client = new Satori({ username: 'user', password: 'pass', host: 'ws://localhost:8000' });
 * await client.connect();
 */
export class Satori {
  private username: string;
  private password: string;
  private host: string;
  private ws: WebSocket | null = null;
  private pending = new Map<string, (value: any) => void>();
  private subscriptions = new Map<string, (data: any) => void>();

  /**
   * Creates an instance of Satori.
   */
  constructor({ username, password, host }: { username: string; password: string; host: string }) {
    this.username = username;
    this.password = password;
    this.host = host;
  }

  /**
   * Connects to the WebSocket server.
   */
  async connect(): Promise<void> {
    this.ws = new WebSocket(this.host);

    this.ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'notification' && msg.key && this.subscriptions.has(msg.key)) {
        this.subscriptions.get(msg.key)?.(msg.data);
        return;
      }

      if (msg.id && this.pending.has(msg.id)) {
        this.pending.get(msg.id)?.(msg);
        this.pending.delete(msg.id);
      }
    });

    return new Promise((resolve, reject) => {
      if (!this.ws) return reject();
      this.ws.on('open', resolve);
      this.ws.on('error', reject);
    });
  }

  /**
   * Sends a command with payload to the server.
   */
  private send(commandPayload: CommandPayload): Promise<any> {
    return new Promise((resolve) => {
      const id = uuidv4();
      const msg = { id, ...commandPayload };
      this.pending.set(id, resolve);
      this.ws?.send(JSON.stringify(msg));
    });
  }

  /**
   * Performs a SET operation.
   */
  async set(payload: SetPayload) {
    const command = payload.field_array ? 'SET_ALL_WITH' : 'SET';
    return this.send({ command, ...payload });
  }

  /**
   * Performs a GET operation.
   */
  async get(payload: GetPayload) {
    const command = payload.field_array ? (payload.one ? 'GET_ONE_WITH' : 'GET_ALL_WITH') : 'GET';
    return this.send({ command, ...payload });
  }

  /**
   * Performs a PUT operation.
   */
  async put(payload: PutPayload) {
    const command = payload.field_array ? (payload.one ? 'PUT_ONE_WITH' : 'PUT_ALL_WITH') : 'PUT';
    return this.send({ command, ...payload });
  }

  /**
   * Performs a DELETE operation.
   */
  async delete(payload: DeletePayload) {
    const command = payload.field_array ? (payload.one ? 'DELETE_ONE_WITH' : 'DELETE_ALL_WITH') : 'DELETE';
    return this.send({ command, ...payload });
  }

  /**
   * Performs a SET_VERTEX operation.
   */
  async setVertex(payload: SetVertexPayload) {
    return this.send({ command: 'SET_VERTEX', ...payload });
  }

  /**
   * Performs a GET_VERTEX operation.
   */
  async getVertex(payload: GetVertexPayload) {
    return this.send({ command: 'GET_VERTEX', ...payload });
  }

  /**
   * Performs a DELETE_VERTEX operation.
   */
  async deleteVertex(payload: DeleteVertexPayload) {
    return this.send({ command: 'DELETE_VERTEX', ...payload });
  }

  /**
   * Performs a DFS traversal.
   */
  async dfs(payload: DfsPayload) {
    return this.send({ command: 'DFS', ...payload });
  }

  /**
   * Encrypts data.
   */
  async encrypt(payload: EncryptPayload) {
    return this.send({ command: 'ENCRYPT', ...payload });
  }

  /**
   * Decrypts data.
   */
  async decrypt(payload: DecryptPayload) {
    return this.send({ command: 'DECRYPT', ...payload });
  }

  /**
   * Retrieves all objects of a given type.
   */
  async getAll(payload: TypeOnlyPayload) {
    return this.send({ command: 'GET_ALL', ...payload });
  }

  /**
   * Deletes all objects of a given type.
   */
  async deleteAll(payload: TypeOnlyPayload) {
    return this.send({ command: 'DELETE_ALL', ...payload });
  }

  /**
   * Replaces all matching objects with given value.
   */
  async putAll(payload: PutPayload) {
    return this.send({ command: 'PUT_ALL', ...payload });
  }

  /**
   * Sets a reference to another object.
   */
  async setRef(payload: RefPayload) {
    return this.send({ command: 'SET_REF', ...payload });
  }

  /**
   * Retrieves all references for a key.
   */
  async getRefs(payload: RefPayload) {
    return this.send({ command: 'GET_REFS', ...payload });
  }

  /**
   * Deletes all references for a key.
   */
  async deleteRefs(payload: RefPayload) {
    return this.send({ command: 'DELETE_REFS', ...payload });
  }

  /**
   * Deletes a specific reference.
   */
  async deleteRef(payload: RefPayload) {
    return this.send({ command: 'DELETE_REF', ...payload });
  }

  /**
   * Subscribe to real-time changes of an object by key.
   * @param key - The key of the object to subscribe to
   * @param callback - Function called with updated data on each change
   * @example
   * client.notify('user:123', data => console.log('Updated:', data));
   */
  notify(key: string, callback: (data: any) => void) {
    this.subscriptions.set(key, callback);
    this.ws?.send(JSON.stringify({ command: 'NOTIFY', key }));
  }

  /**
   * Unsubscribe from real-time notifications for a key.
   * @param key - The key to unsubscribe
   * @example
   * client.unnotify('user:123');
   */
  unnotify(key: string) {
    this.subscriptions.delete(key);
    this.ws?.send(JSON.stringify({ command: 'UNNOTIFY', key }));
  }
}
