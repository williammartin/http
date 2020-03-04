import { Request, Response } from 'express';

import { ListenRequest, Router, UnlistenRequest } from '../../router';

class RootController {

    private router: Router;

    // Injected by routing-controller
    constructor(serviceManager: Router) {
        this.router = serviceManager;
    }

    public async listen(req: Request, res: Response): Promise<void> {
        await this.router.listen(req.body as ListenRequest);
        res.sendStatus(200)
    }

    public async unlisten(req: Request, res: Response): Promise<void> {
        await this.router.unlisten(req.body as UnlistenRequest);
        res.sendStatus(200)
    }

    public async in(req: Request, res: Response): Promise<any> {
        await this.router.handle(req, res)
    }
}

export {
    RootController,
};
