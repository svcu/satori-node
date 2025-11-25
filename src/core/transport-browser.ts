// src/core/transport-browser.ts
import { ISocket } from "./ISocket";

export function createBrowserSocket(url: string): ISocket {
  const socket = new WebSocket(url);

  return socket as unknown as ISocket;
}
