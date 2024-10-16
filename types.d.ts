import {
  NextFunction,
  IRouter as IExpressRouter,
  RequestHandler,
} from 'express';

import RESOURCES from './src/resources';

export type EndpointNames = keyof typeof RESOURCES;
export type RequestMethods = 'get' | 'post' | 'put' | 'patch' | 'delete';
export type RegisterCb = (g: IRouter) => void;

export type GroupArgs = [...unknown[], RegisterCb];

export interface IResource {
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
  };
  parameters?: {
    [prop: string]: string;
  };
};

export type IRouter = IExpressRouter & {
  getPath(): string;
  getRouter: () => IExpressRouter;
  listRoutes: () => { method: string; path: string }[];
  group: (...args: GroupArgs) => IRouter;
  resource: (ins: IResource | ResourceType) => IRouter;
};
