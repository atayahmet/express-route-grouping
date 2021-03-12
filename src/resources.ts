const RESOURCES = {
  index: { method: 'get' },
  find: { method: 'get', suffix: '/:id' },
  create: { method: 'post' },
  update: { method: 'put', suffix: '/:id' },
  patch: { method: 'patch', suffix: '/:id' },
  delete: { method: 'delete', suffix: '/:id' },
} as Record<string, Record<string, any>>;

export default RESOURCES;
