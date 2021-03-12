import { NextFunction, Request, Response } from 'express';

export type Resources =
  | 'index'
  | 'find'
  | 'create'
  | 'update'
  | 'patch'
  | 'delete';
export type RequestMethods = 'get' | 'post' | 'put' | 'patch' | 'delete';
export type ResourceOptions = {
  excludes?: Array<Resources>;
  handlers: ResourceHandlers;
  beforeHandlers?: ResourceHandler[];
  afterHandlers?: ResourceHandler[];
};

export type ResourceHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;
export type ResourceHandlers = {
  index?: ResourceHandler | ResourceHandler[];
  find?: ResourceHandler | ResourceHandler[];
  create?: ResourceHandler | ResourceHandler[];
  update?: ResourceHandler | ResourceHandler[];
  delete?: ResourceHandler | ResourceHandler[];
  patch?: ResourceHandler | ResourceHandler[];
};
