// src/core/transport-node.ts
import WS from "ws";
import { ISocket } from "./ISocket";

export function createNodeSocket(url: string): ISocket {
  const socket = new WS(url);

  return {
    get readyState() {
      return socket.readyState;
    },
    send(data: string) {
      socket.send(data);
    },

    onopen: null,
    onmessage: null,
    onclose: null,
  } as ISocket & WS;
}
