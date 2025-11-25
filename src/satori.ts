// satori.ts
// UNIVERSAL VERSION: Works in Node.js AND Browser (React)

import { v4 as uuidv4 } from 'uuid';

// Only import ws in Node.js
let NodeWebSocket: any = null;
if (typeof window === "undefined") {
  NodeWebSocket = require("ws");
}

/**
 * Detect correct WebSocket implementation
 */
function createWebSocket(url: string): WebSocket {
  if (typeof window !== "undefined") {
    // Browser WebSocket
    return new window.WebSocket(url);
  }
  // Node WebSocket (ws)
  return new NodeWebSocket(url);
}

// --- Interfaces (same as yours, unchanged) ---
export interface FieldCondition { field: string; value: string; }
export interface SetPayload { key?: string; vertices?: string[]; data?: Record<string, any>; type?: string; expires?: boolean; expiration_time?: number; field_array?: FieldCondition[]; one?: boolean; }
export interface GetPayload { key?: string; encryption_key?: string; field_array?: FieldCondition[]; one?: boolean; }
export interface PutPayload { key?: string; replace_field: string; replace_value: string; encryption_key?: string; field_array?: FieldCondition[]; one?: boolean; type?: string; }
export interface DeletePayload { key?: string; field_array?: FieldCondition[]; one?: boolean; type?: string; }
export interface SetVertexPayload { key: string; vertex: string | string[]; relation?: string; encryption_key?: string; }
export interface GetVertexPayload { key: string; encryption_key?: string; relation?: string; }
export interface DeleteVertexPayload { key: string; vertex: string; encryption_key?: string; }
export interface DfsPayload { node: string; encryption_key?: string; relation?: string; }
export interface EncryptPayload { key: string; encryption_key: string; }
export interface DecryptPayload { key: string; encryption_key: string; }
export interface TypeOnlyPayload { type: string; }
export interface RefPayload { key: string; ref?: string; encryption_key?: string; }
export interface AskPayload{ question: string; backend?: string }
export interface QueryPayload{ query: string; backend?: string }
export interface PushPayload{ key?: string; array: string; value: any; encryption_key?: string; field_array?: FieldCondition[]; one?: boolean; }
export interface PopPayload{ key?: string; array: string; encryption_key?: string; field_array?: FieldCondition[]; one?: boolean; }
export interface SplicePayload{ key?: string; array: string; encryption_key?: string; field_array?: FieldCondition[]; one?: boolean; }
export interface RemovePayload{ key?: string; array: string; value: any; encryption_key?: string; field_array?: FieldCondition[]; one?: boolean; }
export interface ANNPayload { key: string; top_k?: number; }
interface CommandPayload { command: string; [key: string]: any; }

/**
 * Satori Universal WebSocket Client
 */
export class Satori {
  private username: string;
  private password: string;
  private host: string;
  private ws: WebSocket | null = null;
  private pending = new Map<string, (value: any) => void>();
  private subscriptions = new Map<string, (data: any) => void>();

  constructor({ username, password, host }: { username: string; password: string; host: string }) {
    this.username = username;
    this.password = password;
    this.host = host;
  }

  /**
   * Connect to Satori WebSocket
   */
  async connect(): Promise<void> {
    this.ws = createWebSocket(this.host);

    this.ws.onmessage = (event: any) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "notification" && msg.key && this.subscriptions.has(msg.key)) {
        this.subscriptions.get(msg.key)!(msg.data);
        return;
      }

      if (msg.id && this.pending.has(msg.id)) {
        this.pending.get(msg.id)!(msg);
        this.pending.delete(msg.id);
      }
    };

    return new Promise((resolve, reject) => {
      if (!this.ws) return reject();

      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
    });
  }

  /**
   * Send a command
   */
  private send(commandPayload: CommandPayload): Promise<any> {
    return new Promise((resolve) => {
      const id = uuidv4();
      const msg = {
        username: this.username,
        password: this.password,
        id,
        ...commandPayload
      };

      this.pending.set(id, resolve);
      this.ws?.send(JSON.stringify(msg));
    });
  }

  // ---- Operations (unchanged) ----

  async set(payload: SetPayload) { return this.send({ command: "SET", ...payload }); }
  async push(payload: PushPayload) { return this.send({ command: "PUSH", ...payload }); }
  async pop(payload: PopPayload) { return this.send({ command: "POP", ...payload }); }
  async splice(payload: SplicePayload) { return this.send({ command: "SPLICE", ...payload }); }
  async remove(payload: RemovePayload) { return this.send({ command: "REMOVE", ...payload }); }
  async get(payload: GetPayload) { return this.send({ command: "GET", ...payload }); }
  async put(payload: PutPayload) { return this.send({ command: "PUT", ...payload }); }
  async delete(payload: DeletePayload) { return this.send({ command: "DELETE", ...payload }); }
  async setVertex(payload: SetVertexPayload) { return this.send({ command: "SET_VERTEX", ...payload }); }
  async getVertex(payload: GetVertexPayload) { return this.send({ command: "GET_VERTEX", ...payload }); }
  async deleteVertex(payload: DeleteVertexPayload) { return this.send({ command: "DELETE_VERTEX", ...payload }); }
  async dfs(payload: DfsPayload) { return this.send({ command: "DFS", ...payload }); }
  async encrypt(payload: EncryptPayload) { return this.send({ command: "ENCRYPT", ...payload }); }
  async decrypt(payload: DecryptPayload) { return this.send({ command: "DECRYPT", ...payload }); }
  async train() { return this.send({ command: "TRAIN", type: "train" }); }
  async ann(payload: ANNPayload) { return this.send({ command: "ANN", ...payload }); }
  async ask(payload: AskPayload) { return this.send({ command: "ASK", ...payload }); }
  async query(payload: QueryPayload) { return this.send({ command: "QUERY", ...payload }); }
  async memory_stats() { return this.send({ command: "MEMORY_STATS" }); }
  async cpu_stats() { return this.send({ command: "CPU_STATS" }); }
  async get_operations() { return this.send({ command: "GET_OPERATIONS" }); }
  async get_insights() { return this.send({ command: "INSIGHTS" }); }

  /**
   * Subscriptions
   */
  notify(key: string, callback: (data: any) => void) {
    this.subscriptions.set(key, callback);
    this.ws?.send(JSON.stringify({
      command: "NOTIFY",
      key,
      id: uuidv4(),
      username: this.username,
      password: this.password
    }));
  }
}
