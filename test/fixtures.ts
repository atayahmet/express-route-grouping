import { Request, Response } from 'express';
import { IResource } from '../src/types';

export class BlogController implements IResource {
  public index(req: Request, res: Response) {
    console.log(req, res);
  }

  public show(req: Request, res: Response) {
    console.log(req, res);
  }

  public store(req: Request, res: Response) {
    console.log(req, res);
  }

  public update(req: Request, res: Response) {
    console.log(req, res);
  }

  public patch(req: Request, res: Response) {
    console.log(req, res);
  }

  public destroy(req: Request, res: Response) {
    console.log(req, res);
  }
}

export class CommentController implements IResource {
  public index(req: Request, res: Response) {
    console.log(req, res);
  }

  public show(req: Request, res: Response) {
    console.log(req, res);
  }

  public update(req: Request, res: Response) {
    console.log(req, res);
  }

  public patch(req: Request, res: Response) {
    console.log(req, res);
  }
}
