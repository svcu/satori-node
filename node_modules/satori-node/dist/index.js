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
var import_tls = __toESM(require("tls"));
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
      const client = import_tls.default.connect({ host: this.host, port: this.port, rejectUnauthorized: false });
      client.on("error", (err) => {
      });
      return client;
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
      const socket = yield this.getSocket();
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
          const dataStr = data.toString();
          if (dataStr == "OK") {
            socket.destroy();
            resolve(true);
          } else {
            resolve(dataStr);
          }
        });
      });
    });
  }
  get(payload) {
    return __async(this, null, function* () {
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
          const data_json = JSON.parse(data.toString());
          if (data_json.key == "not found") {
            resolve(void 0);
          }
          resolve(data_json);
        });
      });
    });
  }
  put(payload) {
    return __async(this, null, function* () {
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "PUT";
      const socket = yield this.getSocket();
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET_VERTEX";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
          try {
            const data_json = JSON.parse(data.toString());
            resolve(data_json);
          } catch (e) {
            resolve(void 0);
          }
        });
      });
    });
  }
  deleteVertex(payload) {
    return __async(this, null, function* () {
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_VERTEX";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DFS";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET_ALL_WITH";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
          try {
            const data_json = JSON.parse(data.toString());
            resolve(data_json);
          } catch (e) {
            resolve(void 0);
          }
        });
      });
    });
  }
  getOneWith(payload) {
    return __async(this, null, function* () {
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET_ONE_WITH";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
          try {
            const data_json = JSON.parse(data.toString());
            resolve(data_json);
          } catch (e) {
            resolve(void 0);
          }
        });
      });
    });
  }
  putAllWith(payload) {
    return __async(this, null, function* () {
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "PUT_ALL_WITH";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "PUT_ONE_WITH";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_ONE_WITH";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "SET_REF";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_REFS";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET_REFS";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
          try {
            const data_json = JSON.parse(data.toString());
            resolve(data_json);
          } catch (e) {
            resolve(void 0);
          }
        });
      });
    });
  }
  setUser(payload) {
    return __async(this, null, function* () {
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "SET_USER";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET_USER";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
          try {
            const data_json = JSON.parse(data.toString());
            resolve(data_json);
          } catch (e) {
            resolve(void 0);
          }
        });
      });
    });
  }
  putUser(payload) {
    return __async(this, null, function* () {
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "PUT_USER";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_USER";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_AUTH";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "INJECT";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
          try {
            const data_json = JSON.parse(data.toString());
            resolve(data_json);
          } catch (e) {
            resolve(data.toString());
          }
        });
      });
    });
  }
  getAll(payload) {
    return __async(this, null, function* () {
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "GET_ALL";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
          try {
            const data_json = JSON.parse(data.toString());
            resolve(data_json);
          } catch (e) {
            resolve(void 0);
          }
        });
      });
    });
  }
  deleteAll(payload) {
    return __async(this, null, function* () {
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_ALL";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_ALL_WITH";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "PUSH";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "REMOVE";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "POP";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "SPLICE";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DECRYPT";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "PUT_ALL";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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
      const socket = yield this.getSocket();
      if (this.username) payload.username = this.username;
      if (this.token) payload.token = this.token;
      payload.command = "DELETE_REF";
      socket.write(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        socket.on("data", (data) => {
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