const RESOURCES = {
  index: { method: 'get', suffix: false },
  find: { method: 'get', suffix: true },
  create: { method: 'post', suffix: false },
  update: { method: 'put', suffix: true },
  patch: { method: 'patch', suffix: true },
  delete: { method: 'delete', suffix: true },
} as Record<string, Record<string, any>>;

export default RESOURCES;
