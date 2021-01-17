type FunctionType = <T>(n: number, value: T) => T[];

export const nCopies: FunctionType = <T>(n: number, o: T) => {
  const result: T[] = [];

  for (let i = 0; i <= n; i++) {
    result.push(o);
  }

  return result;
}
