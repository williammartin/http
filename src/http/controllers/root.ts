
import { Request, Response } from "express";

import HTTPServiceManager, { ListenRequest } from "../../manager";

class RootController {

  private serviceManager: HTTPServiceManager;

  // Injected by routing-controller
  constructor(serviceManager: HTTPServiceManager) {
    this.serviceManager = serviceManager;
  }

  public async listen(req: Request, res: Response): Promise<void> {
    await this.serviceManager.listen(req.body as ListenRequest);
    res.sendStatus(200)
  }

  public async in(req: Request, res: Response): Promise<any> {
    await this.serviceManager.handle(req, res)
  }

  // GET is not correct
  // @Get("/in/:appID")
  // public async in(@Req() request: Request, @Res() response: Response): Promise<any> {
  //   await this.serviceManager.handle(request, response)
  // }


}

export {
  RootController,
};
