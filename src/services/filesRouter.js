import { Router } from "express"

import Database from "../utils/fs-utils.js"

import fileValidationMiddlewares from "./validation.js"
import { validationResult } from "express-validator"
import createError from "http-errors"
import multer from "multer"

const upload = multer()
const filesRouter = Router()

const filesDatabase = new Database("files.json")

filesRouter.get("/", async (req, res, next) => {
  try {
    const files = await filesDatabase.all()
    res.send(files)
  } catch (error) {
    next(error)
  }
})
filesRouter.put("/:id", async (req, res, next) => {
  try {
    const file = await filesDatabase.uploadObject(req.params.id, req.body)
    res.send(file)
  } catch (error) {
    next(error)
  }
})

filesRouter.delete("/:id", async (req, res, next) => {
  try {
    await filesDatabase.deleteObject(req.params.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

// filesRouter.post("/", fileValidationMiddlewares, async (req, res, next) => {
//   try {
//     const errors = validationResult(req)
//     if (errors.isEmpty()) {
//       const file = await filesDatabase.addObject(req.body)
//       res.send(file)
//     } else {
//       next(
//         createError(400, {
//           message: "files validation is failed",
//           errors: errors.array(),
//         })
//       )
//     }
//   } catch (error) {
//     next(error)
//   }
// })

filesRouter.post("/", upload.single("file"), async (req, res, next) => {
  try {
    const file = await filesDatabase.uploadFile(req.file)
    res.send(file)
  } catch (error) {
    next(error)
  }
})

export default filesRouter
