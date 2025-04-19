import { EncryptPayload } from "./models/encrypt";
import { GetPayload } from "./models/get";
import { PutPayload } from "./models/put";
import { SetPayload } from "./models/set";
import { SetVertexPayload } from "./models/set_vertex";
import { DeleteVertexPayload } from "./models/delete_vertex";
import { DFSPayload } from "./models/dfs";
import { DeletePayload, SetRefPayload } from "./models";
import { DeleteRefsPayload } from "./models/delete_refs";
import { PushPayload } from "./models/push";
import { PopPayload } from "./models/pop";
import { PutAllPayload } from "./models/put_all";
import { DeleteRefPayload } from "./models/delete_ref";
import WebSocket from "ws";
import { QueryPayload } from "./models/query";

export default class Satori {
  host!: string;
  port!: number;
  username!: string;
  password!: string;
  network_pwd!: string;
  socket!: WebSocket;

  constructor(
    host: string,
    port: number,
    username?: string,
    password?: string,
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
    if (password) this.password = password;
  }

  setHost(host: string) {
    this.host = host;
  }

  setPort(port: number) {
    this.port = port;
  }

  async getSocket(): Promise<boolean> {
    const skport = this.port + 11;
    const ws = new WebSocket("ws://" + this.host + ":" + skport);
    return new Promise((resolve, reject) => {
      ws.onopen = (e: WebSocket.Event) => {
        this.socket = ws;
        resolve(true);
      };
      ws.onerror = (e: WebSocket.ErrorEvent) => {
        throw new Error("Error connecting");
      };
    });
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
    if (this.password) payload.password = this.password;
    payload.command = "SET";

    if (this.socket == null) {
      await this.getSocket();
    }

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data =>{
        const dataStr: string = data.toString();

        if (dataStr == "OK") {
          this.socket.close();

          resolve(true);
        } else {
          if(dataStr != JSON.stringify(payload)){
            resolve(dataStr);
          }
        }
      });
    });
  }

  
  async get(payload: GetPayload): Promise<any | undefined> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "GET";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {

      this.socket.on("message", data =>{
        const data_json = JSON.parse(data.toString());

        if (data_json.key == "not found") {
          resolve(undefined);
        }

        if(data_json != payload){
          resolve(data_json);
        }
      });
      
    });
  }


  async query(payload: QueryPayload): Promise<any | undefined> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "QUERY";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {

      this.socket.on("message", data =>{
        const data_json = JSON.parse(data.toString());

        if (data_json.key == "not found") {
          resolve(undefined);
        }

        if(data_json != payload){
          resolve(data_json);
        }
      });
      
    });
  }

  async put(payload: PutPayload): Promise<boolean> {
    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "PUT";

    if (this.socket == null) {
      await this.getSocket();
    }

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {

      this.socket.on("message", data => {
        

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
      
    });
  }

  async delete(payload: DeletePayload): Promise<boolean> {
    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "DELETE";

    if (this.socket == null) {
      await this.getSocket();
    }

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {
        

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }

  async encrypt(payload: EncryptPayload): Promise<boolean> {
    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "ENCRYPT";

    if (this.socket == null) {
      await this.getSocket();
    }

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }

  async setVertex(payload: SetVertexPayload): Promise<boolean> {
    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "SET_VERTEX";

    if (this.socket == null) {
      await this.getSocket();
    }

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }

  async getVertex(payload: GetPayload): Promise<any | undefined> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "GET_VERTEX";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {

      this.socket.onmessage = (data) =>{
        try {
          const data_json = JSON.parse(data.toString());

          if(data_json != payload){
            resolve(data_json);
          }
        } catch {
          resolve(undefined);
        }
      }

      
    });
  }

  async deleteVertex(payload: DeleteVertexPayload): Promise<Boolean> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "DELETE_VERTEX";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }

  async dfs(payload: DFSPayload): Promise<any | undefined> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "DFS";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
        this.socket.on("message", data => {
          try {

              resolve(JSON.parse(data.toString()));

            
          } catch {
            resolve(undefined);
          }
        })
    });
  }


  async setRef(payload: SetRefPayload): Promise<Boolean> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "SET_REF";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }

  async deleteRefs(payload: DeleteRefsPayload): Promise<Boolean> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "DELETE_REFS";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }

  async getRefs(payload: DeleteRefsPayload): Promise<any[] | undefined> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "GET_REFS";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {try {
          const data_json = JSON.parse(data.toString());

          if(data_json != payload) resolve(data_json);

        } catch {
          resolve(undefined);
        }})
    });
  }
/*
  async setUser(payload: SetUserPayload): Promise<Boolean> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "SET_USER";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {
  

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }

  async getUser(payload: GetUserPayload): Promise<any | undefined> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "GET_USER";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {try {
          const data_json = JSON.parse(data.toString());

          if(data_json != payload) resolve(data_json);

        } catch {
          resolve(undefined);
        }})
    });
  }

  async putUser(payload: PutUserPayload): Promise<Boolean> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "PUT_USER";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {
        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }
*/
 /* async deleteUser(payload: DeleteUserPayload): Promise<Boolean> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "DELETE_USER";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }

  async deleteAuth(payload: Command): Promise<Boolean> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "DELETE_AUTH";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }*/

  async push(payload: PushPayload): Promise<Boolean> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "PUSH";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }

  async remove(payload: PushPayload): Promise<Boolean> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "REMOVE";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }

  async pop(payload: PopPayload): Promise<Boolean> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "POP";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }

  async splice(payload: PopPayload): Promise<Boolean> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "SPLICE";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }

  async decrypt(payload: EncryptPayload): Promise<Boolean> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "DECRYPT";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }

  async delete_ref(payload: DeleteRefPayload): Promise<Boolean> {
    if (this.socket == null) {
      await this.getSocket();
    }

    if (this.username) payload.username = this.username;
    if (this.password) payload.password = this.password;
    payload.command = "DELETE_REF";

    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.socket.on("message", data => {

        if (data.toString() == "OK") {
          resolve(true);
        } else {
          reject(false)
        }
      });
    });
  }
}
