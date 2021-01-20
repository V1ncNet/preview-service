export const atob = (url: string): string => {
  const buffer = Buffer.from(url, 'base64');
  return buffer.toString('utf-8');
}

export const btoa = (url: string): string => {
  const buffer = Buffer.from(url, 'utf-8');
  return buffer.toString('base64');
}
