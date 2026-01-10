# 📚 Satori Node.js SDK

Welcome to the official documentation for **Satori Node.js SDK**\! 🚀\
This library allows you to interact easily and efficiently with the Satori database via WebSockets, supporting CRUD operations, real-time notifications, and advanced queries.

---

## ✨ Main Features

- **Ultra-fast CRUD operations** ⚡
- **Advanced queries** using `field_array` 🔍
- **Real-time notifications** 📢
- **Graph-like relations** (vertices and references) 🕸️
- **Data encryption and decryption** 🔐

---

## 🚀 Installation

```bash
npm install satori-node
```

---

## 🏁 Basic Usage

```js
import { Satori } from 'satori-node';

const client = new Satori({
  username: 'user',
  password: 'password',
  host: 'ws://localhost:2310'
});

await client.connect();

```
If you are inserting a vector you must specify data to a [f32] and type to vector


---

## 🗃️ CRUD Operations

### Create Data

```js
await client.set({
  key: 'user:123',
  data: { name: 'John', email: 'john@example.com' },
  type: 'user' 
});
```

If you are inserting a vector you must specify data to a [f32] and type to vector

### Read Data

```js
const user = await client.get({ key: 'user:123' });
```

### Modify a Field

```js
await client.put({
  key: 'user:123',
  replace_field: 'name',
  replace_value: 'Peter'
});
```

### Delete Data

```js
await client.delete({ key: 'user:123' });
```

---

## 🧩 Advanced Queries with `field_array` 🔍

You can perform operations on multiple objects that meet certain conditions using the `field_array` field:

```js
await client.get({
  field_array: [
    { field: 'email', value: 'john@example.com' }
  ],
});
```

- **`field_array`** is an array of conditions `{ field, value }`.
- You can combine it with `one: true` to get only the first matching result.

---

## 🔔 Real-time Notifications

Receive automatic updates when an object changes\!

```js
client.notify('user:123', data => {
  console.log('User updated!', data);
});
```


---

## 🕸️ Relations and Graphs

You can create relationships between objects (vertices):

```js
await client.setVertex({
  key: 'user:123',
  vertex: 'friend:456',
  relation: 'friend',
  encryption_key: 'secret'
});
```

Retrieve vertices:

```js
await client.getVertex({ key: 'user:123', encryption_key: 'secret' });
```

Delete a vertex:

```js
await client.deleteVertex({ key: 'user:123', vertex: 'friend:456', encryption_key: 'secret' });
```

And traverse the graph with DFS:

```js
await client.dfs({ node: 'user:123', relation: 'friend', encryption_key: 'secret' });
```

Additional graph algorithms:

- **BFS Traversal**:
  ```js
  await client.graphBfs({ node: 'user:123' });
  ```

- **DFS Traversal**:
  ```js
  await client.graphDfs({ node: 'user:123' });
  ```

- **Shortest Path**:
  ```js
  await client.graphShortestPath({ node: 'user:123', target: 'user:456' });
  ```

- **Connected Components**:
  ```js
  await client.graphConnectedComponents();
  ```

- **Strongly Connected Components (SCC)**:
  ```js
  await client.graphScc();
  ```

- **Degree Centrality**:
  ```js
  await client.graphDegreeCentrality();
  ```

- **Closeness Centrality**:
  ```js
  await client.graphClosenessCentrality();
  ```

- **Graph Centroid**:
  ```js
  await client.graphCentroid();
  ```

---

## 🔐 Encryption and Security

Easily encrypt and decrypt data:

```js
await client.encrypt({ key: 'user:123', encryption_key: 'secret' });
await client.decrypt({ key: 'user:123', encryption_key: 'secret' });
```

---

## 🧰 Schema Class (Data Model)

You can use the `Schema` class to model your data in an object-oriented way:

```js
import Schema from 'satori-node/schema';

class User extends Schema {
  // Define your fields here
}

const user = new User({ name: 'Anna' }, client, 'user');
await user.set();
```

It includes useful methods such as:

- `set`, `delete`, `encrypt`, `setVertex`, `getVertex`, `deleteVertex`, `dfs`
- Graph methods: `graphBfs`, `graphDfs`, `graphShortestPath`, `graphConnectedComponents`, `graphScc`, `graphDegreeCentrality`, `graphClosenessCentrality`, `graphCentroid`
- Array methods: `push`, `pop`, `splice`, `remove`

---

## 📦 Array Manipulation Methods

