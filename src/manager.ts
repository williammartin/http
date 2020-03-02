import { Request, Response } from "express";

import { find, remove } from "lodash";
import eventManager from "./events";

interface HTTPRoute {
  eventID: string;
  appID: string;
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

/**
 * Naive URL path normalization.
 * It removes trailing slashes.
 */
export function normalizeURLPath(path: string): string {
  while (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
}

class HTTPServiceManager {
  routes: HTTPRoute[];

  constructor() {
    this.routes = [];
  }

  async listen(req: ListenRequest): Promise<void> {
    let path = req.path;
    if (path.length === 0) {
      path = "/";
    } else if (!path.startsWith("/")) {
      path = "/" + path;
    }
    path = normalizeURLPath(`/${req.appID}${path}`);
    const route: HTTPRoute = {
      appID: req.appID,
      eventID: req.eventID,
      path,
    };
    this.routes.push(route);
    console.log("http.listen: ", { route });
  }

  async unlisten(req: UnlistenRequest): Promise<void> {
    remove(this.routes, {
      eventID: req.eventID,
    });
  }

  // TODO: use more advanced route matching
  matchRoute(path: string): HTTPRoute | undefined {
    // compare as normalized
    path = normalizeURLPath(path);
    return find(this.routes, {
      path,
    });
  }


  async handle(req: Request, res: Response): Promise<void> {
    console.log("HttpManager has the following routes registered: ", this.routes);
   
    const payload = { queryParams: req.query };
    const route = this.matchRoute('/' + req.params['path'])!;
    console.log("http.handleHTTP: ", { route });
    if (route === undefined) {
      res.sendStatus(404)
      console.log(this.routes, route);
      return;
    }
    const eventResponse = await eventManager.submitEvent(route.eventID, payload);
    console.log("http.handleHTTPResponse: ", { eventResponse });
    res.send("Handled");
  }
}

export default HTTPServiceManager;
