// useSatori.tsx
import { useState, useRef, useCallback } from "react";
import { SatoriClient } from "../core/SatoriClient"; // ajusta la ruta según tu sdk

// ---------------------------
// 📌 Types
// ---------------------------

export interface SatoriCredentials {
  url?: string;
  username?: string;
  password?: string;
}

export interface UseSatori {
  connected: boolean;
  client: SatoriClient | null;

  setCredentials: (creds: SatoriCredentials) => void;
  connect: (creds?: SatoriCredentials) => Promise<void>;


  get: (key: string | any) => Promise<any> | undefined;
  set: (key: any, value?: any) => Promise<any> | undefined;

  ask: (question: any) => Promise<any> | undefined;
  query: (q: any) => Promise<any> | undefined;
  ann: (params: any) => Promise<any> | undefined;

}

// ---------------------------
// 📌 Hook
// ---------------------------

export function useSatori(initial?: SatoriCredentials): UseSatori {
  const [connected, setConnected] = useState(false);
  const [credentials, setCredentialsState] = useState<SatoriCredentials>(initial || {});
  const clientRef = useRef<SatoriClient | null>(null);

  // ---------------------------
  // 👉 Set credentials
  // ---------------------------
  const setCredentials = useCallback((creds: SatoriCredentials) => {
    setCredentialsState(prev => ({ ...prev, ...creds }));
  }, []);

  // ---------------------------
  // 👉 Connect
  // ---------------------------
  const connect = useCallback(
    async (creds?: SatoriCredentials) => {
      if (creds) {
        setCredentials(creds);
      }

      const { url, username, password } = { ...credentials, ...creds };

      if (!url || !username || !password) {
        throw new Error("Missing credentials: url, username and password are required.");
      }

   

      const client = new SatoriClient({
        url: url,
        username,
        password
      });

      clientRef.current = client;

      await client.connect();
      setConnected(true);
    },
    [credentials, setCredentials]
  );

  // ---------------------------
  // 👉 Disconnect
  // ---------------------------

  // ---------------------------
  // 👉 Proxy methods
  // ---------------------------

  const get = useCallback((key: any) => {
    return clientRef.current?.get(key);
  }, []);

  const set = useCallback((key: any, value?: any) => {
    return clientRef.current?.set(key, value);
  }, []);

  const ask = useCallback((question: any) => {
    return clientRef.current?.ask(question);
  }, []);

  const query = useCallback((q: any) => {
    return clientRef.current?.query(q);
  }, []);

  const ann = useCallback((params: any) => {
    return clientRef.current?.ann(params);
  }, []);


  // ---------------------------
  // 👉 Return object
  // ---------------------------
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
