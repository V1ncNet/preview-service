export const atob = (base64String: string): string => {
  const buffer = Buffer.from(base64String, 'base64');
  return buffer.toString('utf-8');
};

export const btoa = (utf8String: string): string => {
  const buffer = Buffer.from(utf8String, 'utf-8');
  return buffer.toString('base64');
};
