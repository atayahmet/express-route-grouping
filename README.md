[![NPM version](https://img.shields.io/npm/v/express-route-grouping.svg)](https://www.npmjs.com/package/express-route-grouping) [![Build Status](https://travis-ci.org/atayahmet/express-route-grouping.svg?branch=main)](https://travis-ci.org/atayahmet/express-route-grouping) [![Coverage Status](https://coveralls.io/repos/github/atayahmet/express-route-grouping/badge.svg?branch=main)](https://coveralls.io/github/atayahmet/express-route-grouping?branch=main) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) [![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

# Express JS Route Grouping

Although there are many express js route grouping packages, I wanted to create a package that is more flexible and easy to use. You can easily group your routes and add middleware to them.

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

```typescript
import RouteGrouping from 'express-route-grouping';

const root = RouteGrouping();

const m1 = (req, res, next) => {
  console.log('Middleware 1');
  next();
};

const m2 = (req, res, next) => {
  console.log('Middleware 2');
  next();
};

const auth = (req, res, next) => {
  console.log('Auth Middleware');
  next();
};

root.group('/api', m1, m2, api => {
  api.group('/v1', auth, v1 => {
    v1.get('/users', (req, res) => {
      res.send('Users');
    });
  });
});

app.use(root.getRouter());
```

> Note: You can add as many middlewares as you want.

Add middleware to the group without adding a route.

```typescript
root.group('/api', m1, m2, api => {
  api.group(auth, perm, api => {
    api.get('/users', (req, res) => {
      res.send('Users');
    });
    api.get('/comments', (req, res) => {
      res.send('Comments');
    });
  });
});
```

> **Not:** You can nest all routes unlimitedly as above.

## Resource API Model

You can use the resource API model to create a RESTful API. Resource api modeling is a approach to standarts some generic http operations.

Let's see the examples:

```typescript
import { IResource } from 'express-route-grouping';

class UserController implements IResource {
  index(req, res) {
    res.send('Users');
  }

  show(req, res) {
    res.send('User');
  }

  store(req, res) {
    res.send('User created');
  }

  update(req, res) {
    res.send('User updated');
  }

  patch(req, res) {
    res.send('User patched');
  }

  destroy(req, res) {
    res.send('User deleted');
  }
}

root.group('/api', m1, m2, api => {
  api.group('/v1', v1Auth, v1 => {
    v1.resource(new UserController());
  });

  api.group('/v2', v2Auth, v2 => {
    v2.resource(new UserController());
  });
});
```

The output of the above code is as follows:

**v1**

```plaintext
GET    /api/v1/users
GET    /api/v1/users/:userId
POST   /api/v1/users
PUT    /api/v1/users/:userId
PATCH  /api/v1/users/:userId
DELETE /api/v1/users/:userId

// added middlewares
middlewares: [m1, m2, v1Auth]
```

**v2**

```plaintext
GET    /api/v2/users
GET    /api/v2/users/:userId
POST   /api/v2/users
PUT    /api/v2/users/:userId
PATCH  /api/v2/users/:userId
DELETE /api/v2/users/:userId

// added middlewares
middlewares: [m1, m2, v2Auth]
```

> Note: You don't need to add all routes to the controller. You can add only the routes you want to use.

### Resource API Model Configuration

You can configure the resource API model as you wish.

```typescript
root.resource({
  path: 'blogs.comments.likes',
  handlers: new UserController(),
  middlewares: {
    index: [auth],
    delete: [auth, perm],
  },
  parameters: {
    blogs: 'slug',
  },
});
```

The output of the above code is as follows:

```plaintext
GET    /blogs/:slug/comments/:commentId/likes
          ├── middlewares: [auth]
GET    /blogs/:slug/comments/:commentId/likes/:likeId
POST   /blogs/:slug/comments/:commentId/likes
PUT    /blogs/:slug/comments/:commentId/likes/:likeId
PATCH  /blogs/:slug/comments/:commentId/likes/:likeId
DELETE /blogs/:slug/comments/:commentId/likes/:likeId
          ├── middlewares: [auth, perm]
```

We added the middlewares to the `index` and `destroy` routes. We also added the parameter to the blogs route as `:slug` instead of `:blogId`.

### Resource API Model Configuration Parameters

| Name          | Type      | Required | Description               |
| ------------- | --------- | -------- | ------------------------- |
| `path`        | string    | false    | The path of the resource. |
| `handlers`    | object    | true     | The controller object.    |
| `middlewares` | Endpoints | false    | The middlewares object.   |
| `parameters`  | object    | false    | The parameters object.    |

### Endpoints

| Name      | Type   | Description        |
| --------- | ------ | ------------------ |
| `index`   | GET    | List all resources |
| `show`    | GET    | Show a resource    |
| `store`   | POST   | Create a resource  |
| `update`  | PUT    | Update a resource  |
| `patch`   | PATCH  | Patch a resource   |
| `destroy` | DELETE | Delete a resource  |

> Note: This resource configuration model is inspired by the [Laravel](https://laravel.com/docs/8.x/controllers#resource-controllers) PHP framework.

## Tests

```sh
$ npm test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
