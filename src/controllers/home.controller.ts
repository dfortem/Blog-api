import * as express from 'express'
import { Request, Response } from 'express'
import path from 'path'
import IController from '../interfaces/IController.interface'

class HomeController implements IController {
  public path = '/api'
  public router = express.Router()

  constructor() {
    this.initRoutes()
  }

  public initRoutes() {
    this.router.get(/\/(?!api)/, this.index)
    this.router.get(this.path, this.apiCall)
  }

  index = (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../app', 'index.html'));
  }

  apiCall = (req: Request, res: Response) => {
    res.send("HelloBonjour!")
  }
}

export default HomeController