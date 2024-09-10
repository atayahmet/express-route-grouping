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
  index?: RequestHandler;
  show?: RequestHandler;
  store?: RequestHandler;
  update?: RequestHandler;
  patch?: RequestHandler;
  destroy?: RequestHandler;
}

export type ResourceType = {
  path?: string;
  handlers: IResource;
  middlewares?: {
    index?: NextFunction[];
    show?: NextFunction[];
    store?: NextFunction[];
    update?: NextFunction[];
    patch?: NextFunction[];
    destroy?: NextFunction[];
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
