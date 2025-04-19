# Satori-Node

This is the Satori Driver for NodeJS, all operations are implemented.

# Example

```ts
const { Satori } = require("satori-node")
const satori = new Satori(host: string, port: number, username: string?, password: string?)


const user_1 = {
    "name" : "John Wick",
    "status" : "depends on who you ask"
}

satori.set({
    data: user_1
}).then(res => {
    console.log(res) //if not key provided res will be the object key
}).catch(e => {
    console.log(e); //normally a false value
})

```

# Vertex && FieldArrays
Setting a vertex requires to pass a Vertex[] param to the SetVertex payload. This Vertex type is an object with an optional field called relation, this must be set if you want to set the vertex with an specific relationship type. The other field is mandatory and is called neighbor, this is the vertex you want to add.

```ts
export interface Vertex{
    relation?: string,
    neighbor: string
}
```

FieldArrays are required in all WITH operations, this FieldArrays are lists of FieldEntry objects. This FieldEntry objects have two properties called field and value. The field property refers to the field you want to query and value refers to the expected value of that field

```ts
export interface FieldEntry{
    field: string,
    value: string
}
```

