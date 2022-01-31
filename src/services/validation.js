import { body } from "express-validator"

const fileValidationMiddlewares = [
  body("name")
    .exists()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be string")
    .isLength({ min: 2, max: 30 })
    .withMessage("Name has to be min 2 and max 30"),
]

export default fileValidationMiddlewares
