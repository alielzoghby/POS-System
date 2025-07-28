export function getValueByPath<T= any >(data: any, path?: string): T {
  if (path) {
    const keys = path.split('.');
    return keys.reduce((list, key) => {
      if (list && list[key]) {
        return list[key];
      }
      return null;
    }, data);
  }
  return data;
}
