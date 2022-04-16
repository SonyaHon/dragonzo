export const parseMongoDublicatedFieldException = (
  error: any,
  keyPattern: string,
): boolean => {
  return (
    'code' in error &&
    error.code === 11000 &&
    'keyPattern' in error &&
    error.keyPattern[keyPattern] === 1
  );
};

export const checkError = <T extends Error, Z extends new (...arg: any) => T>(
  error: any,
  ...toCheck: Z[]
): boolean => {
  return toCheck.some((ctor) => {
    return error instanceof ctor;
  });
};
