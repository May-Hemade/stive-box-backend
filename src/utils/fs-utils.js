import fs from "fs-extra"
import createError from "http-errors"
import path from "path"
import { fileURLToPath } from "url"
import { v4 as uuid } from "uuid"

const currentWorkingFile = fileURLToPath(import.meta.url)

const currentWorkingDirectory = path.dirname(currentWorkingFile)
const dataFolderPath = path.join(currentWorkingDirectory, "../data")
const publicFolderPath = path.join(currentWorkingDirectory, "../../public")

class Database {
  constructor(fileName) {
    this.path = path.join(dataFolderPath, fileName)
  }
  async all() {
    try {
      const content = await fs.readJSON(this.path)
      return content
    } catch (error) {
      throw createError(500, `Error while reading ${this.path}`)
    }
  }
  async findObjectByID(id) {
    try {
      const array = await this.all()
      const objectFound = array.find((object) => object.id === id)
      if (objectFound) {
        return objectFound
      } else {
        throw createError(404, `Object with ${id} is not found`)
      }
    } catch (error) {
      console.log("Error: " + error)
      throw createError(404, "Error while finding the object:" + id)
    }
  }

  async addObject(json) {
    try {
      const array = await this.all()
      const newObject = { id: uuid(), ...json, createdAt: new Date() }
      array.push(newObject)

      await fs.writeJSON(this.path, array)
      return newObject
    } catch (error) {
      console.log("Error while adding object " + error)
      throw createError(500, "Error while adding object")
    }
  }

  async deleteObject(id) {
    try {
      const array = await this.all()
      const filteredArray = array.filter((object) => object.id !== id)
      await fs.writeJSON(this.path, filteredArray)
      return filteredArray
    } catch (error) {
      console.log("Error while deleting object " + error)
      throw createError(500, `Error while deleting object`)
    }
  }

  async updatedObject(id, updates) {
    try {
      const array = this.all()
      const indexOFObject = array.findIndex((object) => object.id === id)
      if (indexOFObject === -1) {
        throw createError(404, `Object with ${id}  is not found!`)
      } else {
        const oldObject = array[indexOFObject]
        array[indexOFObject] = { ...oldObject, ...updates }
        fs.writeJSON(this.path, array)
        return array[indexOFObject]
      }
    } catch (error) {
      console.log("Error while updating object " + error)
      throw createError(500, `Error while updating object`)
    }
  }
  async uploadImage(id, file) {
    try {
      const extName = path.extname(file.originalname)
      const fileName = `${id}${extName}`
      const filePath = path.join(publicFolderPath, fileName)
      const url = `http://localhost5001/${fileName}`
      await fs.writeJSON(filePath, file.buffer)
      const updatedObject = await this.updateObject(id, { image: url })
      return updatedObject
    } catch (error) {
      console.log(`Error while uploading image : `, error)
      throw error
    }
  }
  async uploadFile(file) {
    try {
      const fileName = file.originalname
      const filePath = path.join(publicFolderPath, fileName)
      const url = `http://localhost:5001/${fileName}`
      console.log(filePath)
      await fs.writeFile(filePath, file.buffer)
      const stats = await fs.stat(filePath)
      const fileSizeInBytes = stats.size
      const newFile = {
        name: fileName,
        size: fileSizeInBytes,
        unit: "Byte",
        downloadLink: url,
      }
      this.addObject(newFile)
    } catch (error) {
      console.log(`Error while uploading file : `, error)
      throw error
    }
  }
}
export default Database
