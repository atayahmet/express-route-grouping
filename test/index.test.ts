import sinon from 'sinon';
import { NextFunction, Router } from 'express';

import RouteGroup from '../src';
import { IRouter } from '../src/types';
import { BlogController, CommentController } from './fixtures';

const sandbox = sinon.createSandbox();

describe('express-route-grouping', () => {
  afterEach(() => {
    sandbox.restore();
  });

  describe('group', () => {
    it('should be register a group', () => {
      // Arrange
      const router = new RouteGroup('');
      const registerSpy = sandbox.spy();

      // Act
      const result = router.group('/b/', registerSpy);

      // Assert
      sandbox.assert.calledOnceWithExactly(
        registerSpy,
        sinon.match.instanceOf(RouteGroup)
      );

      expect(result).toBeInstanceOf(RouteGroup);

      const { firstArg: ins } = registerSpy.getCall(0);
      expect(ins.getPath()).toEqual('b');
    });

    it('should be register nested route groups', () => {
      // Arrange
      const router = new RouteGroup('a');
      const registerSpy = sandbox.spy();
      const m1: NextFunction = () => null;

      // Act
      const result = router.group('/b/', (sub1: IRouter) => {
        sub1.group(m1, (sub2: IRouter) => {
          sub2.group('c', registerSpy);
        });
      });

      // Assert
      sandbox.assert.calledOnceWithMatch(
        registerSpy,
        sinon.match.instanceOf(RouteGroup)
      );

      expect(result).toBeInstanceOf(RouteGroup);

      const { firstArg: ins } = registerSpy.getCall(0);
      expect(ins.getPath()).toEqual('a/b/c');
    });

    it('should be register the group without additional path', () => {
      // Arrange
      const router = new RouteGroup('');
      const registerSpy = sandbox.spy();

      // Act
      const result = router.group('', registerSpy);

      // Assert
      sandbox.assert.calledOnceWithExactly(
        registerSpy,
        sinon.match.instanceOf(RouteGroup)
      );

      expect(result).toBeInstanceOf(RouteGroup);

      const { firstArg: ins } = registerSpy.getCall(0);
      expect(ins.getPath()).toEqual('');
    });

    it('should be register the nested groups without additional path', () => {
      // Arrange
      const _router = Router();
      const router = new RouteGroup('', _router);
      const registerSpy = sandbox.spy();
      const m1: NextFunction = () => null;
      const m2: NextFunction = () => null;
      const m3: NextFunction = () => null;

      // Act
      const result = router.group(m1, m1, (sub1: IRouter) => {
        sub1.post('a', () => {});
        sub1.group(m2, (sub2: IRouter) => {
          sub2.post('b', () => {});
          sub2.group('c/d', m3, m3, m3, (sub3: IRouter) => {
            sub3.post('e', () => {});
            sub3.group('', registerSpy);
          });
        });
      });

      router.group('a1', m1, (a1: IRouter) => {
        a1.post('b1', () => {});
      });

      // Assert
      sandbox.assert.calledOnceWithExactly(
        registerSpy,
        sinon.match.instanceOf(RouteGroup)
      );

      expect(result).toBeInstanceOf(RouteGroup);

      const { firstArg: ins } = registerSpy.getCall(0);
      expect(ins.getPath()).toEqual('c/d');
    });
  });

  describe('resource', () => {
    it('should generate routes from current position', () => {
      // Arrange
      const router = new RouteGroup();

      // Act
      router.group('v1/blogs/comments', (v1: IRouter) => {
        v1.get('all', () => {});
        v1.resource(new BlogController());
      });

      // Assert
      expect(router.listRoutes()).toStrictEqual([
        { method: 'GET', path: 'v1/blogs/comments/all' },
        { method: 'GET', path: 'v1/blogs/comments' },
        { method: 'GET', path: 'v1/blogs/comments/:commentId' },
        { method: 'POST', path: 'v1/blogs/comments' },
        { method: 'PUT', path: 'v1/blogs/comments/:commentId' },
        { method: 'PATCH', path: 'v1/blogs/comments/:commentId' },
        { method: 'DELETE', path: 'v1/blogs/comments/:commentId' },
      ]);
    });

    it('shoulod generate nested resource routes with the path', () => {
      // Arrange
      const router = new RouteGroup();

      // Act
      router.resource({
        path: 'blogs.comments.likes',
        handlers: new BlogController(),
      });

      expect(router.listRoutes()).toStrictEqual([
        { method: 'GET', path: 'blogs/:blogId/comments/:commentId/likes' },
        {
          method: 'GET',
          path: 'blogs/:blogId/comments/:commentId/likes/:likeId',
        },
        { method: 'POST', path: 'blogs/:blogId/comments/:commentId/likes' },
        {
          method: 'PUT',
          path: 'blogs/:blogId/comments/:commentId/likes/:likeId',
        },
        {
          method: 'PATCH',
          path: 'blogs/:blogId/comments/:commentId/likes/:likeId',
        },
        {
          method: 'DELETE',
          path: 'blogs/:blogId/comments/:commentId/likes/:likeId',
        },
      ]);
    });

    it('should generate nested resource routes with manipulated parameters', () => {
      // Arrange
      const router = new RouteGroup();

      // Act
      router.resource({
        path: 'blogs.comments.likes',
        handlers: new BlogController(),
        parameters: {
          blogs: 'slug',
        },
      });

      // Assert
      expect(router.listRoutes()).toStrictEqual([
        { method: 'GET', path: 'blogs/:slug/comments/:commentId/likes' },
        {
          method: 'GET',
          path: 'blogs/:slug/comments/:commentId/likes/:likeId',
        },
        { method: 'POST', path: 'blogs/:slug/comments/:commentId/likes' },
        {
          method: 'PUT',
          path: 'blogs/:slug/comments/:commentId/likes/:likeId',
        },
        {
          method: 'PATCH',
          path: 'blogs/:slug/comments/:commentId/likes/:likeId',
        },
        {
          method: 'DELETE',
          path: 'blogs/:slug/comments/:commentId/likes/:likeId',
        },
      ]);
    });

    it('should generate resource routes with only specific handlers', () => {
      // Arrange
      const router = new RouteGroup();
      const handlers = new CommentController();

      // Act
      router.resource({
        path: 'blogs.comments',
        handlers,
      });

      // Assert
      expect(router.listRoutes()).toStrictEqual([
        { method: 'GET', path: 'blogs/:blogId/comments' },
        { method: 'GET', path: 'blogs/:blogId/comments/:commentId' },
        { method: 'PUT', path: 'blogs/:blogId/comments/:commentId' },
        { method: 'PATCH', path: 'blogs/:blogId/comments/:commentId' },
      ]);
    });

    it('should generate resource routes with specific middlewares', () => {
      // Arrange
      const router = new RouteGroup();
      const handlers = new BlogController();
      const m1: NextFunction = () => null;
      const m2: NextFunction = () => null;

      // Act
      router.resource({
        path: 'blogs',
        handlers,
        middlewares: {
          index: [m1],
          show: [m2],
        },
      });

      const { stack } = router.getRouter();

      // Assert
      const index = stack.find(
        s => s?.route?.path === 'blogs' && s?.route?.stack[0].name === 'm1'
      );
      expect(index?.route?.stack[0].name).toEqual('m1');
      expect(index?.route?.stack.length).toEqual(2);

      const show = stack.find(
        s =>
          s?.route?.path === 'blogs/:blogId' && s?.route?.stack[0].name === 'm2'
      );
      expect(show?.route?.stack[0].name).toEqual('m2');
      expect(show?.route?.stack.length).toEqual(2);

      const store = stack.find(
        s => s?.route?.path === 'blogs' && s?.route?.stack.length === 1
      );
      expect(store?.route?.stack.length).toEqual(1);

      const update = stack.find(
        s => s?.route?.path === 'blogs/:blogId' && s?.route?.stack.length === 1
      );
      expect(update?.route?.stack.length).toEqual(1);

      const patch = stack.find(
        s => s?.route?.path === 'blogs/:blogId' && s?.route?.stack.length === 1
      );
      expect(patch?.route?.stack.length).toEqual(1);

      const destroy = stack.find(
        s => s?.route?.path === 'blogs/:blogId' && s?.route?.stack.length === 1
      );
      expect(destroy?.route?.stack.length).toEqual(1);
    });

    it('should generate resource routes at the current position with specific middleware and inherited middlewares', () => {
      // Arrange
      const router = new RouteGroup();
      const handlers = new BlogController();
      const m1: NextFunction = () => null;
      const m2: NextFunction = () => null;

      // Act
      router.group(m1, (sub: IRouter) => {
        sub.resource({
          path: 'blogs',
          handlers,
          middlewares: {
            index: [m2],
          },
        });
      });

      // Assert
      const { stack } = router.getRouter();
      expect(stack[0].route?.stack.length).toEqual(3);
      expect(stack[0].route?.stack[0].name).toEqual('m1');
      expect(stack[0].route?.stack[1].name).toEqual('m2');

      expect(stack[1].route?.stack.length).toEqual(2);
      expect(stack[1].route?.stack[0].name).toEqual('m1');

      expect(stack[2].route?.stack.length).toEqual(2);
      expect(stack[2].route?.stack[0].name).toEqual('m1');

      expect(stack[3].route?.stack.length).toEqual(2);
      expect(stack[3].route?.stack[0].name).toEqual('m1');

      expect(stack[4].route?.stack.length).toEqual(2);
      expect(stack[4].route?.stack[0].name).toEqual('m1');

      expect(stack[5].route?.stack.length).toEqual(2);
      expect(stack[5].route?.stack[0].name).toEqual('m1');
    });
  });
});
