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

interface Events {
  submit(eventID: string, payload: any): Promise<void>
}

class Router {

  private domain: string;
  private events: Events;
  private routes: HTTPRoute[];

  // TODO: split events from the Router (router shouldn't submit, only determine where to send requests)
  constructor(domain: string, events: Events) {
    this.domain = domain;
    this.events = events;
    this.routes = [];
  }

  async listen(req: ListenRequest): Promise<void> {
    let path = req.path;
    if (path.length === 0) {
      path = "/";
    } else if (!path.startsWith("/")) {
      path = "/" + path;
    }

    const host = req.appID + "." + this.domain

    const route = {
      eventID: req.eventID,
      host,
      path,
    }

    this.routes.push(route);
  }

  async unlisten(req: UnlistenRequest): Promise<void> {
    remove(this.routes, { eventID: req.eventID })
  }

  async handle(req: Request, res: Response): Promise<void> {
    const route = find(this.routes, { path: req.path, host: req.hostname });
    const payload = { queryParams: req.query };

    if (route === undefined) {
      res.sendStatus(404)
      console.log(this.routes, route);
      return;
    }

    await this.events.submit(route.eventID, payload);
    res.send("Handled");
  }
}

export {
  Router
}
