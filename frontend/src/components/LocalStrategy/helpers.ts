export const handleSetTokens = (token: string, refreshToken: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
};
