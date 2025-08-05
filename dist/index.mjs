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
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import { spawn, spawnSync } from "child_process";
var Satori = class {
  /**
   * Creates an instance of Satori.
   */
  constructor({ username, password, host }) {
    this.ws = null;
    this.pending = /* @__PURE__ */ new Map();
    this.subscriptions = /* @__PURE__ */ new Map();
    this.username = username;
    this.password = password;
    this.host = host;
  }
  /**
   * Connects to the WebSocket server.
   */
  run() {
    return __async(this, null, function* () {
      try {
        let port = this.host.split(":")[2] || "8000";
        console.log("Iniciando Satori en segundo plano...");
        if (this.username && this.password) {
          const satoriProcess = spawn("satori", ["-a", this.username, this.password, "-h", "-port", port], {
            stdio: "ignore",
            // Ignorar la salida para que no se bloquee
            shell: true,
            detached: true,
            windowsHide: true
            // Ocultar la ventana en Windows
          });
          satoriProcess.unref();
        } else {
          const satoriProcess = spawn("satori", ["-h", "-port", port], {
            stdio: "ignore",
            // Ignorar la salida para que no se bloquee
            shell: true,
            detached: true,
            windowsHide: true
            // Ocultar la ventana en Windows
          });
          satoriProcess.unref();
        }
        console.log("Esperando 3 segundos para que el servidor inicie...");
        yield new Promise((resolve) => setTimeout(resolve, 3e3));
        console.log("Satori iniciado correctamente en segundo plano");
      } catch (error) {
        console.error("Failed to start Satori:", error);
        throw error;
      }
    });
  }
  update() {
    return __async(this, null, function* () {
      try {
        const result = spawnSync("satoridb", ["update"], {
          stdio: "inherit",
          shell: true
        });
        if (result.error) {
          console.error("Error updating Satori:", result.error);
          throw result.error;
        }
        if (result.status !== 0) {
          console.error("Satori update failed with code:", result.status);
          throw new Error(`Satori update failed with code: ${result.status}`);
        }
        console.log("Satori updated successfully");
      } catch (error) {
        console.error("Failed to update Satori:", error);
        throw error;
      }
    });
  }
  connect() {
    return __async(this, null, function* () {
      this.ws = new WebSocket(this.host);
      this.ws.on("message", (data) => {
        var _a, _b;
        const msg = JSON.parse(data.toString());
        if (msg.type === "notification" && msg.key && this.subscriptions.has(msg.key)) {
          (_a = this.subscriptions.get(msg.key)) == null ? void 0 : _a(msg.data);
          return;
        }
        if (msg.id && this.pending.has(msg.id)) {
          (_b = this.pending.get(msg.id)) == null ? void 0 : _b(msg);
          this.pending.delete(msg.id);
        }
      });
      return new Promise((resolve, reject) => {
        if (!this.ws) return reject();
        this.ws.on("open", resolve);
        this.ws.on("error", reject);
      });
    });
  }
  /**
   * Sends a command with payload to the server.
   */
  send(commandPayload) {
    return new Promise((resolve) => {
      var _a;
      const id = uuidv4();
      const username = this.username;
      const password = this.password;
      let msg = __spreadValues({ username, password, id }, commandPayload);
      this.pending.set(id, resolve);
      (_a = this.ws) == null ? void 0 : _a.send(JSON.stringify(msg));
    });
  }
  /**
   * Performs a SET operation.
   */
  set(payload) {
    return __async(this, null, function* () {
      const command = "SET";
      return this.send(__spreadValues({ command }, payload));
    });
  }
  push(payload) {
    return __async(this, null, function* () {
      const command = "PUSH";
      return this.send(__spreadValues({ command }, payload));
    });
  }
  pop(payload) {
    return __async(this, null, function* () {
      const command = "POP";
      return this.send(__spreadValues({ command }, payload));
    });
  }
  splice(payload) {
    return __async(this, null, function* () {
      const command = "SPLICE";
      return this.send(__spreadValues({ command }, payload));
    });
  }
  remove(payload) {
    return __async(this, null, function* () {
      const command = "REMOVE";
      return this.send(__spreadValues({ command }, payload));
    });
  }
  /**
   * Performs a GET operation.
   */
  get(payload) {
    return __async(this, null, function* () {
      const command = "GET";
      return this.send(__spreadValues({ command }, payload));
    });
  }
  /**
   * Performs a PUT operation.
   */
  put(payload) {
    return __async(this, null, function* () {
      const command = "PUT";
      return this.send(__spreadValues({ command }, payload));
    });
  }
  /**
   * Performs a DELETE operation.
   */
  delete(payload) {
    return __async(this, null, function* () {
      const command = "DELETE";
      return this.send(__spreadValues({ command }, payload));
    });
  }
  /**
   * Performs a SET_VERTEX operation.
   */
  setVertex(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "SET_VERTEX" }, payload));
    });
  }
  /**
   * Performs a GET_VERTEX operation.
   */
  getVertex(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "GET_VERTEX" }, payload));
    });
  }
  /**
   * Performs a Natural Language Query 
   */
  query(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "QUERY" }, payload));
    });
  }
  /**
   * Performs a DELETE_VERTEX operation.
   */
  deleteVertex(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "DELETE_VERTEX" }, payload));
    });
  }
  /**
   * Performs a DFS traversal.
   */
  dfs(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "DFS" }, payload));
    });
  }
  /**
   * Encrypts data.
   */
  encrypt(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "ENCRYPT" }, payload));
    });
  }
  /**
   * Decrypts data.
   */
  decrypt(payload) {
    return __async(this, null, function* () {
      return this.send(__spreadValues({ command: "DECRYPT" }, payload));
    });
  }
  /**
   * Trains a fine-tunned embedding model for your data.
   */
  train() {
    return __async(this, null, function* () {
      return this.send({ command: "TRAIN", type: "train" });
    });
  }
  /**
   * Retrieves a list of Aproximate Nearest Neighbors.
   */
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
  /**
   * Subscribe to real-time changes of an object by key.
   * @param key - The key of the object to subscribe to
   * @param callback - Function called with updated data on each change
   * @example
   * client.notify('user:123', data => console.log('Updated:', data));
   */
  notify(key, callback) {
    var _a;
    this.subscriptions.set(key, callback);
    (_a = this.ws) == null ? void 0 : _a.send(JSON.stringify({ command: "NOTIFY", key, id: uuidv4(), username: this.username, password: this.password }));
  }
  /**
   * Unsubscribe from real-time notifications for a key.
   * @param key - The key to unsubscribe
   * @example
   * client.unnotify('user:123');
   */
};

// src/schema.ts
import { v4 as uuidv42 } from "uuid";
export {
  Satori
};
//# sourceMappingURL=index.mjs.map