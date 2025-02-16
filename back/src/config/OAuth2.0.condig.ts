export default () => {
  console.log('🔹 ENV VARIABLES in google-auth.config.ts:');
  return {
    googleAuth: {
      clientId: process.env.GOOGLE_CLIENT_ID, // Google Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google Client Secret
      callbackUrl: process.env.GOOGLE_CALLBACK_URL, // URL для callback'а после успешной авторизации
    },
    jwt: {
      secret: process.env.JWT_SECRET, // Секрет для JWT
      expiresIn: process.env.JWT_EXPIRES_IN || '1h', // Время жизни токена по умолчанию 1 час
    },
  };
};
