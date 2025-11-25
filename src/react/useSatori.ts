// src/react/useSatori.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { SatoriClient } from "../core/SatoriClient";

export interface SatoriCredentials {
  url?: string;
  username?: string;
  password?: string;
}

export function useSatori(initial?: SatoriCredentials) {
  const [connected, setConnected] = useState(false);
  const [credentials, setCredentialsState] = useState<SatoriCredentials>(initial || {});

  const clientRef = useRef<SatoriClient | null>(null);

  // --- PUBLIC SETTER ---
  const setCredentials = useCallback((creds: SatoriCredentials) => {
    setCredentialsState(prev => ({
      ...prev,
      ...creds,
    }));
  }, []);

  // --- INTERNAL CONNECTOR ---
  const internalConnect = useCallback(async (creds: SatoriCredentials) => {
    if (!creds.url || !creds.username || !creds.password) return;

    

    const client = new SatoriClient({
        url: creds.url,
        username: creds.username,
        password: creds.password
    });

    clientRef.current = client;

    try {
      await client.connect();
      setConnected(true);
    } catch (err) {
      console.error("Satori connection error:", err);
      setConnected(false);
    }
  }, []);

  // --- PUBLIC CONNECT() ---
  const connect = useCallback(async (creds: SatoriCredentials) => {
    setCredentials(creds);
  }, [setCredentials]);



  // --- WHEN CREDENTIALS CHANGE -> RECONNECT ---
  useEffect(() => {
    internalConnect(credentials);
  }, [credentials, internalConnect]);

  // --- WRAPPED METHODS ---
  const get = useCallback(async (key: string) => {
    return clientRef.current?.get(key);
  }, []);

  const set = useCallback(async (key: string, value: any) => {
    return clientRef.current?.set(key, value);
  }, []);

  const ask = useCallback(async (input: string) => {
    return clientRef.current?.ask(input);
  }, []);

  const query = useCallback(async (input: string) => {
    return clientRef.current?.query(input);
  }, []);

  const ann = useCallback(async (input: any) => {
    return clientRef.current?.ann(input);
  }, []);

  return {
    connected,
    client: clientRef.current,

    setCredentials,
    connect,

    get,
    set,
    ask,
    query,
    ann,
  };
}
