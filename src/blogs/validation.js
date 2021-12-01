import { body } from "express-validator"

export const blogsValidation = [
  body("title").exists().withMessage("Title is a mandatory field!"),
  body("category").exists().withMessage("Category is a mandatory field!"),
  body("cover").exists().withMessage("Category is a mandatory field!")
]
