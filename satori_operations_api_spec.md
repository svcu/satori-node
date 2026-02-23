# SatoriDB Operations API Specification

> **Version:** 1.0  
> **Purpose:** SDK Implementation Guide for Multi-Language Support  
> **Scope:** All non-session and non-agent operations documented for AI SDK generation

---

## Table of Contents

1. [Overview](#overview)
2. [Basic Operations](#basic-operations)
3. [Crypto Operations](#crypto-operations)
4. [Graph Operations](#graph-operations)
5. [AI Operations](#ai-operations)
6. [Analytics Operations](#analytics-operations)
7. [Mindspace Operations](#mindspace-operations)
8. [Common Data Types](#common-data-types)
9. [Response Format](#response-format)

---

## Overview

This document provides a comprehensive specification for implementing SatoriDB operations in multiple programming languages. Each operation includes:
- **Purpose**: What the operation does
- **Parameters**: Required and optional inputs
- **Return Value**: What the operation returns
- **Error Handling**: Common error scenarios

All operations are invoked via WebSocket with a JSON request format.

### Base Request Structure

```json
{
  "command": "OPERATION_NAME",
  "id": "unique-request-id",
  "username": "optional-username",
  "password": "optional-password",
  "key": "object-key",
  "data": { ... }
}
```

---

## Basic Operations

### SET

Creates a new object in the database.

**Command Name:** `SET`

**What it does:**  
Creates a new object with the specified key and data. If no key is provided, a UUID is automatically generated. The object is stored in memory and optionally persisted to disk.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "key": "generated-or-provided-key"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier (UUID recommended) |
| `key` | string | No | Object key. If omitted, a UUID is generated |
| `data` | JSON | No | Object data content (default: `{}`) |
| `type` | string | No | Object class/type (default: `"normal"`) |
| `expires` | boolean | No | Whether object expires (default: `false`) |
| `expiration_time` | integer | No | Expiration timestamp in milliseconds |
| `vertices` | array | No | Graph vertices/edges for this object |

**Example Request:**
```json
{
  "command": "SET",
  "id": "req-001",
  "key": "user:john",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  },
  "type": "user"
}
```

---

### GET

Retrieves one or more objects from the database.

**Command Name:** `GET`

**What it does:**  
Retrieves an object by key or searches for objects using field queries. If key is `"*"`, returns all objects in memory.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": { ... }  // Single object or array of objects
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `key` | string | No* | Object key to retrieve. Use `"*"` for all objects |
| `field_array` | array | No* | Query conditions for field-based search |
| `one` | boolean | No | Return only first match (default: `false`) |
| `max` | integer | No | Maximum results to return |
| `encryption_key` | string | No | Key to decrypt encrypted objects |

*Either `key` or `field_array` must be provided, but not both.

**Field Array Query Format:**
```json
{
  "field_array": [
    {"field": "fieldName", "value": "searchValue"}
  ]
}
```

**Example Request:**
```json
{
  "command": "GET",
  "id": "req-002",
  "key": "user:john"
}
```

---

### PUT

Updates an existing object's field(s).

**Command Name:** `PUT`

**What it does:**  
Updates one or more fields of an existing object. Can update a single object by key or batch update multiple objects using field queries.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `key` | string | No* | Object key to update |
| `field_array` | array | No* | Query to select objects for batch update |
| `replace_field` | string | Yes | Field name to update |
| `replace_value` | any | Yes | New value for the field |
| `encryption_key` | string | No | Key for encrypted objects |

*Either `key` or `field_array` must be provided.

**Example Request:**
```json
{
  "command": "PUT",
  "id": "req-003",
  "key": "user:john",
  "replace_field": "age",
  "replace_value": 31
}
```

---

### DELETE

Removes one or more objects from the database.

**Command Name:** `DELETE`

**What it does:**  
Deletes an object by key or deletes multiple objects matching a field query. Also removes associated embeddings and disk persistence.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `key` | string | No* | Object key to delete |
| `field_array` | array | No* | Query to select objects for deletion |

*Either `key` or `field_array` must be provided.

**Example Request:**
```json
{
  "command": "DELETE",
  "id": "req-004",
  "key": "user:john"
}
```

---

### PUSH

Adds a value to the end of an array field.

**Command Name:** `PUSH`

**What it does:**  
Appends a value to an array field within an object. Works with single objects or batch operations.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `key` | string | No* | Object key |
| `field_array` | array | No* | Query for batch operation |
| `array` | string | Yes | Name of the array field |
| `value` | any | Yes | Value to append |
| `encryption_key` | string | No | Key for encrypted objects |

*Either `key` or `field_array` must be provided.

**Example Request:**
```json
{
  "command": "PUSH",
  "id": "req-005",
  "key": "user:john",
  "array": "tags",
  "value": "premium"
}
```

---

### POP

Removes the last value from an array field.

**Command Name:** `POP`

**What it does:**  
Removes and returns the last element from an array field within an object.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `key` | string | No* | Object key |
| `field_array` | array | No* | Query for batch operation |
| `array` | string | Yes | Name of the array field |
| `encryption_key` | string | No | Key for encrypted objects |

*Either `key` or `field_array` must be provided.

**Example Request:**
```json
{
  "command": "POP",
  "id": "req-006",
  "key": "user:john",
  "array": "tags"
}
```

---

### SPLICE

Removes the first value from an array field.

**Command Name:** `SPLICE`

**What it does:**  
Removes the first element from an array field within an object.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `key` | string | Yes | Object key |
| `array` | string | Yes | Name of the array field |
| `encryption_key` | string | No | Key for encrypted objects |

**Example Request:**
```json
{
  "command": "SPLICE",
  "id": "req-007",
  "key": "user:john",
  "array": "notifications"
}
```

---

### REMOVE

Removes a specific value from an array field.

**Command Name:** `REMOVE`

**What it does:**  
Removes a specific value from an array field by finding and removing the first matching element.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `key` | string | No* | Object key |
| `field_array` | array | No* | Query for batch operation |
| `array` | string | Yes | Name of the array field |
| `value` | any | Yes | Value to remove |
| `encryption_key` | string | No | Key for encrypted objects |

*Either `key` or `field_array` must be provided.

**Example Request:**
```json
{
  "command": "REMOVE",
  "id": "req-008",
  "key": "user:john",
  "array": "tags",
  "value": "premium"
}
```

---

## Crypto Operations

### ENCRYPT

Encrypts an object's data.

**Command Name:** `ENCRYPT`

**What it does:**  
Encrypts the data field of an object using AES encryption. The encryption key must be provided and is used to lock the object data.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `key` | string | Yes | Object key to encrypt |
| `encryption_key` | string | Yes | Encryption key (used for decryption) |

**Example Request:**
```json
{
  "command": "ENCRYPT",
  "id": "req-009",
  "key": "user:john",
  "encryption_key": "secret-key-123"
}
```

---

### DECRYPT

Decrypts an encrypted object.

**Command Name:** `DECRYPT`

**What it does:**  
Decrypts an encrypted object's data using the provided encryption key.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `key` | string | Yes | Object key to decrypt |
| `encryption_key` | string | Yes | Encryption key (must match the one used for encryption) |

**Example Request:**
```json
{
  "command": "DECRYPT",
  "id": "req-010",
  "key": "user:john",
  "encryption_key": "secret-key-123"
}
```

---

## Graph Operations

### SET_VERTEX

Adds vertices/edges to an object for graph relationships.

**Command Name:** `SET_VERTEX`

**What it does:**  
Adds one or more vertices (connections) to an object. These define graph relationships between objects. Supports both simple string vertices and complex vertex objects with relations.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `key` | string | Yes | Object key to add vertices to |
| `vertex` | string\|array\|object | Yes | Vertex/vertices to add |
| `encryption_key` | string | No | Key for encrypted objects |

**Vertex Formats:**

Simple string:
```json
"vertex": "user:jane"
```

Array of strings:
```json
"vertex": ["user:jane", "user:alice"]
```

Object with relation:
```json
"vertex": {"vertex": "user:jane", "relation": "friend", "weight": 1.0}
```

**Example Request:**
```json
{
  "command": "SET_VERTEX",
  "id": "req-011",
  "key": "user:john",
  "vertex": {"vertex": "user:jane", "relation": "friend"}
}
```

---

### GET_VERTEX

Retrieves all vertices from an object.

**Command Name:** `GET_VERTEX`

**What it does:**  
Returns all vertices (connections) defined for an object.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": [
    {"vertex": "user:jane", "relation": "friend"},
    {"vertex": "post:123", "relation": "author"}
  ]
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `key` | string | Yes | Object key |
| `encryption_key` | string | No | Key for encrypted objects |

**Example Request:**
```json
{
  "command": "GET_VERTEX",
  "id": "req-012",
  "key": "user:john"
}
```

---

### DELETE_VERTEX

Removes a vertex from an object.

**Command Name:** `DELETE_VERTEX`

**What it does:**  
Removes a specific vertex/connection from an object.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `key` | string | Yes | Object key |
| `vertex` | string | Yes | Vertex key to remove |
| `encryption_key` | string | No | Key for encrypted objects |

**Example Request:**
```json
{
  "command": "DELETE_VERTEX",
  "id": "req-013",
  "key": "user:john",
  "vertex": "user:jane"
}
```

---

### DFS

Performs a distributed depth-first search traversal.

**Command Name:** `DFS`

**What it does:**  
Traverses the graph starting from a given node using depth-first search. Works across distributed nodes in the cluster.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": ["node1", "node2", "node3", ...]
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `node` | string | Yes | Starting node key |
| `relation` | string | No | Filter by relation type |

**Example Request:**
```json
{
  "command": "DFS",
  "id": "req-014",
  "node": "user:john",
  "relation": "friend"
}
```

---

### GRAPH_BFS

Performs breadth-first search on the graph.

**Command Name:** `GRAPH_BFS`

**What it does:**  
Returns all nodes reachable from a starting node using breadth-first search.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": ["node1", "node2", "node3", ...]
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `node` | string | No | Starting node (default: empty string returns all) |

**Example Request:**
```json
{
  "command": "GRAPH_BFS",
  "id": "req-015",
  "node": "user:john"
}
```

---

### GRAPH_DFS

Performs depth-first search on the graph.

**Command Name:** `GRAPH_DFS`

**What it does:**  
Returns all nodes reachable from a starting node using depth-first search.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": ["node1", "node2", "node3", ...]
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `node` | string | No | Starting node |

**Example Request:**
```json
{
  "command": "GRAPH_DFS",
  "id": "req-016",
  "node": "user:john"
}
```

---

### GRAPH_SHORTEST_PATH

Finds the shortest path between two nodes.

**Command Name:** `GRAPH_SHORTEST_PATH`

**What it does:**  
Finds the shortest path between a start node and end node using Dijkstra's algorithm.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": ["start", "node2", "node3", "end"]
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `node` | string | Yes | Start node |
| `target` | string | Yes | End node |

**Example Request:**
```json
{
  "command": "GRAPH_SHORTEST_PATH",
  "id": "req-017",
  "node": "user:john",
  "target": "post:123"
}
```

---

### GRAPH_CONNECTED_COMPONENTS

Finds all connected components in the graph.

**Command Name:** `GRAPH_CONNECTED_COMPONENTS`

**What it does:**  
Identifies all connected components in the graph (groups of nodes where each node is reachable from any other node in the group).

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": [
    ["node1", "node2", "node3"],
    ["node4", "node5"],
    ["node6"]
  ]
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |

**Example Request:**
```json
{
  "command": "GRAPH_CONNECTED_COMPONENTS",
  "id": "req-018"
}
```

---

### GRAPH_SCC

Finds strongly connected components.

**Command Name:** `GRAPH_SCC`

**What it does:**  
Identifies strongly connected components using Tarjan's algorithm. A strongly connected component is a maximal set of nodes where each node can reach every other node in the set.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": [
    ["node1", "node2", "node3"],
    ["node4", "node5"]
  ]
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |

**Example Request:**
```json
{
  "command": "GRAPH_SCC",
  "id": "req-019"
}
```

---

### GRAPH_DEGREE_CENTRALITY

Calculates degree centrality for all nodes.

**Command Name:** `GRAPH_DEGREE_CENTRALITY`

**What it does:**  
Calculates the degree centrality (number of connections) for each node in the graph.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": {
    "node1": 5,
    "node2": 3,
    "node3": 8
  }
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |

**Example Request:**
```json
{
  "command": "GRAPH_DEGREE_CENTRALITY",
  "id": "req-020"
}
```

---

### GRAPH_CLOSENESS_CENTRALITY

Calculates closeness centrality for all nodes.

**Command Name:** `GRAPH_CLOSENESS_CENTRALITY`

**What it does:**  
Calculates closeness centrality for each node, which measures how close a node is to all other nodes in the graph.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": {
    "node1": 0.45,
    "node2": 0.32,
    "node3": 0.58
  }
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |

**Example Request:**
```json
{
  "command": "GRAPH_CLOSENESS_CENTRALITY",
  "id": "req-021"
}
```

---

### GRAPH_CENTROID

Finds the centroid node of the graph.

**Command Name:** `GRAPH_CENTROID`

**What it does:**  
Finds the node with the highest closeness centrality (the most central node in the graph).

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": "node-with-highest-centrality"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |

**Example Request:**
```json
{
  "command": "GRAPH_CENTROID",
  "id": "req-022"
}
```

---

## AI Operations

> **Note:** Some AI operations require a valid license. Operations marked with `*` require license verification.

### ASK

Ask questions using AI-powered context gathering.

**Command Name:** `ASK`

**What it does:**  
Uses AI to answer complex questions about the database. The system automatically gathers relevant context using GET, DFS, GET_VERTEX, and ANN operations, then generates a response using an LLM.

**License Required:** Yes

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "SUCCESS",
  "id": "request-id",
  "data": {
    "response": "AI-generated answer...",
    "context": [...],
    "session": "session-id"
  }
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `question` | string | Yes | The question to ask |
| `session` | string | No | Mindspace session to use (default: `"global"`) |
| `backend` | string | No | LLM backend to use (`"ollama"` or `"openai"`) |

**Example Request:**
```json
{
  "command": "ASK",
  "id": "req-023",
  "question": "Which user has the most posts?",
  "session": "global"
}
```

---

### ANN / GET_SIMILAR

Performs approximate nearest neighbor search.

**Command Name:** `ANN` or `GET_SIMILAR`

**What it does:**  
Finds semantically similar objects using vector embeddings. Can search by providing a vector directly or by using an existing object's embedding.

**License Required:** Yes (for `ANN` only; `GET_SIMILAR` is always available)

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": "[{\"key\":\"object-key\",\"distance\":0.123},...]"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `vector` | array | No* | Query vector as array of floats |
| `key` | string | No* | Use embedding from existing object |
| `k` | integer | No | Number of neighbors to return (default: 5) |
| `ef` | integer | No | Search width parameter (default: 25) |
| `use` | string | No | For key-based search: `"data"` or `"embedding"` |

*Either `vector` or `key` must be provided.

**Example Request (by vector):**
```json
{
  "command": "GET_SIMILAR",
  "id": "req-024",
  "vector": [0.1, 0.2, 0.3, ...],
  "k": 10
}
```

**Example Request (by key):**
```json
{
  "command": "GET_SIMILAR",
  "id": "req-025",
  "key": "user:john",
  "k": 10
}
```

---

## Analytics Operations

### MEMORY_STATS

Returns current memory usage.

**Command Name:** `MEMORY_STATS`

**What it does:**  
Returns the percentage of system memory currently in use.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": 67.5
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |

**Example Request:**
```json
{
  "command": "MEMORY_STATS",
  "id": "req-026"
}
```

---

### CPU_STATS

Returns current CPU usage.

**Command Name:** `CPU_STATS`

**What it does:**  
Returns the current CPU usage percentage.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": 25.3
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |

**Example Request:**
```json
{
  "command": "CPU_STATS",
  "id": "req-027"
}
```

---

### GET_OPERATIONS

Returns history of recent operations.

**Command Name:** `GET_OPERATIONS`

**What it does:**  
Returns a log of recent database operations.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": "[{\"operation\":{...},\"response\":{...},\"timestamp\":1234567890},...]"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |

**Example Request:**
```json
{
  "command": "GET_OPERATIONS",
  "id": "req-028"
}
```

---

### GET_ACCESS_FREQUENCY

Returns the number of times an object has been queried.

**Command Name:** `GET_ACCESS_FREQUENCY`

**What it does:**  
Returns the query count (access frequency) for a specific object.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": 42
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `key` | string | Yes | Object key |

**Example Request:**
```json
{
  "command": "GET_ACCESS_FREQUENCY",
  "id": "req-029",
  "key": "user:john"
}
```

---

### INSIGHTS

Generates AI-powered database insights.

**Command Name:** `INSIGHTS`

**What it does:**  
Uses AI to analyze the database and generate actionable insights about patterns, hotspots, and optimization opportunities.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "status": "SUCCESS",
  "id": "request-id",
  "data": "AI-generated insights text..."
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `backend` | string | No | LLM backend to use (`"ollama"` or `"openai"`) |

**Example Request:**
```json
{
  "command": "INSIGHTS",
  "id": "req-030"
}
```

---

## Mindspace Operations

### SET_MINDSPACE / CREATE_MINDSPACE

Creates a new mindspace.

**Command Name:** `SET_MINDSPACE`

**What it does:**  
Creates a new mindspace (cognitive context) for AI-powered conversations and semantic operations.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "data": "mindspace-id"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `mindspace_id` | string | No | Custom mindspace ID (auto-generated if omitted) |

**Example Request:**
```json
{
  "command": "SET_MINDSPACE",
  "id": "req-031",
  "mindspace_id": "conversation-1"
}
```

---

### DELETE_MINDSPACE

Deletes a mindspace.

**Command Name:** `DELETE_MINDSPACE`

**What it does:**  
Removes a mindspace and all its associated context.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `mindspace_id` | string | Yes | Mindspace ID to delete |

**Example Request:**
```json
{
  "command": "DELETE_MINDSPACE",
  "id": "req-032",
  "mindspace_id": "conversation-1"
}
```

---

### CHAT_MINDSPACE

Chat with a mindspace using AI.

**Command Name:** `CHAT_MINDSPACE`

**What it does:**  
Sends a message to a mindspace and receives an AI-generated response. The mindspace maintains conversation context and can use semantic search to find relevant information.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "response": {
    "response": "AI response text...",
    "context": [...]
  }
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `mindspace_id` | string | Yes | Mindspace ID to chat with |
| `message` | string | Yes | User message |

**Example Request:**
```json
{
  "command": "CHAT_MINDSPACE",
  "id": "req-033",
  "mindspace_id": "conversation-1",
  "message": "What do you know about users?"
}
```

---

### LECTURE_MINDSPACE

Imports corpus data into a mindspace.

**Command Name:** `LECTURE_MINDSPACE`

**What it does:**  
Imports text corpus into a mindspace for semantic search and context retrieval. The text is processed and indexed for similarity search.

**Return Value:**  
```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique request identifier |
| `mindspace_id` | string | Yes | Mindspace ID to import into |
| `corpus` | string | Yes | Text content to import |

**Example Request:**
```json
{
  "command": "LECTURE_MINDSPACE",
  "id": "req-034",
  "mindspace_id": "conversation-1",
  "corpus": "User John Doe is a software engineer who specializes in Rust and distributed systems..."
}
```

---

## Common Data Types

### Object Structure

```json
{
  "key": "unique-key",
  "data": { ... },
  "type": "object-type",
  "class": "normal|vector",
  "vertices": [],
  "references": [],
  "timestamp": 1234567890,
  "last_accessed": 1234567890,
  "expires": false,
  "expiration_time": -1,
  "embedding": "[0.1, 0.2, ...]",
  "encrypted_data": "",
  "is_encrypted": false,
  "querys": 0
}
```

### Vertex Structure

Simple format:
```json
"user:jane"
```

Extended format:
```json
{
  "vertex": "user:jane",
  "relation": "friend",
  "weight": 1.0
}
```

### Error Response

All operations may return errors in the following format:

```json
{
  "type": "ERROR",
  "message": "Error description",
  "id": "request-id"
}
```

---

## Response Format

All successful responses follow this general structure:

```json
{
  "type": "SUCCESS",
  "message": "OK",
  "id": "request-id",
  "key": "optional-key",
  "data": { ... }
}
```

---

## Implementation Notes

### Language-Specific Considerations

1. **JSON Handling**: Ensure proper JSON serialization/deserialization, especially for nested objects and arrays
2. **Async Operations**: All operations are async; your SDK should expose async methods
3. **WebSocket**: Operations are sent over WebSocket; implement connection management
4. **Error Handling**: Always handle both connection errors and application-level errors
5. **Type Mapping**: Map JSON types to language-specific types appropriately

### SDK Implementation Patterns

```python
# Python example (pseudo-code)
class SatoriClient:
    def __init__(self, host, port):
        self.ws = connect(host, port)
    
    async def set(self, key, data, **kwargs):
        return await self.send("SET", {"key": key, "data": data, **kwargs})
    
    async def get(self, key):
        return await self.send("GET", {"key": key})
```

```typescript
// TypeScript example (pseudo-code)
class SatoriClient {
  constructor(private url: string) {}
  
  async set(key: string, data: any): Promise<any> {
    return this.send("SET", { key, data });
  }
  
  async get(key: string): Promise<any> {
    return this.send("GET", { key });
  }
}
```

---

*Document generated for SatoriDB SDK Implementation*
