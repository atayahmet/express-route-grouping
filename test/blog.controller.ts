import { Request, Response } from 'express';
import { IResource } from '../src/types';

export default class BlogController implements IResource {
  public index(req: Request, res: Response) {
    console.log(req, res);
  }
  public find() {}
  public create() {}
  public update() {}
  public patch() {}
  public delete() {}
}
