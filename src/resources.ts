const RESOURCES = {
  index: { method: 'get', suffix: false },
  show: { method: 'get', suffix: true },
  store: { method: 'post', suffix: false },
  update: { method: 'put', suffix: true },
  patch: { method: 'patch', suffix: true },
  destroy: { method: 'delete', suffix: true },
};

export default RESOURCES;
