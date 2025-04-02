"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Satori: () => Satori,
  Schema: () => Schema
});
module.exports = __toCommonJS(src_exports);

// src/satori.ts
var import_ws = __toESM(require("ws"));
var Satori = class {
  constructor(host, port, username, token, network_pwd) {
    this.host = host;
    this.port = port;
    if (network_pwd) {
      this.network_pwd = network_pwd;
    } else {
      this.network_pwd = "";
    }
    if (username) this.username = username;
    if (token) this.token = token;
  }
  setHost(host) {
    this.host = host;
  }
  setPort(port) {
    this.port = port;
  }
  getSocket() {
    return __async(this, null, function* () {
      const skport = this.port + 11;
      const ws = new import_ws.default("ws://" + this.host + ":" + skport);
      return new Promise((resolve, reject) => {
        ws.onopen = (e) => {
          this.socket = ws;
          resolve(true);
        };
        ws.onerror = (e) => {
          throw new Error("Error connecting");
        };
      });
    });
  }
  set(payload) {
    return __async(this, null, function* () {
      if (!payload.expires) payload.expires = false;
      if (!payload.expiration_time) payload.expiration_time = -1;
      if (!payload.type) payload.type = "normal";
      if (!payload.vertices) payload.vertices = [];
      if (payload.expiration_time) {
        if (payload.expiration_time > -1) payload.expires = true;
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "SET";
      if (this.socket == null) {
        yield this.getSocket();
      }
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          const dataStr = data.toString();
          if (dataStr == "OK") {
            this.socket.close();
            resolve(true);
          } else {
            if (dataStr != JSON.stringify(payload)) {
              resolve(dataStr);
            }
          }
        });
      });
    });
  }
  get(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          const data_json = JSON.parse(data.toString());
          if (data_json.key == "not found") {
            resolve(void 0);
          }
          if (data_json != payload) {
            resolve(data_json);
          }
        });
      });
    });
  }
  put(payload) {
    return __async(this, null, function* () {
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "PUT";
      if (this.socket == null) {
        yield this.getSocket();
      }
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  delete(payload) {
    return __async(this, null, function* () {
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE";
      if (this.socket == null) {
        yield this.getSocket();
      }
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  encrypt(payload) {
    return __async(this, null, function* () {
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "ENCRYPT";
      if (this.socket == null) {
        yield this.getSocket();
      }
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  setVertex(payload) {
    return __async(this, null, function* () {
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "SET_VERTEX";
      if (this.socket == null) {
        yield this.getSocket();
      }
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  getVertex(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET_VERTEX";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.onmessage = (data) => {
          try {
            const data_json = JSON.parse(data.toString());
            if (data_json != payload) {
              resolve(data_json);
            }
          } catch (e) {
            resolve(void 0);
          }
        };
      });
    });
  }
  deleteVertex(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_VERTEX";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  dfs(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DFS";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          try {
            resolve(JSON.parse(data.toString()));
          } catch (e) {
            resolve(void 0);
          }
        });
      });
    });
  }
  getAllWith(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET_ALL_WITH";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on(
          "message",
          (data) => {
            try {
              const data_json = JSON.parse(data.toString());
              if (data_json != payload) resolve(data_json);
            } catch (e) {
              resolve(void 0);
            }
          }
        );
      });
    });
  }
  getOneWith(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET_ONE_WITH";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          try {
            const data_json = JSON.parse(data.toString());
            if (data_json != payload) resolve(data_json);
          } catch (e) {
            resolve(void 0);
          }
        });
      });
    });
  }
  putAllWith(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "PUT_ALL_WITH";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  putOneWith(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "PUT_ONE_WITH";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  deleteOneWith(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_ONE_WITH";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  setRef(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "SET_REF";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  deleteRefs(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_REFS";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  getRefs(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET_REFS";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          try {
            const data_json = JSON.parse(data.toString());
            if (data_json != payload) resolve(data_json);
          } catch (e) {
            resolve(void 0);
          }
        });
      });
    });
  }
  setUser(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "SET_USER";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  getUser(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET_USER";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          try {
            const data_json = JSON.parse(data.toString());
            if (data_json != payload) resolve(data_json);
          } catch (e) {
            resolve(void 0);
          }
        });
      });
    });
  }
  putUser(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "PUT_USER";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  deleteUser(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_USER";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  deleteAuth(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_AUTH";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  inject(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "INJECT";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          try {
            const data_json = JSON.parse(data.toString());
            if (data_json != payload) resolve(data_json);
          } catch (e) {
            resolve(data.toString());
          }
        });
      });
    });
  }
  getAll(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET_ALL";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          try {
            const data_json = JSON.parse(data.toString());
            if (data_json != payload) resolve(data_json);
          } catch (e) {
            resolve(void 0);
          }
        });
      });
    });
  }
  deleteAll(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_ALL";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  deleteAllWith(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_ALL_WITH";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  push(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "PUSH";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  remove(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "REMOVE";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  pop(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "POP";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  splice(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "SPLICE";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  decrypt(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DECRYPT";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  put_all(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "PUT_ALL";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
  delete_ref(payload) {
    return __async(this, null, function* () {
      if (this.socket == null) {
        yield this.getSocket();
      }
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_REF";
      this.socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        this.socket.on("message", (data) => {
          if (data.toString() == "OK") {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    });
  }
};

// src/schema.ts
var import_uuid = require("uuid");
var Schema = class {
  constructor(body, satori, schemaName, key) {
    this.body = body;
    this.satori = satori;
    if (key) {
      this.key = key;
    }
    this.key = (0, import_uuid.v4)();
    this.schemaName = schemaName;
  }
  set() {
    return __async(this, null, function* () {
      return yield this.satori.set({
        key: this.key,
        data: this.body,
        type: this.schemaName
      });
    });
  }
  delete() {
    return __async(this, null, function* () {
      return yield this.satori.delete({ key: this.key });
    });
  }
  encrypt(encryption_key) {
    return __async(this, null, function* () {
      return yield this.satori.encrypt({
        key: this.key,
        encryption_key
      });
    });
  }
  setVertex(vertex, encryption_key) {
    return __async(this, null, function* () {
      return yield this.satori.setVertex({
        key: this.key,
        vertex,
        encryption_key
      });
    });
  }
  //relation
  getVertex() {
    return __async(this, null, function* () {
      return yield this.satori.getVertex({ key: this.key });
    });
  }
  deleteVertex(vertex, encryption_key) {
    return __async(this, null, function* () {
      return this.satori.deleteVertex({
        key: this.key,
        encryption_key,
        vertex
      });
    });
  }
  dfs(relation) {
    return __async(this, null, function* () {
      return this.satori.dfs({ node: this.key, relation });
    });
  }
  getAllWith(field_array) {
    return __async(this, null, function* () {
      return this.satori.getAllWith({
        field_array,
        type: this.schemaName
      });
    });
  }
  getOneWith(field_array) {
    return __async(this, null, function* () {
      return this.satori.getOneWith({
        field_array,
        type: this.schemaName
      });
    });
  }
  putAllWith(field_array, replaceField, replaceValue) {
    return __async(this, null, function* () {
      return this.satori.putAllWith({
        replace_field: replaceField,
        replace_value: replaceValue,
        type: this.schemaName,
        field_array
      });
    });
  }
  putOneWith(field_array, replaceField, replaceValue) {
    return __async(this, null, function* () {
      return this.satori.putOneWith({
        replace_field: replaceField,
        replace_value: replaceValue,
        type: this.schemaName,
        field_array
      });
    });
  }
  deleteOneWith(field_array) {
    return __async(this, null, function* () {
      return this.satori.deleteOneWith({
        field_array,
        type: this.schemaName
      });
    });
  }
  setRef(ref) {
    return __async(this, null, function* () {
      return yield this.satori.setRef({ key: this.key, ref });
    });
  }
  deleteRefs(encryption_key) {
    return __async(this, null, function* () {
      return yield this.satori.deleteRefs({
        key: this.key,
        encryption_key
      });
    });
  }
  getRefs() {
    return __async(this, null, function* () {
      return yield this.satori.getRefs({ key: this.key });
    });
  }
  getAll() {
    return __async(this, null, function* () {
      return yield this.satori.getAll({ type: this.schemaName });
    });
  }
  deleteAll() {
    return __async(this, null, function* () {
      return yield this.satori.deleteAll({ type: this.schemaName });
    });
  }
  deleteAllWith(field_array) {
    return __async(this, null, function* () {
      return yield this.satori.deleteAllWith({ field_array, type: this.schemaName });
    });
  }
  push(value, array) {
    return __async(this, null, function* () {
      return yield this.satori.push({ key: this.key, value, array });
    });
  }
  pop(array) {
    return __async(this, null, function* () {
      return yield this.satori.pop({ key: this.key, array });
    });
  }
  splice(array) {
    return __async(this, null, function* () {
      return yield this.satori.splice({ key: this.key, array });
    });
  }
  remove(value, array) {
    return __async(this, null, function* () {
      return yield this.satori.remove({ key: this.key, value, array });
    });
  }
  decrypt(encryption_key) {
    return __async(this, null, function* () {
      return yield this.satori.decrypt({ key: this.key, encryption_key });
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Satori,
  Schema
});
//# sourceMappingURL=index.js.map