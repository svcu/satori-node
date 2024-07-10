# Satori-Node

This is the Satori Driver for NodeJS, all operations are implemented.

# Example

```ts
const { Satori } = require("satori-node")
const satori = new Satori(host: string, port: number, username: string?, token: string?)


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