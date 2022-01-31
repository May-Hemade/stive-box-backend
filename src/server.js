import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import filesRouter from "./services/filesRouter.js"
import path from "path"
import errorHandlers from "./errorHandlers.js"

const publicPath = path.join(process.cwd(), "public")

const server = express()

server.use(express.static(publicPath))
server.use(express.json())
server.use(helmet())
server.use(morgan("tiny"))
server.use(cors())

server.use("/files", filesRouter)

server.use(errorHandlers)

const PORT = 5001

server.listen(PORT, () => {
  console.log("Server is running on port", PORT)
})

server.on("error", (error) => {
  console.log("Server is stopped due to an error :" + error)
})
