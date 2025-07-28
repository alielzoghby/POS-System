export function filterNullEntity<T extends object>(entity: T): T {
  return Object.keys(entity).reduce((clearedEntity, key) => {
    const value = entity[key as keyof T];
    if (value || value === 0 || value === false) {
      clearedEntity[key as keyof T] = value;
    }
    return clearedEntity;
  }, {} as T);
}