Below are the available methods to manipulate arrays in the Satori database using the Node.js client:

### 🔹 push

Adds a value to an existing array in an object.

```js
await client.push({ key: 'user:123', array: 'friends', value: 'user:456' });
```

- **key**: Object key.
- **array**: Name of the array.
- **value**: Value to add.

### 🔹 pop

Removes the last element from an array in an object.

```js
await client.pop({ key: 'user:123', array: 'friends' });
```

- **key**: Object key.
- **array**: Name of the array.

### 🔹 splice

Modifies an array in an object (for example, to cut or replace elements).

```js
await client.splice({ key: 'user:123', array: 'friends' });
```

- **key**: Object key.
- **array**: Name of the array.

### 🔹 remove

Removes a specific value from an array in an object.

```js
await client.remove({ key: 'user:123', array: 'friends', value: 'user:456' });
```

- **key**: Object key.
- **array**: Name of the array.
- **value**: Value to remove.

---

## 🤖 AI Methods

Satori has AI features integrated that boost developers productivity. 

### 🔹 set_middleware
Make the LLM analyze incoming querys and decide if it must reject them, accept them or modify them.
```javascript
await client.set_middleware({
    "operation": "SET",
    "middleware": "Only accept requests that have the amount field specified, and convert its value to dollars"
});
```


### 🔹 ann

Perform an Aproximate Nearest Neighbors search

```javascript
await client.ann({'key' : 'user:123', 'top_k' : '5'});
```

- **key**: Source object key.
- **vector**: Vector of f32 instead of key
- **top_k**: Number of nearest neighbors to return

### 🔹 query

Make querys in natural language

```python
await client.query({'query' : 'Insert the value 5 into the grades array of user:123', 'backend' : 'openai:gpt-4o-mini'|);
```

- **query**: Your query in natural language.
- **ref**: The LLM backend. Must be `openai:model-name` or `ollama:model-name`, if not specified `openai:gpt-4o-mini` will be used as default. If you're using OpenAI as your backend you must specify the `OPENAI_API_KEY` env variable.

### 🔹 ask

Ask question about your data in natural language

```python
await client.ask({'question' : 'How many user over 25 years old do we have. Just return the number.', 'backend' : 'openai:gpt-4o-mini'});
```

- **question**: Your question in natural language.
- **ref**: The LLM backend. Must be `openai:model-name` or `ollama:model-name`, if not specified `openai:gpt-4o-mini` will be used as default. If you're using OpenAI as your backend you must specify the `OPENAI_API_KEY` env variable.

### 🔹 set_mindspace

Create or update a mindspace with a specific configuration.

```javascript
await client.set_mindspace({
  mindspace_id: 'my_mindspace',
  config: 'Configuration string for the mindspace'
});
```

- **mindspace_id** (optional): Identifier for the mindspace. If not provided, a default will be used.
- **config**: Configuration string defining the mindspace behavior.

### 🔹 delete_mindspace

Delete an existing mindspace.

```javascript
await client.delete_mindspace({
  mindspace_id: 'my_mindspace'
});
```

- **mindspace_id**: Identifier of the mindspace to delete.

### 🔹 chat_mindspace

Interact with a mindspace by sending a message.

```javascript
await client.chat_mindspace({
  mindspace_id: 'my_mindspace',
  message: 'Hello, how can you help me?'
});
```

- **mindspace_id**: Identifier of the mindspace to chat with.
- **message**: The message to send to the mindspace.

## Analytics

### 🔹 get_operations

Returns all operations executed on the database.

### 🔹 get_access_frequency

Returns the number of times an object has been queried or accessed.
```javascript
await client.get_access_frequency({'key' : 'jhon'})
```


## Responses

All responses obbey the following pattern:

```ts
{
  data: any //the requested data if any
  message: string //status message
  type: string //SUCCESS || ERROR
}
```

AI responses obbey a different patern:

## ask

```ts
{
  response: string //response to the question
}
```

## query

```ts
{
  result: string //response from the operation made in the db
  status: string //status
}
```

## ann

```ts
{
  results: array //response from the operation made in the db
}
```

## 🧠 Key Concepts

- **key**: Unique identifier of the object.
- **type**: Object type (e.g., 'user').
- **field_array**: Advanced filters for bulk operations.
- **notifications**: Subscription to real-time changes.
- **vertices**: Graph-like relationships between objects.

## 💬 Questions or Suggestions?

Feel free to open an issue or contribute\!
With ❤️ from the Satori team.

---
