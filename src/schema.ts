import {Satori}from "./satori";
import { v4 as uuidv4 } from 'uuid';

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

  async setVertex(vertex: string, relation: string, encryption_key?: string): Promise<boolean> {
    return await this.satori.setVertex({
      key: this.key,
      vertex: vertex,
      relation: relation,
      encryption_key: encryption_key,
    });
  } //relation

  async getVertex(encryption_key?: string): Promise<any | undefined> {
    return await this.satori.getVertex({ key: this.key, encryption_key });
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

  async dfs(relation?: string, encryption_key?: string): Promise<any | undefined> {
    return this.satori.dfs({ node: this.key, relation: relation, encryption_key });
  }

 

 
 

  async push(value: any, array: string, encryption_key?: string): Promise<Boolean> {
    return await this.satori.push({key: this.key, value: value, array: array, encryption_key})
  }

  async pop(array: string, encryption_key?: string): Promise<Boolean> {
    return await this.satori.pop({key: this.key, array: array, encryption_key})
  }

  async splice(array: string, encryption_key?: string): Promise<Boolean> {
    return await this.satori.splice({key: this.key, array: array, encryption_key})
  }

  async remove(value: any, array: string, encryption_key?: string): Promise<Boolean> {
    return await this.satori.remove({key: this.key, value: value, array: array, encryption_key})
  }

  async decrypt(encryption_key: string): Promise<Boolean> {
    return await this.satori.decrypt({key: this.key, encryption_key: encryption_key})
  }

}
