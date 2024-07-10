import { EncryptPayload } from "./models/encrypt";
import { GetPayload } from "./models/get";
import { PutPayload } from "./models/put";
import { SetPayload } from "./models/set";
import { Socket } from "net";
import { SetVertexPayload } from "./models/set_vertex";
import { DeleteVertexPayload } from "./models/delete_vertex";
import { DFSPayload } from "./models/dfs";
import { GetAllWithPayload } from "./models/get_all_with";
import { PutAllWithPayload } from "./models/put_all_with";
import { Command } from "./models/command";
import { SetUserPayload } from "./models/set_user";
import { GetUserPayload } from "./models/get_user";
import { PutUserPayload } from "./models/put_user";
import { DeleteUserPayload } from "./models/delete_user";
import { InjectPayload } from "./models/inject";
import { GetAllPayload } from "./models/get_all";
import { DeletePayload, SetRefPayload } from "./models";
import { DeleteRefsPayload } from "./models/delete_refs";
import { DeleteAllWithPayload } from "./models/delete_all_with";
import { PushPayload } from "./models/push";
import { PopPayload } from "./models/pop";
import { PutAllPayload } from "./models/put_all";
import { DeleteRefPayload } from "./models/delete_ref";
import tls from "tls"



export default class Satori {
  host!: string;
  port!: number;
  username!: string;
  token!: string;
  network_pwd!: string;

  constructor(
    host: string,
    port: number,
    username?: string,
    token?: string,
    network_pwd?: string
  ) {
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

  setHost(host: string) {
    this.host = host;
  }

  setPort(port: number) {
    this.port = port;
  }

  async getSocket(): Promise<tls.TLSSocket> {
    
    const client = tls.connect({host: this.host, port: this.port, rejectUnauthorized: false});
    client.on("error", err => {
      
    })
    
    return client;

  }

  async set(payload: SetPayload): Promise<string | boolean> {
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

    const socket = await this.getSocket();

    socket.write(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      socket.on("data", (data) => {
        const dataStr: string = data.toString();

        if (dataStr == "OK") {
          socket.destroy();
          resolve(true);
        } else {
          resolve(dataStr);
        }
      });
    });
  }

