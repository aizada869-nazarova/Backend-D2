import express from "express" // <-- NEW IMPORT SYNTAX (Enabled with "type": "module" in the package.json)
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./authors/index.js"
import blogsRouter from "./blogs/index.js"


const server = express()

const port = 3001 
server.use(express.json()) 
// ******************** ENDPOINTS ***********************

server.use("/authors", authorsRouter)
server.use("/blogs", blogsRouter)

// console.log(liblogsstEndpoints(server))rs
console.table(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})