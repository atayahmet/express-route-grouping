import express from 'express';
import RouteGroup from '../src';

describe('Route Group Tests', () => {
  describe('Grouping variants', () => {
    test('in one level', () => {
      const root = new RouteGroup('/', express.Router());
      root.group('/base', base => {
        base.get('/', () => null);
        base.get('/:id', () => null);
        const router = base.export();
        expect(router.stack[0].route.path).toEqual('/base');
        expect(router.stack[1].route.path).toEqual('/base/:id');
      });

      root.group('/', base2 => {
        base2.get('/list', () => null);
        const router = base2.export();
        expect(router.stack[2].route.path).toEqual('/list');
      });
    });

    test('in two levels', () => {
      const { group } = new RouteGroup('/', express.Router());
      group('base', base => {
        base.get('/', () => null);
        const router = base.export();
        expect(router.stack[0].route.path).toEqual('/base');

        base.group('/content/:id', content => {
          content.post('/create', () => null);
          content.delete('/delete/one', () => null);
          const router = content.export();
          expect(router.stack[1].route.path).toEqual(
            '/base/content/:id/create'
          );
          expect(router.stack[2].route.path).toEqual(
            '/base/content/:id/delete/one'
          );
        });
      });
    });

    test('in three levels', () => {
      const { group } = new RouteGroup('/', express.Router());
      group('base', base => {
        base.get('/', () => null);
        const router = base.export();

        expect(router.stack[0].route.path).toEqual('/base');

        base.group('/content/:id', content => {
          content.post('/create', () => null);
          content.delete('/delete/one', () => null);

          expect(router.stack[1].route.path).toEqual(
            '/base/content/:id/create'
          );
          expect(router.stack[2].route.path).toEqual(
            '/base/content/:id/delete/one'
          );

          content.group('/tags', tags => {
            tags.get('/', () => null);
            tags.get('/:id', () => null);
            expect(router.stack[3].route.path).toEqual(
              '/base/content/:id/tags'
            );
            expect(router.stack[4].route.path).toEqual(
              '/base/content/:id/tags/:id'
            );
          });
        });
      });
    });

    test('in four levels', () => {
      const { group } = new RouteGroup('/', express.Router());
      group('base', base => {
        base.get('/', () => null);
        const router = base.export();

        expect(router.stack[0].route.path).toEqual('/base');

        base.group('/content/:id', content => {
          content.post('/create', () => null);
          content.delete('/delete/one', () => null);

          expect(router.stack[1].route.path).toEqual(
            '/base/content/:id/create'
          );
          expect(router.stack[2].route.path).toEqual(
            '/base/content/:id/delete/one'
          );

          content.group('/tags', tags => {
            tags.get('/', () => null);
            tags.get('/:id', () => null);

            expect(router.stack[3].route.path).toEqual(
              '/base/content/:id/tags'
            );
            expect(router.stack[4].route.path).toEqual(
              '/base/content/:id/tags/:id'
            );

            tags.group('/tags', tags2 => {
              tags2.post('/add', () => null);
              tags2.put('/edit/:id', () => null);
              tags2.delete('/delete/:id', () => null);

              expect(router.stack[5].route.path).toEqual(
                '/base/content/:id/tags/tags/add'
              );
              expect(router.stack[6].route.path).toEqual(
                '/base/content/:id/tags/tags/edit/:id'
              );
              expect(router.stack[7].route.path).toEqual(
                '/base/content/:id/tags/tags/delete/:id'
              );
            });
          });
        });
      });
    });

    test('in five levels', () => {
      const { group } = new RouteGroup('/', express.Router());
      group('base', base => {
        base.get('/', () => null);
        const router = base.export();

        expect(router.stack[0].route.path).toEqual('/base');

        base.group('/content/:id', content => {
          content.post('/create', () => null);
          content.post('/delete/one', () => null);

          expect(router.stack[1].route.path).toEqual(
            '/base/content/:id/create'
          );
          expect(router.stack[2].route.path).toEqual(
            '/base/content/:id/delete/one'
          );

          content.group('/tags', tags => {
            tags.get('/', () => null);
            tags.get('/:id', () => null);

            expect(router.stack[3].route.path).toEqual(
              '/base/content/:id/tags'
            );
            expect(router.stack[4].route.path).toEqual(
              '/base/content/:id/tags/:id'
            );

            tags.group('/tags', tags2 => {
              tags2.post('/add', () => null);
              tags2.patch('/edit/:id', () => null);
              tags2.delete('/delete/:id', () => null);

              expect(router.stack[5].route.path).toEqual(
                '/base/content/:id/tags/tags/add'
              );
              expect(router.stack[6].route.path).toEqual(
                '/base/content/:id/tags/tags/edit/:id'
              );
              expect(router.stack[7].route.path).toEqual(
                '/base/content/:id/tags/tags/delete/:id'
              );

              tags2.group('/products', products => {
                products.get('/', () => null);
                products.get('/:id', () => null);

                expect(router.stack[8].route.path).toEqual(
                  '/base/content/:id/tags/tags/products'
                );
                expect(router.stack[9].route.path).toEqual(
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
      const { group } = new RouteGroup('/', express.Router());
      group('base', base => {
        base.get('/', () => null);
        const router = base.export();

        expect(router.stack[0].route.path).toEqual('/base');

        base.group('/content/:id', content => {
          content.post('/create', () => null);
          content.delete('/delete/one', () => null);
          expect(router.stack[1].route.path).toEqual(
            '/base/content/:id/create'
          );
          expect(router.stack[2].route.path).toEqual(
            '/base/content/:id/delete/one'
          );
        });

        base.group('/content/tags', tags => {
          tags.get('/', () => null);
          tags.get('/:id', () => null);
          expect(router.stack[3].route.path).toEqual('/base/content/tags');
          expect(router.stack[4].route.path).toEqual('/base/content/tags/:id');
        });

        base.group('/content/tags/products', products => {
          products.get('/', () => null);
          products.get('/:id', () => null);
          expect(router.stack[5].route.path).toEqual(
            '/base/content/tags/products'
          );
          expect(router.stack[6].route.path).toEqual(
            '/base/content/tags/products/:id'
          );

          products.group('/level-2', level2 => {
            level2.get('/', () => null);
            expect(router.stack[7].route.path).toEqual(
              '/base/content/tags/products/level-2'
            );
          });
        });

        base.group('/content/level-1', level1 => {
          level1.get('/', () => null);
          expect(router.stack[8].route.path).toEqual('/base/content/level-1');
        });
      });
    });
  });

  describe('grouping path style variants', () => {
    it('two level group', () => {
      const { group } = new RouteGroup('/', express.Router());

      group('/base', base => {
        const router = base.export();

        base.group('level1', level1 => {
          level1.get('/', () => null);
          expect(router.stack[0].route.path).toEqual('/base/level1');
        });

        base.group('/level1/:levelId', level1LevelId => {
          level1LevelId.post('/add');
          expect(router.stack[1].route.path).toEqual(
            '/base/level1/:levelId/add'
          );
        });

        base.group('level-1/:levelId/:uid', level1LevelIdUid => {
          level1LevelIdUid.post('/add', () => null);
          expect(router.stack[2].route.path).toEqual(
            '/base/level-1/:levelId/:uid/add'
          );
        });

        base.group('level-1/:levelId/:uid/als', level1LevelIdUidAls => {
          level1LevelIdUidAls.post('/add-2', () => null);
          expect(router.stack[3].route.path).toEqual(
            '/base/level-1/:levelId/:uid/als/add-2'
          );
        });

        base.group('level-1/:levelId', level1LevelId => {
          level1LevelId.post('/add-3', () => null);
          expect(router.stack[4].route.path).toEqual(
            '/base/level-1/:levelId/add-3'
          );
        });
      });
    });
  });
  describe('asymmetric paths', () => {
    test('without first slash', () => {
      const { group } = new RouteGroup('/', express.Router());
      group('blogs', base => {
        const router = base.export();
        base.get(':id', () => null);
        expect(router.stack[0].route.path).toEqual('/blogs/:id');

        base.group(':id/comments', comments => {
          comments.get('/', () => null);
          expect(router.stack[1].route.path).toEqual('/blogs/:id/comments');
        });
      });
    });
  });

  describe('asymmetric groups', () => {
    test('parent group empty', () => {
      const { group } = new RouteGroup('/', express.Router());

      group('', base => {
        const router = base.export();
        base.get('', () => null);
        expect(router.stack[0].route.path).toEqual('/');
      });

      group('', base => {
        const router = base.export();
        base.group('', empty => {
          empty.get('', () => null);
          expect(router.stack[1].route.path).toEqual('/');

          empty.group('', empty2 => {
            empty2.get('/', () => null);
            expect(router.stack[2].route.path).toEqual('/');
          });
        });
      });
    });

    test('hash url', () => {
      const { group } = new RouteGroup('/', express.Router());
      group('products', products => {
        const router = products.export();
        products.get('#tab-1', () => null);
        products.get('#tab-2', () => null);
        expect(router.stack[0].route.path).toEqual('/products/#tab-1');
        expect(router.stack[1].route.path).toEqual('/products/#tab-2');
      });

      group('members#books', members => {
        const router = members.export();
        members.get('/', () => null);
        members.get('/sci-fi', () => null);
        expect(router.stack[2].route.path).toEqual('/members#books');
        expect(router.stack[3].route.path).toEqual('/members#books/sci-fi');

        members.group('sci-fi', sciFi => {
          sciFi.get('/', () => null);
          sciFi.get('/the-martian', () => null);
          expect(router.stack[4].route.path).toEqual('/members#books/sci-fi');
          expect(router.stack[5].route.path).toEqual(
            '/members#books/sci-fi/the-martian'
          );
        });
      });
    });
  });

  describe('resource modeling groups', () => {
    test('in one level', () => {
      const { group } = new RouteGroup('/', express.Router());

      group('products', products => {
        products.resource({
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

        const router = products.export();
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
      const { group } = new RouteGroup('/', express.Router());

      group('products', products => {
        const router = products.export();

        products.group('orders', orders => {
          orders.resource({ handlers: { index: () => {}, find: () => {} } });

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
      const { group } = new RouteGroup('/', express.Router());

      group('products', products => {
        const router = products.export();
        products.resource({
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
      const { group } = new RouteGroup('/', express.Router());

      group('products', products => {
        const router = products.export();
        products.resource({
          handlers: { index: () => {}, create: () => {} },
        });
        products.get('/customCreate', () => null);
        expect(router.stack[2].route.path).toEqual('/products/customCreate');
      });
    });

    test('handlers of before/after', () => {
      const { group } = new RouteGroup('/', express.Router());

      group('products', products => {
        const router = products.export();
        function beforeHandler(req: any) {
          console.log('Request: ', req);
        }

        function afterHandler(req: any) {
          console.log('Request: ', req);
        }

        products.resource({
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
      const { group } = new RouteGroup('/', express.Router());

      group('products', products => {
        const router = products.export();
        function beforeHandler(req: any) {
          console.log('Request: ', req);
        }

        function afterHandler(req: any) {
          console.log('Request: ', req);
        }

        function indexHandler1() {}
        function indexHandler2() {}

        products.resource({
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

    it('should trim non-alphanumeric characters from route parameters', () => {
      const { group } = new RouteGroup('/', express.Router());

      group('product-brands', products => {
        products.resource({
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

        const router = products.export();
        const routeIndex = router.stack.find(({ route }) => {
          return route.path === '/product-brands' && route.methods.get === true;
        });
        expect(routeIndex).not.toEqual(undefined);

        const routeFind = router.stack.find(({ route }) => {
          return (
            route.path === '/product-brands/:productbrandId' &&
            route.methods.get === true
          );
        });
        expect(routeFind).not.toEqual(undefined);

        const routeCreate = router.stack.find(({ route }) => {
          return (
            route.path === '/product-brands' && route.methods.post === true
          );
        });
        expect(routeCreate).not.toEqual(undefined);

        const routeUpdate = router.stack.find(({ route }) => {
          return (
            route.path === '/product-brands/:productbrandId' &&
            route.methods.put === true
          );
        });
        expect(routeUpdate).not.toEqual(undefined);

        const routeDelete = router.stack.find(({ route }) => {
          return (
            route.path === '/product-brands/:productbrandId' &&
            route.methods.delete === true
          );
        });
        expect(routeDelete).not.toEqual(undefined);

        const routePatch = router.stack.find(({ route }) => {
          return (
            route.path === '/product-brands/:productbrandId' &&
            route.methods.patch === true
          );
        });
        expect(routePatch).not.toEqual(undefined);
      });
    });

    test('invalid resource exception', () => {
      const { group } = new RouteGroup('/', express.Router());

      group('invalid', invalid => {
        expect(() => {
          invalid.resource(undefined as any);
        }).toThrowError('Resource handlers are required!');
      });
    });
  });

  describe('some other tests', () => {
    test('undefined path data', () => {
      const { group } = new RouteGroup('/', express.Router());
      group(undefined, und => {
        und.get('/', () => null);
        expect(und.export().stack[0].route.path).toEqual('/');
      });
    });

    test('start default path', () => {
      const base = new RouteGroup('/blogs', express.Router());
      const router = base.export();
      expect(base.export().stack.length).toEqual(0);

      base.group('/', blogs => {
        blogs.get('/');
        expect(router.stack[0].route.path).toEqual('/blogs');
      });
    });

    test('Check request methods to make sure any method is not overridden', () => {
      const { group } = new RouteGroup('/blogs', express.Router());
      group('/', base => {
        base.get('/', () => null);
        base.post('/create', () => null);
        base.delete('/delete', () => null);
        base.put('/update', () => null);
        base.patch('/patch', () => null);
        const router = base.export();

        expect(router.stack[0].route.methods.get).toEqual(true);
        expect(router.stack[1].route.methods.post).toEqual(true);
        expect(router.stack[2].route.methods.delete).toEqual(true);
        expect(router.stack[3].route.methods.put).toEqual(true);
        expect(router.stack[4].route.methods.patch).toEqual(true);
      });
    });
  });
});
