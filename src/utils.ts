import { IResource, ResourceType } from './types';
import camelCase from 'lodash.camelcase';

export const sanitizer = (path: string) => {
  if (path === '/') return '';

  // remove slashes at start and end positions, if exists
  // to sure there is no any slashes.
  return path.replace(/^(\/+)(.)/, '$2').replace(/(.)(\/+)$/, '$1');
};

export const leftPad = (value: string, pad: string, cond: boolean) => {
  let newValue = value;
  // add delimiter on the end
  if (cond === true) {
    newValue = value.padStart(value.length + 1, pad);
  }
  return newValue;
};

export const normalizePath = (...paths: string[]) => {
  return paths
    .map(sanitizer)
    .filter(Boolean)
    .join('/');
};

export const isResourceConfig = (
  opts: IResource | ResourceType
): opts is ResourceType => {
  return 'handlers' in opts;
};

export const makePlaceholder = (name: string) => {
  if (!name || name.startsWith(':')) {
    return name;
  }
  return `:${name}`;
};

export const makeCamelCase = (...args: string[]) =>
  camelCase(
    args
      .filter(Boolean)
      .map(v => v.trim())
      .join(' ')
  );
