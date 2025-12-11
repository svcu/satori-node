var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
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

// src/satori.ts
import { v4 as uuidv4 } from "uuid";
var NodeWebSocket = null;
if (typeof window === "undefined") {
  NodeWebSocket = __require("ws");
}
function createWebSocket(url) {
  if (typeof window !== "undefined") {
    return new window.WebSocket(url);
  }
  return new NodeWebSocket(url);
}
var Satori = class {
  constructor({ username, password, host }) {
    this.ws = null;
    this.pending = /* @__PURE__ */ new Map();
    this.subscriptions = /* @__PURE__ */ new Map();
    this.username = username;
    this.password = password;
    this.host = host;
  }
  /**
   * Connect to Satori WebSocket
   */
  connect() {
    return __async(this, null, function* () {
      this.ws = createWebSocket(this.host);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "notification" && msg.key && this.subscriptions.has(msg.key)) {
          this.subscriptions.get(msg.key)(msg.data);
          return;
        }
        if (msg.id && this.pending.has(msg.id)) {
          this.pending.get(msg.id)(msg);
          this.pending.delete(msg.id);
        }
      };
      return new Promise((resolve, reject) => {
        if (!this.ws) return reject();
        this.ws.onopen = () => resolve();
        this.ws.onerror = (err) => reject(err);
      });
    });
  }
  /**
   * Send a command
   */
  send(commandPayload) {
    return new Promise((resolve) => {
      var _a;
      const id = uuidv4();
      const msg = __spreadValues({
        username: this.username,
        password: this.password,
        id
      }, commandPayload);
      this.pending.set(id, resolve);
      (_a = this.ws) == null ? void 0 : _a.send(JSON.stringify(msg));
    });
  }
  // ---- Operations (unchanged) ----
  set(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "SET" }, payload));
    });
  }
  push(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "PUSH" }, payload));
    });
  }
  pop(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "POP" }, payload));
    });
  }
  splice(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "SPLICE" }, payload));
    });
  }
  remove(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "REMOVE" }, payload));
    });
  }
  get(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "GET" }, payload));
    });
  }
  put(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "PUT" }, payload));
    });
  }
  delete(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "DELETE" }, payload));
    });
  }
  setVertex(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "SET_VERTEX" }, payload));
    });
  }
  getVertex(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "GET_VERTEX" }, payload));
    });
  }
  deleteVertex(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "DELETE_VERTEX" }, payload));
    });
  }
  dfs(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "DFS" }, payload));
    });
  }
  encrypt(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "ENCRYPT" }, payload));
    });
  }
  decrypt(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "DECRYPT" }, payload));
    });
  }
  train() {
    return __async(this, null, function* () {
      return this.send({ command: "TRAIN", type: "train" });
    });
  }
  ann(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "ANN" }, payload));
    });
  }
  ask(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "ASK" }, payload));
    });
  }
  query(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "QUERY" }, payload));
    });
  }
  memory_stats() {
    return __async(this, null, function* () {
      return this.send({ command: "MEMORY_STATS" });
    });
  }
  cpu_stats() {
    return __async(this, null, function* () {
      return this.send({ command: "CPU_STATS" });
    });
  }
  get_operations() {
    return __async(this, null, function* () {
      return this.send({ command: "GET_OPERATIONS" });
    });
  }
  get_insights() {
    return __async(this, null, function* () {
      return this.send({ command: "INSIGHTS" });
    });
  }
  set_middleware(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "SET_MIDDLEWARE" }, payload));
    });
  }
  /**
   * Subscriptions
   */
  notify(key, callback) {
    var _a;
    this.subscriptions.set(key, callback);
    (_a = this.ws) == null ? void 0 : _a.send(JSON.stringify({
      command: "NOTIFY",
      key,
      id: uuidv4(),
      username: this.username,
      password: this.password
    }));
  }
};

// src/schema.ts
import { v4 as uuidv42 } from "uuid";
export {
  Satori
};
//# sourceMappingURL=index.mjs.map