  async get(payload: GetPayload): Promise<any | undefined> {
    const socket = await this.getSocket();

    if (this.username) payload.username = this.username;
    if (this.token) payload.token = this.token;
    payload.command = "GET";

    socket.write(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      socket.on("data", (data) => {
        const data_json = JSON.parse(data.toString());

        if (data_json.key == "not found") {
          resolve(undefined);
        }

        resolve(data_json);
      });
    });
  }

  async put(payload: PutPayload): Promise<boolean> {
    if (this.username) payload.username = this.username;
    if (this.token) payload.token = this.token;
    payload.command = "PUT";

    const socket = await this.getSocket();
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
  }

  async delete(payload: DeletePayload): Promise<boolean> {
    if (this.username) payload.username = this.username;
    if (this.token) payload.token = this.token;
    payload.command = "DELETE";

    const socket = await this.getSocket();
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
  }

  async encrypt(payload: EncryptPayload): Promise<boolean> {
    if (this.username) payload.username = this.username;
    if (this.token) payload.token = this.token;
    payload.command = "ENCRYPT";

    const socket = await this.getSocket();
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
  }

  async setVertex(payload: SetVertexPayload): Promise<boolean> {
    if (this.username) payload.username = this.username;
    if (this.token) payload.token = this.token;
    payload.command = "SET_VERTEX";

    const socket = await this.getSocket();
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
  }

  async getVertex(payload: GetPayload): Promise<any | undefined> {
    const socket = await this.getSocket();

    if (this.username) payload.username = this.username;
    if (this.token) payload.token = this.token;
    payload.command = "GET_VERTEX";

    socket.write(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      socket.on("data", (data) => {
        try {
          const data_json = JSON.parse(data.toString());

          resolve(data_json);
        } catch {
          resolve(undefined);
        }
      });
    });
  }

  async deleteVertex(payload: DeleteVertexPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async dfs(payload: DFSPayload): Promise<any | undefined> {
    const socket = await this.getSocket();

    if (this.username) payload.username = this.username;
    if (this.token) payload.token = this.token;
    payload.command = "DFS";

    socket.write(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      socket.on("data", (data) => {
        try {
          resolve(JSON.parse(data.toString()));
        } catch {
          resolve(undefined);
        }
      });
    });
  }

  async getAllWith(payload: GetAllWithPayload): Promise<any[] | undefined> {
    const socket = await this.getSocket();

    if (this.username) payload.username = this.username;
    if (this.token) payload.token = this.token;
    payload.command = "GET_ALL_WITH";

   socket.write(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      socket.on("data", (data) => {
        try {
          const data_json = JSON.parse(data.toString());

          resolve(data_json);
        } catch {
          resolve(undefined);
        }
      });
    });
  }

  async getOneWith(payload: GetAllWithPayload): Promise<any | undefined> {
    const socket = await this.getSocket();

    if (this.username) payload.username = this.username;
    if (this.token) payload.token = this.token;
    payload.command = "GET_ONE_WITH";

   socket.write(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      socket.on("data", (data) => {
        try {
          const data_json = JSON.parse(data.toString());

          resolve(data_json);
        } catch {
          resolve(undefined);
        }
      });
    });
  }

  async putAllWith(payload: PutAllWithPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async putOneWith(payload: PutAllWithPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async deleteOneWith(payload: GetAllWithPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async setRef(payload: SetRefPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async deleteRefs(payload: DeleteRefsPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async getRefs(payload: DeleteRefsPayload): Promise<any[] | undefined> {
    const socket = await this.getSocket();

    if (this.username) payload.username = this.username;
    if (this.token) payload.token = this.token;
    payload.command = "GET_REFS";

   socket.write(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      socket.on("data", (data) => {
        try {
          const data_json = JSON.parse(data.toString());

          resolve(data_json);
        } catch {
          resolve(undefined);
        }
      });
    });
  }

  async setUser(payload: SetUserPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async getUser(payload: GetUserPayload): Promise<any | undefined> {
    const socket = await this.getSocket();

    if (this.username) payload.username = this.username;
    if (this.token) payload.token = this.token;
    payload.command = "GET_USER";

   socket.write(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      socket.on("data", (data) => {
        try {
          const data_json = JSON.parse(data.toString());

          resolve(data_json);
        } catch {
          resolve(undefined);
        }
      });
    });
  }

  async putUser(payload: PutUserPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async deleteUser(payload: DeleteUserPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async deleteAuth(payload: Command): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async inject(payload: InjectPayload): Promise<any | undefined> {
    const socket = await this.getSocket();

    if (this.username) payload.username = this.username;
    if (this.token) payload.token = this.token;
    payload.command = "INJECT";

   socket.write(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      socket.on("data", (data) => {
        try {
          const data_json = JSON.parse(data.toString());
          resolve(data_json);
        } catch {
          resolve(data.toString());
        }
      });
    });
  }

  async getAll(payload: GetAllPayload): Promise<any[] | undefined> {
    const socket = await this.getSocket();

    if (this.username) payload.username = this.username;
    if (this.token) payload.token = this.token;
    payload.command = "GET_ALL";

   socket.write(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      socket.on("data", (data) => {
        try {
          const data_json = JSON.parse(data.toString());

          resolve(data_json);
        } catch {
          resolve(undefined);
        }
      });
    });
  }

  async deleteAll(payload: GetAllPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async deleteAllWith(payload: DeleteAllWithPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async push(payload: PushPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async remove(payload: PushPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async pop(payload: PopPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async splice(payload: PopPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async decrypt(payload: EncryptPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async put_all(payload: PutAllPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }

  async delete_ref(payload: DeleteRefPayload): Promise<Boolean> {
    const socket = await this.getSocket();

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
  }
}
