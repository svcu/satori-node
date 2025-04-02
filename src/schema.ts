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
import { v4 as uuidv4 } from "uuid";
import Satori from "./satori";
import { FieldEntry, SetRefPayload } from "./models";
import { Vertex } from "./models/vertex_list";

export default class Schema<T extends object> {

  satori!: Satori;
  schemaName!: string;
  body!: T;
  key!: string;

  constructor(body: T, satori: Satori, schemaName: string, key?: string) {
    this.body = body;
    this.satori = satori;

    if (key) {
      this.key = key;
    }
    this.key = uuidv4();
    this.schemaName = schemaName;
  }

  async set(): Promise<string | boolean> {
    return await this.satori.set({
      key: this.key,
      data: this.body,
      type: this.schemaName,
    });
  }

  async delete(): Promise<boolean> {
    return await this.satori.delete({ key: this.key });
  }

  async encrypt(encryption_key: string): Promise<boolean> {
    return await this.satori.encrypt({
      key: this.key,
      encryption_key: encryption_key,
    });
  }

  async setVertex(vertex: Vertex[], encryption_key?: string): Promise<boolean> {
    return await this.satori.setVertex({
      key: this.key,
      vertex: vertex,
      encryption_key: encryption_key,
    });
  } //relation

  async getVertex(): Promise<any | undefined> {
    return await this.satori.getVertex({ key: this.key });
  }

  async deleteVertex(
    vertex: string,
    encryption_key?: string
  ): Promise<Boolean> {
    return this.satori.deleteVertex({
      key: this.key,
      encryption_key: encryption_key,
      vertex: vertex,
    });
  }

  async dfs(relation?: string): Promise<any | undefined> {
    return this.satori.dfs({ node: this.key, relation: relation });
  }

 

  async setRef(ref: string): Promise<Boolean> {
    return await this.satori.setRef({ key: this.key, ref: ref });
  }

  async deleteRefs(encryption_key?: string): Promise<Boolean> {
    return await this.satori.deleteRefs({
      key: this.key,
      encryption_key: encryption_key,
    });
  }

  async getRefs(): Promise<any[] | undefined> {
    return await this.satori.getRefs({ key: this.key });
  }

 

  async push(value: any, array: string): Promise<Boolean> {
    return await this.satori.push({key: this.key, value: value, array: array})
  }

  async pop(array: string): Promise<Boolean> {
    return await this.satori.pop({key: this.key, array: array})
  }

  async splice(array: string): Promise<Boolean> {
    return await this.satori.splice({key: this.key, array: array})
  }

  async remove(value: any, array: string): Promise<Boolean> {
    return await this.satori.remove({key: this.key, value: value, array: array})
  }

  async decrypt(encryption_key: string): Promise<Boolean> {
    return await this.satori.decrypt({key: this.key, encryption_key: encryption_key})
  }

}
