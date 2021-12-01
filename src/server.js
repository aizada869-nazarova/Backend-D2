import express from "express" // <-- NEW IMPORT SYNTAX (Enabled with "type": "module" in the package.json)
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./authors/index.js"
import blogsRouter from "./blogs/index.js"
import cors from "cors"
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notFoundHandler } from "./errorHandlers.js"



const server = express()

const port = 3001 

server.use(cors())
server.use(express.json()) 
// ******************** ENDPOINTS ***********************

server.use("/authors", authorsRouter)
server.use("/blogs", blogsRouter)


// ******************** ERROR HANDLERS **********************
server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)
console.table(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})