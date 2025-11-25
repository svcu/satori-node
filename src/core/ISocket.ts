// src/core/ISocket.ts
export interface ISocket {
  readyState: number;
  send(data: string): void;

  onopen: ((ev: any) => void) | null;
  onmessage: ((ev: { data: any }) => void) | null;
  onclose: ((ev: any) => void) | null;
}
