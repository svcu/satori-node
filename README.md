# 📚 Satori Node.js SDK

Welcome to the official documentation for **Satori Node.js SDK**! 🚀  
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
  host: 'ws://localhost:8000'
});

await client.connect();
```

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

Receive automatic updates when an object changes!

```js
client.notify('user:123', data => {
  console.log('User updated!', data);
});
```

To stop receiving notifications:

```js
client.unnotify('user:123');
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

And traverse the graph with DFS:

```js
await client.dfs({ node: 'user:123', encryption_key: 'secret' });
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
- Array methods: `push`, `pop`, `splice`, `remove`

---

## 📦 Array and Reference Manipulation Methods

Below are the available methods to manipulate arrays and references in the Satori database using the Node.js client:

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

### 🔹 setRef
Sets a reference to another object.
```js
await client.setRef({ key: 'user:123', ref: 'profile:123' });
```
- **key**: Source object key.
- **ref**: Reference object key.

### 🔹 getRefs
Retrieves all references for an object.
```js
await client.getRefs({ key: 'user:123' });
```
- **key**: Object key.

### 🔹 deleteRef
Deletes a specific reference from an object.
```js
await client.deleteRef({ key: 'user:123', ref: 'profile:123' });
```
- **key**: Source object key.
- **ref**: Reference object key to delete.

---


##  📘 Function Documentation: `ask()` and `query()` – Satori SDK

## ✨ Function: `train()`
Fine-tunning of an embedding model with your data.
```js
await client.train()
```

## ✨ Function: `ask()`

Performs a natural language question about the database content. This operation is designed to interpret human intentions and generate responses based on stored data. `backend` is set to openai by default, in case of using openai as backend you must have set the env variable `OPENAI_API_KEY`.

### 🔷 Payload (`AskPayload`)

```js
await client.ask({
  question: "How many users do we have"
  backend: "openai"
})
```

```ts
{
  question: string;
  backend?: string;
}
```

#### Fields:
| Field       | Type     | Required     | Description |
|-------------|----------|--------------|-------------|
| `question`  | `string` | ✅ Yes        | Natural language question that will be interpreted to answer based on stored data. |
| `backend`   | `string` | ❌ Optional   | Name of the backend to use for answering the question (e.g., `"openai:gpt-4"` or `"ollama:llama3:8b"`). If omitted defaults to, `openai:gpt-4o-mini`

### 🧠 Operation
- Does not require specific keys or predefined structures.
- Interprets the intention of the question and responds with clear wording.
- Can be used, for example, for:
  - `"What was the last sale made?"`
  - `"How many users registered in June?"`
  - `"What products are most popular in Colombia?"`

### ⚠️ Rules
- Fields `key`, `field_array`, and `value` should not be included.
- Can use trained models (`train()`) or semantic/vector search.

---

## ✨ Function: `query()`

Executes an advanced query using natural language or pseudo-SQL to obtain structured data from the database.

### 🔷 Payload (`QueryPayload`)
```ts
{
  query: string;
  backend?: string;
}
```

#### Fields:
| Field       | Type     | Required     | Description |
|-------------|----------|--------------|-------------|
| `query`     | `string` | ✅ Yes        | Query in natural language or SQL-like format to retrieve specific data. |
| `backend`   | `string` | ❌ Optional   | Execution backend (e.g., `"openai:gpt-4"` or `"ollama:llama3:8b"`). If omitted defaults to, `openai:gpt-4o-mini` |

### 🧠 Operation
- Returns **structured data**, such as objects, arrays, or tables. Make operations with natural language
- Accepts filters, conditions, and aggregations. Examples:
  - `"Give me all users who registered after January 1, 2024"`
  - `"Tell me how many orders have status 'pending'"`
  - `"Insert a new order with price $30"`

### ⚠️ Rules
- The query must have enough context to infer the necessary fields.


---

## 🧪 Examples

### `ask()` example
```json
{
  "question": "What was the last transaction made?"
}
```

**Response:**
```json
{
  "answer": "The last transaction was on July 28, 2025 for a value of $300."
}
```

---

### `query()` example
```json
{
  "query": "Give me all users registered after June 2024"
}

{
  "query": "Create an object with name jhon and email example@example.com"
}
```

**Response:**
```json
[
  { "user_id": "abc123", "name": "María", "signup_date": "2024-07-01" },
  { "user_id": "def456", "name": "Luis", "signup_date": "2024-08-03" }
]
```

---

## 📌 Additional notes

- Both functions can benefit from the previous `train()` command to improve their contextual understanding.
- It is recommended to use `ask()` for questions that involve reasoning (a conversation) and `query()` for queries like inserting an object, modifying it, etc...

---