// src/core/SatoriClient.ts
import { ISocket } from "./ISocket";
import { v4 as uuid } from "uuid";

const isBrowser = typeof window !== "undefined";

export class SatoriClient {
  private ws: ISocket | null = null;
  private url: string;
  private username? : string;
  private password? : string;
  private handlers = new Set<(msg: any) => void>();

  connected = false;

  constructor(options: { url: string; username?: string; password?: string }) {
    this.url = options.url;
    this.username = options.username;
    this.password = options.password;
  }

  async connect() {
    if (this.ws) return;

    const { createNodeSocket } = await import("./transport-node.js").catch(() => ({
      createNodeSocket: null,
    }));

    const { createBrowserSocket } = await import("./transport-browser.js").catch(() => ({
      createBrowserSocket: null,
    }));

    const socketCreator = isBrowser ? createBrowserSocket : createNodeSocket;

    if (!socketCreator) throw new Error("No WebSocket available.");

    const ws = socketCreator(this.url);
    this.ws = ws;

    return new Promise<void>((resolve) => {
      ws.onopen = () => {
        this.connected = true;
        resolve();
      };

      ws.onmessage = (event) => {
        let json;
        try {
          json = JSON.parse(event.data);
        } catch {
          return;
        }
        this.handlers.forEach((h) => h(json));
      };

      ws.onclose = () => {
        this.connected = false;
      };
    });
  }

  onMessage(handler: any) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  send(op: string, payload: any) {
    if (!this.ws || this.ws.readyState !== 1) {
      throw new Error("WebSocket is not ready");
    }

    const username = this.username;
    const password = this.password;

    const message = {
      id: uuid(),
      op,
      payload,
      username,
      password
    };

    this.ws.send(JSON.stringify(message));
    return message.id;
  }

  // API ----------

  private request(op: string, payload: any) {
    return new Promise((resolve) => {
      const id = this.send(op, payload);
      const off = this.onMessage((msg: any) => {
        if (msg.id === id) {
          off();
          resolve(msg);
        }
      });
    });
  }

  get(key: string) {
    return this.request("GET", { key });
  }
  set(key: string, value: any) {
    return this.request("SET", { key, value });
  }
  ask(prompt: string) {
    return this.request("ASK", { prompt });
  }
  query(prompt: string) {
    return this.request("QUERY", { prompt });
  }
  ann(vector: number[], top_k = 10) {
    return this.request("ANN", { vector, top_k });
  }
  train() {
    return this.request("TRAIN", {});
  }
  putAllWith(obj: any) {
    return this.request("PUT_ALL_WITH", obj);
  }
}
