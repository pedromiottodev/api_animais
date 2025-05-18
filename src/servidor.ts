import express from "express"
import router from "./routes"

const server = express()

server.use(express.json())
/*
1. server.use(router) no servidor.ts
Isso diz pro Express:

"Quando chegar qualquer requisição, repasse ela pro router (que veio do index.ts) analisar e decidir o que fazer".
*/
server.use(router)

server.listen(3333, () => {
  console.log("SERVIDOR ONLINE")
})