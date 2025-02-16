export default () => {
  console.log('🔹 ENV VARIABLES in database.config.ts:')
  return {
    database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
      domain: process.env.DOMAIN
    },
  };
};
