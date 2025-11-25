var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/core/transport-node.ts
var transport_node_exports = {};
__export(transport_node_exports, {
  createNodeSocket: () => createNodeSocket
});
import WS from "ws";
function createNodeSocket(url) {
  const socket = new WS(url);
  return {
    get readyState() {
      return socket.readyState;
    },
    send(data) {
      socket.send(data);
    },
    onopen: null,
    onmessage: null,
    onclose: null
  };
}
var init_transport_node = __esm({
  "src/core/transport-node.ts"() {
    "use strict";
  }
});

// src/core/transport-browser.ts
var transport_browser_exports = {};
__export(transport_browser_exports, {
  createBrowserSocket: () => createBrowserSocket
});
function createBrowserSocket(url) {
  const socket = new WebSocket(url);
  return socket;
}
var init_transport_browser = __esm({
  "src/core/transport-browser.ts"() {
    "use strict";
  }
});

// src/core/SatoriClient.ts
import { v4 as uuid } from "uuid";
var isBrowser = typeof window !== "undefined";
var SatoriClient = class {
  constructor(options) {
    this.ws = null;
    this.handlers = /* @__PURE__ */ new Set();
    this.connected = false;
    this.url = options.url;
    this.token = options.token;
  }
  connect() {
    return __async(this, null, function* () {
      if (this.ws) return;
      const { createNodeSocket: createNodeSocket2 } = yield Promise.resolve().then(() => (init_transport_node(), transport_node_exports)).catch(() => ({
        createNodeSocket: null
      }));
      const { createBrowserSocket: createBrowserSocket2 } = yield Promise.resolve().then(() => (init_transport_browser(), transport_browser_exports)).catch(() => ({
        createBrowserSocket: null
      }));
      const socketCreator = isBrowser ? createBrowserSocket2 : createNodeSocket2;
      if (!socketCreator) throw new Error("No WebSocket available.");
      const ws = socketCreator(this.url);
      this.ws = ws;
      return new Promise((resolve) => {
        ws.onopen = () => {
          this.connected = true;
          resolve();
        };
        ws.onmessage = (event) => {
          let json;
          try {
            json = JSON.parse(event.data);
          } catch (e) {
            return;
          }
          this.handlers.forEach((h) => h(json));
        };
        ws.onclose = () => {
          this.connected = false;
        };
      });
    });
  }
  onMessage(handler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }
  send(op, payload) {
    if (!this.ws || this.ws.readyState !== 1) {
      throw new Error("WebSocket is not ready");
    }
    const message = {
      id: uuid(),
      op,
      payload,
      token: this.token
    };
    this.ws.send(JSON.stringify(message));
    return message.id;
  }
  // API ----------
  request(op, payload) {
    return new Promise((resolve) => {
      const id = this.send(op, payload);
      const off = this.onMessage((msg) => {
        if (msg.id === id) {
          off();
          resolve(msg);
        }
      });
    });
  }
  get(key) {
    return this.request("GET", { key });
  }
  set(key, value) {
    return this.request("SET", { key, value });
  }
  ask(prompt) {
    return this.request("ASK", { prompt });
  }
  query(prompt) {
    return this.request("QUERY", { prompt });
  }
  ann(vector, top_k = 10) {
    return this.request("ANN", { vector, top_k });
  }
  train() {
    return this.request("TRAIN", {});
  }
  putAllWith(obj) {
    return this.request("PUT_ALL_WITH", obj);
  }
};

// src/react/useSatori.ts
import { useEffect, useRef, useState } from "react";
function useSatori(options) {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  if (!clientRef.current) {
    clientRef.current = new SatoriClient(options);
  }
  const client = clientRef.current;
  useEffect(() => {
    let unsubscribe;
    client.connect().then(() => {
      setConnected(true);
      unsubscribe = client.onMessage((msg) => {
        setLastMessage(msg);
      });
    });
    return () => {
      unsubscribe == null ? void 0 : unsubscribe();
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
    putAllWith: client.putAllWith.bind(client)
  };
}

// src/schema.ts
import { v4 as uuidv4 } from "uuid";
export {
  SatoriClient,
  useSatori
};
//# sourceMappingURL=index.mjs.map