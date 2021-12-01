import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import {blogsValidation  } from "./validation.js"

const blogsRouter = express.Router()

const blogsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogs.json") 
const getblogs = () => JSON.parse(fs.readFileSync(blogsJSONPath))
const writeblogs = content => fs.writeFileSync(blogsJSONPath, JSON.stringify(content))

// 1.

blogsRouter.post("/", blogsValidation , (req, res, next) => {
  try {
    
   const errorsList = validationResult(req)
    if (!errorsList.isEmpty()) {
      // If we had validation errors --> trigger bad request error handler
      next(createHttpError(400, "Some Errors occured in the request body", { errorsList }))
    } else {
      // errors list is empty
      const newBook = { ...req.body, createdAt: new Date(), id: uniqid() }
      const blogs = getblogs()

      blogs.push(newBook)
      writeblogs(blogs)
      res.status(201).send({ id: newBook.id })
    }
  } catch (error) {
    next(error)
  }
})

// 2.



blogsRouter.get("/",  (req, res, next) => {
  try {
    
    const blogs = getblogs()
    if (req.query && req.query.category) {
      const filteredblogs = blogs.filter(blog => blog.category === req.query.category)
      res.send(filteredblogs)
    } else {
      res.send(blogs)
    }
  } catch (error) {
    next(error)
  }
})

// 3.

blogsRouter.get("/:blogId", (req, res, next) => {
  try {
    const blogs = getblogs()

    const blog = blogs.find(b => b.id === req.params.blogId)
    if (blog) {
      res.send(blog)
    } else {
      next(createHttpError(404, `Book with ID ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

// 4.

blogsRouter.put("/:blogId", (req, res, next) => {
  try {
    const blogs = getblogs()

    const index = blogs.findIndex(b => b.id === req.params.blogId)

    const blogToModify = blogs[index]
    const updatedFields = req.body

    const updatedBook = { ...blogToModify, ...updatedFields, updatedAt: new Date() }

    blogs[index] = updatedBook

    writeblogs(blogs)

    res.send(updatedBook)
  } catch (error) {
    next(error)
  }
})

// 5.

blogsRouter.delete("/:blogId", (req, res, next) => {
  try {
    const blogs = getblogs()
    const remainingblogs = blogs.filter(blog => blog.id !== req.params.blogId)
    writeblogs(remainingblogs)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default blogsRouter