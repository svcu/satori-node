
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

### Create or Update Data

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

## 📝 Complete Example

```js
const client = new Satori({ username, password, host });
await client.connect();

await client.set({
  key: 'user:1',
  data: { name: 'Carlos', age: 30 },
  type: 'user'
});

client.notify('user:1', data => {
  console.log('Real-time update:', data);
});
```

---

## 🧠 Key Concepts

- **key**: Unique identifier of the object.
- **type**: Object type (e.g., 'user').
- **field_array**: Advanced filters for bulk operations.
- **notifications**: Subscription to real-time changes.
- **vertices**: Graph-like relationships between objects.

---

## 💬 Questions or Suggestions?

Feel free to open an issue or contribute!  
With ❤️ from the Satori team.

---
