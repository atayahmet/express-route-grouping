import express from 'express';
import RouteGroup from '../src';

describe('Route Group Tests', () => {
  describe('Grouping variants', () => {
    test('in one level', () => {
      const { group } = new RouteGroup();
      group('base', ({ to }) => {
        expect(to('/')).toEqual('/base');
        expect(to('/:id')).toEqual('/base/:id');
      });

      group('/', ({ to }) => {
        expect(to('/list')).toEqual('/list');
      });
    });

    test('in two levels', () => {
      const { group } = new RouteGroup();
      group('base', ({ to, group }) => {
        expect(to('/')).toEqual('/base');

        group('/content/:id', ({ to }) => {
          expect(to('/create')).toEqual('/base/content/:id/create');
          expect(to('/delete/one')).toEqual('/base/content/:id/delete/one');
        });
      });
    });

    test('in three levels', () => {
      const { group } = new RouteGroup();
      group('base', ({ to, group }) => {
        expect(to('/')).toEqual('/base');

        group('/content/:id', ({ to, group }) => {
          expect(to('/create')).toEqual('/base/content/:id/create');
          expect(to('/delete/one')).toEqual('/base/content/:id/delete/one');

          group('/tags', ({ to }) => {
            expect(to('/')).toEqual('/base/content/:id/tags');
            expect(to('/:id')).toEqual('/base/content/:id/tags/:id');
          });
        });
      });
    });

    test('in four levels', () => {
      const { group } = new RouteGroup();
      group('base', ({ to, group }) => {
        expect(to('/')).toEqual('/base');

        group('/content/:id', ({ to, group }) => {
          expect(to('/create')).toEqual('/base/content/:id/create');
          expect(to('/delete/one')).toEqual('/base/content/:id/delete/one');

          group('/tags', ({ to, group }) => {
            expect(to('/')).toEqual('/base/content/:id/tags');
            expect(to('/:id')).toEqual('/base/content/:id/tags/:id');

            group('/tags', ({ to }) => {
              expect(to('/add')).toEqual('/base/content/:id/tags/tags/add');
              expect(to('/edit/:id')).toEqual(
                '/base/content/:id/tags/tags/edit/:id'
              );
              expect(to('/delete/:id')).toEqual(
                '/base/content/:id/tags/tags/delete/:id'
              );
            });
          });
        });
      });
    });

    test('in five levels', () => {
      const { group } = new RouteGroup();
      group('base', ({ to, group }) => {
        expect(to('/')).toEqual('/base');

        group('/content/:id', ({ to, group }) => {
          expect(to('/create')).toEqual('/base/content/:id/create');
          expect(to('/delete/one')).toEqual('/base/content/:id/delete/one');

          group('/tags', ({ to, group }) => {
            expect(to('/')).toEqual('/base/content/:id/tags');
            expect(to('/:id')).toEqual('/base/content/:id/tags/:id');

            group('/tags', ({ to, group }) => {
              expect(to('/add')).toEqual('/base/content/:id/tags/tags/add');
              expect(to('/edit/:id')).toEqual(
                '/base/content/:id/tags/tags/edit/:id'
              );
              expect(to('/delete/:id')).toEqual(
                '/base/content/:id/tags/tags/delete/:id'
              );

              group('/products', ({ to }) => {
                expect(to('/')).toEqual('/base/content/:id/tags/tags/products');
                expect(to('/:id')).toEqual(
                  '/base/content/:id/tags/tags/products/:id'
                );
              });
            });
          });
        });
      });
    });
  });

  describe('grouping multiple different path', () => {
    test('in one level', () => {
      const { group } = new RouteGroup();
      group('base', ({ group, to }) => {
        expect(to('/')).toEqual('/base');

        group('/content/:id', ({ to }) => {
          expect(to('/create')).toEqual('/base/content/:id/create');
          expect(to('/delete/one')).toEqual('/base/content/:id/delete/one');
        });

        group('/content/tags', ({ to }) => {
          expect(to('/')).toEqual('/base/content/tags');
          expect(to('/:id')).toEqual('/base/content/tags/:id');
        });

        group('/content/tags/products', ({ to, group }) => {
          expect(to('/')).toEqual('/base/content/tags/products');
          expect(to('/:id')).toEqual('/base/content/tags/products/:id');

          group('/level-2', ({ to }) => {
            expect(to('/')).toEqual('/base/content/tags/products/level-2');
          });
        });

        group('/content/level-1', ({ to }) => {
          expect(to('/')).toEqual('/base/content/level-1');
        });
      });
    });
  });

  describe('grouping path style variants', () => {
    it('two level group', () => {
      const { group } = new RouteGroup();

      group('/base', ({ group }) => {
        group('level1', ({ to }) => {
          expect(to('/')).toEqual('/base/level1');
        });

        group('/level1/:levelId', ({ to }) => {
          expect(to('/add')).toEqual('/base/level1/:levelId/add');
        });

        group('level-1/:levelId/:uid', ({ to }) => {
          expect(to('/add')).toEqual('/base/level-1/:levelId/:uid/add');
        });

        group('level-1/:levelId/:uid/als', ({ to }) => {
          expect(to('/add-2')).toEqual('/base/level-1/:levelId/:uid/als/add-2');
        });

        group('level-1/:levelId', ({ to }) => {
          expect(to('/add-3')).toEqual('/base/level-1/:levelId/add-3');
        });
      });
    });
  });

  describe('asymmetric groups', () => {
    test('parent group empty', () => {
      const { group } = new RouteGroup();
      group('', ({ to }) => {
        expect(to()).toEqual('/');
      });

      group('', ({ group }) => {
        group('', ({ to }) => {
          expect(to()).toEqual('/');

          group('', ({ to }) => {
            expect(to('/')).toEqual('/');
          });
        });
      });
    });

    test('hash url', () => {
      const { group } = new RouteGroup();
      group('products', ({ to }) => {
        expect(to('#tab-1')).toEqual('/products/#tab-1');
        expect(to('#tab-2')).toEqual('/products/#tab-2');
      });

      group('members#books', ({ to, group }) => {
        expect(to('/')).toEqual('/members#books');
        expect(to('/sci-fi')).toEqual('/members#books/sci-fi');

        group('sci-fi', ({ to }) => {
          expect(to('/')).toEqual('/members#books/sci-fi');
          expect(to('/the-martian')).toEqual(
            '/members#books/sci-fi/the-martian'
          );
        });
      });
    });
  });

  describe('resource modeling groups', () => {
    test('in one level', () => {
      const { group } = new RouteGroup();
      const router = express.Router();
      group('products', ({ resource }) => {
        resource(router, {
          excludes: [],
          handlers: {
            index: () => {},
            find: () => {},
            create: () => {},
            update: () => {},
            delete: () => {},
            patch: () => {},
          },
        });

        const routeIndex = router.stack.find(({ route }) => {
          return route.path === '/products' && route.methods.get === true;
        });
        expect(routeIndex).not.toEqual(undefined);

        const routeFind = router.stack.find(({ route }) => {
          return (
            route.path === '/products/:productId' && route.methods.get === true
          );
        });
        expect(routeFind).not.toEqual(undefined);

        const routeCreate = router.stack.find(({ route }) => {
          return route.path === '/products' && route.methods.post === true;
        });
        expect(routeCreate).not.toEqual(undefined);

        const routeUpdate = router.stack.find(({ route }) => {
          return (
            route.path === '/products/:productId' && route.methods.put === true
          );
        });
        expect(routeUpdate).not.toEqual(undefined);

        const routeDelete = router.stack.find(({ route }) => {
          return (
            route.path === '/products/:productId' &&
            route.methods.delete === true
          );
        });
        expect(routeDelete).not.toEqual(undefined);

        const routePatch = router.stack.find(({ route }) => {
          return (
            route.path === '/products/:productId' &&
            route.methods.patch === true
          );
        });
        expect(routePatch).not.toEqual(undefined);
      });
    });

    test('in two level', () => {
      const { group } = new RouteGroup();
      const router = express.Router();

      group('products', ({ group }) => {
        group('orders', ({ resource }) => {
          resource(router, { handlers: { index: () => {}, find: () => {} } });

          const routeIndex = router.stack.find(({ route }) => {
            return (
              route.path === '/products/orders' && route.methods.get === true
            );
          });
          expect(routeIndex).toBeTruthy();

          const routeFind = router.stack.find(({ route }) => {
            return (
              route.path === '/products/orders/:orderId' &&
              route.methods.get === true
            );
          });
          expect(routeFind).toBeTruthy();

          const routeCreate = router.stack.find(({ route }) => {
            return (
              route.path === '/products/orders' && route.methods.post === true
            );
          });
          expect(routeCreate).toEqual(undefined);
        });
      });
    });

    it('should excludes methods defined in params', () => {
      const { group } = new RouteGroup();
      const router = express.Router();

      group('products', ({ resource }) => {
        resource(router, {
          handlers: { create: () => {} },
        });

        const routeCreate = router.stack.find(({ route }) => {
          return route.path === '/products' && route.methods.post === true;
        });
        expect(routeCreate).toBeTruthy();

        const routeIndex = router.stack.find(({ route }) => {
          return route.path === '/products' && route.methods.get === true;
        });
        expect(routeIndex).toBeUndefined();
      });
    });

    test('add additional methods on resources methods', () => {
      const { group } = new RouteGroup();
      const router = express.Router();

      group('products', ({ resource, to }) => {
        resource(router, {
          handlers: { index: () => {}, create: () => {} },
        });
        expect(to('/customCreate')).toEqual('/products/customCreate');
      });
    });

    test('handlers of before/after', () => {
      const { group } = new RouteGroup();
      const router = express.Router();

      group('products', ({ resource }) => {
        function beforeHandler(req: any) {
          console.log('Request: ', req);
        }

        function afterHandler(req: any) {
          console.log('Request: ', req);
        }

        resource(router, {
          handlers: { index: () => {}, create: () => {} },
          beforeHandlers: [beforeHandler],
          afterHandlers: [afterHandler],
        });

        expect(router.stack[0].route.stack.length).toEqual(3);
        expect(router.stack[0].route.stack[0].name).toEqual('beforeHandler');
        expect(router.stack[0].route.stack[1].name).toEqual('index');
        expect(router.stack[0].route.stack[2].name).toEqual('afterHandler');
      });
    });

    test('resource specific multiple handlers', () => {
      const { group } = new RouteGroup();
      const router = express.Router();

      group('products', ({ resource }) => {
        function beforeHandler(req: any) {
          console.log('Request: ', req);
        }

        function afterHandler(req: any) {
          console.log('Request: ', req);
        }

        function indexHandler1() {}
        function indexHandler2() {}

        resource(router, {
          handlers: { index: [indexHandler1, indexHandler2] },
          beforeHandlers: [beforeHandler],
          afterHandlers: [afterHandler],
        });

        expect(router.stack[0].route.stack.length).toEqual(4);
        expect(router.stack[0].route.stack[0].name).toEqual('beforeHandler');
        expect(router.stack[0].route.stack[1].name).toEqual('indexHandler1');
        expect(router.stack[0].route.stack[2].name).toEqual('indexHandler2');
        expect(router.stack[0].route.stack[3].name).toEqual('afterHandler');
      });
    });

    test('invalid resource exception', () => {
      const { group } = new RouteGroup();
      const router = express.Router();

      group('invalid', ({ resource }) => {
        expect(() => {
          resource(router, undefined as any);
        }).toThrowError('Resource handlers are required!');
      });
    });
  });

  describe('some other tests', () => {
    test('undefined path data', () => {
      const { group } = new RouteGroup();
      group(undefined, ({ to }) => {
        expect(to('/')).toEqual('/');
      });
    });
  });
});
