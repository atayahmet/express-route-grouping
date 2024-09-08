import {
  NextFunction,
  IRouter as IExpressRouter,
  Request,
  RequestHandler,
  Response,
  Express
} from 'express';

import RouteGroup from './index';
import RESOURCES from './resources';

export type EndpointNames = keyof typeof RESOURCES;
export type RequestMethods = 'get' | 'post' | 'put' | 'patch' | 'delete';
export type RegisterCb = (g: IRouter) => void;

export type GroupArgs =
  | [path: string, RegisterCb]
  | [path: string, ...NextFunction[], RegisterCb]
  | [...NextFunction[], RegisterCb]

export interface IResource  {
  index(req: Request, res: Response, ): unknown;
}

export type ResourceType = {
  path?: string;
  handlers: IResource;
  middlewares?: {
    index?: NextFunction[];
    find?: NextFunction[];
    create?: NextFunction[];
    update?: NextFunction[];
    patch?: NextFunction[];
    delete?: NextFunction[];
  },
  parameters?: {
    [prop: string]: string;
  }
};

export type IRouter = IExpressRouter & {
  get path(): string;
  getRouter: () => IExpressRouter;
  listRoutes: () => ({ method: string; path: string; })[];
  group: (...args: GroupArgs) => IRouter;
  resource: (ins: IResource | ResourceType) => IRouter;
};
