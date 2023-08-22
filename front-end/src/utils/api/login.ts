export const requestLogin = (username: string, password: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve("12345"), 100);
  });
};
