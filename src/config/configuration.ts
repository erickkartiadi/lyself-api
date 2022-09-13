export const configuration = () => ({
  port: process.env.PORT || 3000,

  jwtSecretKey: process.env.JWT_SECRET_KEY,
  jwtExpires: process.env.JWT_EXPIRES
});
