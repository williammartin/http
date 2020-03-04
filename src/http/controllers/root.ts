import { Request, Response } from 'express';

import { Router, ListenRequest, UnlistenRequest, HandleResponse } from '@/router';


interface Events {
    submit(eventID: string, payload: any): Promise<void>
}

export class RootController {

    private readonly router: Router;
    private readonly eventBus: Events;

    constructor(router: Router, eventBus: Events) {
        this.router = router;
        this.eventBus = eventBus;
    }

    listen(req: Request, res: Response): void {
        this.router.listen(req.body as ListenRequest);
        res.sendStatus(200)
    }

    unlisten(req: Request, res: Response): void {
        this.router.unlisten(req.body as UnlistenRequest);
        res.sendStatus(200)
    }

    async in(req: Request, res: Response): Promise<Response> {
        let handleResponse: HandleResponse;
        try {
            handleResponse = this.router.handle(req);
        }
        catch (e) {
            return res.sendStatus(404);
        }
        await this.eventBus.submit(handleResponse.eventID, handleResponse.eventPayload);
        return res.send("Handled");
    }
}
