import { Request, Response } from 'express';
import { find, remove } from 'lodash';


type HTTPRoute = {
    eventID: string;
    host: string;
    path: string;
}

export interface ListenRequest {
    eventID: string;
    appID: string;
    path: string;
}

export interface UnlistenRequest {
    eventID: string;
}

export interface HandleResponse {
    eventID: string,
    eventPayload: any
}

export class Router {

    private readonly domain: string;
    private readonly routes: HTTPRoute[];

    constructor(domain: string) {
        this.domain = domain;
        this.routes = [];
    }

    private registerRoute(eventID: string, appID: string, path: string): void {
        if (path.length === 0) {
            path = "/";
        } else if (!path.startsWith("/")) {
            path = `/${path}`;
        }
        const host = `${appID}.${this.domain}`;
        const route = { eventID, host, path };
        this.routes.push(route);
    }

    private unregisterRoute(eventID: string): void {
        remove(this.routes, { eventID })
    }

    private matchRoute(req: Request): HTTPRoute | undefined {
        return find(this.routes, { path: req.path, host: req.hostname });
    }

    listen(req: ListenRequest): void {
        this.registerRoute(req.eventID, req.appID, req.path);
    }

    unlisten(req: UnlistenRequest): void {
        this.unregisterRoute(req.eventID);
    }

    handle(req: Request): HandleResponse {
        const route = this.matchRoute(req);
        if (route === undefined) {
            throw new Error("NOT_FOUND");
        }
        const eventID = route.eventID;
        const eventPayload = { queryParams: req.query };
        return { eventID, eventPayload };
    }
}
