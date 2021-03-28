[![NPM version](https://img.shields.io/npm/v/express-route-grouping.svg)](https://www.npmjs.com/package/express-route-grouping) [![Build Status](https://travis-ci.org/atayahmet/express-route-grouping.svg?branch=main)](https://travis-ci.org/atayahmet/express-route-grouping) [![Coverage Status](https://coveralls.io/repos/github/atayahmet/express-route-grouping/badge.svg?branch=main)](https://coveralls.io/github/atayahmet/express-route-grouping?branch=main) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) [![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

# Express JS Route Grouping

Although there are many express js route grouping packages, there is no grouping package with dynamic parameter holders feature. Beside [Resource API Model](https://www.thoughtworks.com/insights/blog/rest-api-design-resource-modeling) approach has been integrated in this package basically.

## Install

NPM

```sh
$ npm i express-route-grouping --save
```

Yarn

```sh
$ yarn add express-route-grouping
```

## Basic Usage

```ts
import express from 'express';
import RouteGroup from 'express-route-grouping';

const app = express();
const router = express.Router();
const { group } = new RouteGroup();

group('blogs', blogs => {
  router.get(blogs.to('/'), () => {
    // -> (/blogs)
  });

  blogs.group(':blogId', blog => {
    router.get(blog.to('/'), (req, res) => {
      // -> (/blogs/:blogId)
    });

    router.post(blog.to('/'), (req, res) => {
      // -> (POST: /blogs/:blogId)
    });

    router.get(blog.to('comments'), (req, res) => {
      // -> (/blogs/:blogId/comments)
    });

    router.get(blog.to('likes'), (req, res) => {
      // -> (/blogs/:blogId/likes)
    });
  });
});

app.use('/', router);
```

> **Not:** You can nest all routes unlimitedly as above.

## Resource API Model

Resource api modeling is a approach to standarts some generic http operations.

Let's see the examples:

```ts
import { Router } from 'express';
import RouteGroup from 'express-route-grouping';

const router = Router();
const { group } = new RouteGroup();

group('products', products => {
  products.resource(router, {
    handlers: {
      index(req, res) {
        // -> (GET: /products)
      },

      find(req, res) {
        // -> (GET: /products/:productId)
      },

      create(req, res) {
        // -> (POST: /products)
      },

      update(req, res) {
        // -> (PUT: /products/:productId)
      },

      patch(req, res) {
        // -> (PATCH: /products/:productId)
      },

      delete(req, res) {
        // -> (DELETE: /products/:productId)
      },
    },
  });
});
```

You can also set a class instance including resource methods.

```ts
class BlogController {
  index = (req, res) => {
    // -> index: (GET: /products)
  };

  find = (req, res) => {
    // -> find: (GET: /products/:productId)
  };

  create = (req, res) => {
    // -> create: (POST: /products)
  };

  update = (req, res) => {
    // -> update: (PUT: /products/:productId)
  };

  patch = (req, res) => {
    // -> patch: (PATCH: /products/:productId)
  };

  delete = (req, res) => {
    // -> delete: (DELETE: /products/:productId)
  };
}
```

```ts
group('products', ({ resource }) => {
  resource(router, {
    handlers: new BlogController(),
  });
});
```

> **Note**: You don't have to add all methods to handlers. It will consider only the defined ones.

### Resource Options

| Name           | Type                | Description                                             |
| -------------- | ------------------- | ------------------------------------------------------- |
| handlers       | Function/Function[] | This is main handler(s). It can pass multiple handlers. |
| beforeHandlers | Function[]          | Adds handlers to **before** main handlers.              |
| afterHandlers  | Function[]          | Adds handlers to **after** main handlers.               |

### Nested Resource Model

```ts
import { Router } from 'express';
import RouteGroup from 'express-route-grouping';

const router = Router();
const { group } = new RouteGroup();

group('products', products => {
  products.resource(router, {
    handlers: {
      // -> index: (GET: /products)
      // -> find: (GET: /products/:productId)
      // -> create: (POST: /products)
      // -> update: (PUT: /products/:productId)
      // -> patch: (PATCH: /products/:productId)
      // -> delete: (DELETE: /products/:productId)
    },
  });

  products.group('items', items => {
    items.resource(router, {
      handlers: {
        // -> index: (GET: /products/:productId/items)
        // -> find: (GET: /products/:productId/items/:itemId)
        // -> create: (POST: /products/:productId/items)
        // -> update: (PUT: /products/:productId/items/:itemId)
        // -> patch: (PATCH: /products/:productId/items/:itemId)
        // -> delete: (DELETE: /products/:productId/items/:itemId)
      },
    });
  });
});
```

## Tests

```sh
$ npm test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
