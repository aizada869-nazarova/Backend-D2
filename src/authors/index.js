import express from 'express'
import fs from "fs"
import path, { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import uniqid from "uniqid"

const authorsRouter = express.Router()
const currentFilePath = fileURLToPath(
    import.meta.url)
const currentDirPath = dirname(currentFilePath)
const authorsJSONFilePath = join(currentDirPath, "authors.json")
console.log("authors.json path:", authorsJSONFilePath)


authorsRouter.post("/", (req, res) => {
    
  
    console.log("BODY: ", req.body)
  
    // 2. Add some server generated information (id, creationDate, ....)
  
    const newAuthor = { ...req.body, createdAt: new Date(), id:uniqid() }
  
    console.log(newAuthor)
  
    // 3. Read users.json obtaining an array
  
    const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath))
  
    // 4. Add new user to the array (push)
    authors.push(newAuthor)
  
    // 5. Write the array back to the file
    fs.writeFileSync(authorsJSONFilePath, JSON.stringify(authors))
  
    // 6. Send back a proper response
  
    res.status(201).send({ id: newAuthor.id })
  })
  
  // 2.
  
  authorsRouter.get("/", (req, res) => {
    
    console.log("IMPORT META URL: ", import.meta.url)
    console.log("CURRENT FILE PATH: ", currentFilePath)
  
    const fileContent = fs.readFileSync(authorsJSONFilePath) 
  
    console.log("FILE CONTENT: ", JSON.parse(fileContent))
  
    const authorsArray = JSON.parse(fileContent)
  
    res.send(authorsArray)
  })
  
  // 3.
  
  authorsRouter.get("/:authorId", (req, res) => {
    
    const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath))
  
   
    const author = authors.find(s => s.id === req.params.authorId)
  
    
    res.send(author)
  })
  
  // 4.
  
  authorsRouter.put("/:authorId", (req, res) => {
    
    const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath))
  
    
    const index = authors.findIndex(author => author.id === req.params.authorId)
    const updatedAuthor = {...authors[index], ...req.body }
  
    authors[index] = updatedAuthor
  
    
    fs.writeFileSync(authorsJSONFilePath, JSON.stringify(authors))
  
    
  
    res.send(updatedAuthor)
  })
  
  
  
  // 5.
  
  authorsRouter.delete("/:authorId", (req, res) => {
  
    const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath))
  
    const remainingAuthors = authors.filter(a => a.id !== req.params.authorId)
  
    
    fs.writeFileSync(authorsJSONFilePath, JSON.stringify(remainingAuthors))
  
   
    res.status(204).send() 
  })
  
  
export default authorsRouter