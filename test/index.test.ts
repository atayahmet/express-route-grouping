import sinon from 'sinon';
import { NextFunction, Router } from 'express';

import RouteGroup from '../src';
import { IRouter } from '../src/types';
import BlogController from './blog.controller';

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
        sinon.match.instanceOf(RouteGroup).and(sinon.match.has('path', 'b'))
      );

      expect(result).toBeInstanceOf(RouteGroup);
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
        sinon.match.instanceOf(RouteGroup).and(sinon.match.has('path', 'a/b/c'))
      );

      expect(result).toBeInstanceOf(RouteGroup);
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
        sinon.match.instanceOf(RouteGroup).and(sinon.match.has('path', ''))
      );

      expect(result).toBeInstanceOf(RouteGroup);
    });

    it('should be register the nested groups without additional path', () => {
      // Arrange
      const _router = Router();
      const a = sandbox.stub(_router, 'post');
      const router = new RouteGroup('', _router);
      const registerSpy = sandbox.spy();
      const m1: NextFunction = () => null;
      const m2: NextFunction = () => null;
      const m3: NextFunction = () => null;

      // Act
      const result = router.group(m1, m1, (sub1: IRouter) => {
        sub1.post('e', () => {});
        sub1.group(m2, (sub2: IRouter) => {
          sub2.post('d', () => {});
          sub2.group('a/b', m3, m3, m3, (sub3: IRouter) => {
            sub3.post('c', () => {});
            sub3.group('', registerSpy);
          });
        });
      });

      router.group('a', m1, (x: IRouter) => {
        x.post('F', () => {});
      });

      // Assert
      sandbox.assert.calledOnceWithExactly(
        registerSpy,
        sinon.match.instanceOf(RouteGroup).and(sinon.match.has('path', 'a/b'))
      );

      console.log(a.args);
      expect(result).toBeInstanceOf(RouteGroup);
    });
  });

  describe.only('resource', () => {
    it('test', () => {
      const _router = Router();
      const router = new RouteGroup('', _router);
      const m1: NextFunction = () => null;
      const m2: NextFunction = () => null;
      const m3: NextFunction = () => null;

      // Act
      router.group(m1, m1, (sub1: IRouter) => {
        sub1.resource(new BlogController());
        sub1.post('e', () => {});
        sub1.group('blogs', m2, (sub2: IRouter) => {
          sub2.resource(new BlogController());
          sub2.group(m3, m3, m3, (sub3: IRouter) => {
            sub3.resource({
              path: 'comments.likes',
              handlers: new BlogController(),
              middlewares: {
                create: [m1],
              },
              parameters: {
                likes: 'liked:hebe:id',
                comments: 'commenter:id',
              },
            });
          });
        });
      });
    });
  });
});
