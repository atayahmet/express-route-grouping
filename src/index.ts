import { IRouter } from 'express';
import { RequestMethods, ResourceOptions, Resources } from './types';
import RESOURCES from './resources';

type GroupCallback = (router: RouteGroup) => void;

class RouteGroup {
  private head: string | undefined;

  constructor(path: string = '/') {
    this.head = path;
  }

  public group = (path: string = '', fn: GroupCallback): RouteGroup => {
    const fullPath = this.head + this.sanitize(path);
    const newGroup = new RouteGroup(fullPath);
    fn(newGroup);
    return newGroup;
  };

  public to = (suffix: string = '/'): string => {
    return this.head + this.sanitize(suffix);
  };

  public resource = (router: IRouter, options: ResourceOptions) => {
    if (!options) {
      throw new Error('Resource handlers are required!');
    }

    const {
      excludes = [],
      handlers = {},
      beforeHandlers = [],
      afterHandlers = [],
    } = options;
    Object.keys(RESOURCES).forEach((name: string) => {
      if (excludes.includes(name as Resources)) return;

      const { method, suffix } = RESOURCES[name];
      const requestRouter = router[method as RequestMethods];
      const fullPath = this.to(suffix);
      const handler = handlers[name as Resources] as any;

      if (handler) {
        requestRouter.bind(router)(
          fullPath,
          ...beforeHandlers,
          ...(Array.isArray(handler) ? handler : [handler]),
          ...afterHandlers
        );
      }
    });
  };

  private sanitize(path: string): string {
    if (path === '/') return '';

    // remove slashes at start and end positions, if exists
    // to sure there is no any slashes.
    let newPath = path.replace(/^(\/+)(.)/, '$2').replace(/(.)(\/+)$/, '$1');

    // add delimiter on the end
    if (this.head !== '/') newPath = newPath.padStart(newPath.length + 1, '/');

    return newPath;
  }
}

export default RouteGroup;
