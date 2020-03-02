import HTTPServiceManager, { ListenRequest } from "../manager";

import { RootController } from "./controllers/root";
const express = require('express');
import { Application, Request, Response } from 'express'
const bodyParser = require('body-parser')


class HTTPServer {

  private app: Application;
  private serviceManager: HTTPServiceManager;

  constructor(serviceManager: HTTPServiceManager) {
    this.app = express();
    this.serviceManager = serviceManager;
  }

  public async start(port: string): Promise<any> {
    this.app.use(bodyParser.json())
    
    const ctr = new RootController(this.serviceManager);

    this.app.post('/listen', async (req: Request, res: Response) => ctr.listen(req, res))
    this.app.get('/in/:path', async (req: Request, res: Response) => ctr.in(req, res))

    return this.app.listen(port);
  }
}

export {
  HTTPServer,
}