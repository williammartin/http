import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Server } from 'http';

import { RootController } from '@/http/controllers/root';


export class HTTPServer {

    private readonly app: Application;
    private readonly controller: RootController;

    constructor(controller: RootController) {
        this.app = express();
        this.controller = controller;
        this.setupMiddleware();
        this.setupRoutes();
    }

    private setupMiddleware() {
        this.app.use(bodyParser.json());
    }

    private setupRoutes(): void {
        this.app.post('/listen', async (req: Request, res: Response) => this.controller.listen(req, res));
        this.app.post('/unlisten', async (req: Request, res: Response) => this.controller.unlisten(req, res));
        this.app.use('/*', async (req: Request, res: Response) => this.controller.in(req, res));
    }

    async start(port: string): Promise<Server> {
        return this.app.listen(port);
    }
}
