export const countOccurrencesOf = (str: string, sub: string): number => {
  return (str.match(new RegExp(sub, 'g')) || []).length;
}
