"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
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
function createNodeSocket(url) {
  const socket = new import_ws.default(url);
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
var import_ws;
var init_transport_node = __esm({
  "src/core/transport-node.ts"() {
    "use strict";
    import_ws = __toESM(require("ws"));
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  SatoriClient: () => SatoriClient,
  useSatori: () => useSatori
});
module.exports = __toCommonJS(src_exports);

// src/core/SatoriClient.ts
var import_uuid = require("uuid");
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
      id: (0, import_uuid.v4)(),
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
var import_react = require("react");
function useSatori(options) {
  const clientRef = (0, import_react.useRef)(null);
  const [connected, setConnected] = (0, import_react.useState)(false);
  const [lastMessage, setLastMessage] = (0, import_react.useState)(null);
  if (!clientRef.current) {
    clientRef.current = new SatoriClient(options);
  }
  const client = clientRef.current;
  (0, import_react.useEffect)(() => {
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
var import_uuid2 = require("uuid");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SatoriClient,
  useSatori
});
//# sourceMappingURL=index.js.map