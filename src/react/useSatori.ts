// src/react/useSatori.ts
import { useEffect, useRef, useState } from "react";
import { SatoriClient } from "../core/SatoriClient";

export function useSatori(options: { url: string; token?: string }) {
  const clientRef = useRef<SatoriClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  if (!clientRef.current) {
    clientRef.current = new SatoriClient(options);
  }

  const client = clientRef.current;

  useEffect(() => {
    let unsubscribe: any;

    client.connect().then(() => {
      setConnected(true);
      unsubscribe = client.onMessage((msg: any) => {
        setLastMessage(msg);
      });
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  return {
    connected,
    lastMessage,

    // API identical to original client
    get: client.get.bind(client),
    set: client.set.bind(client),
    ask: client.ask.bind(client),
    query: client.query.bind(client),
    train: client.train.bind(client),
    ann: client.ann.bind(client),
    putAllWith: client.putAllWith.bind(client),
  };
}
