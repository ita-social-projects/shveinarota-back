export default () => {
  console.log('🔹 ENV VARIABLES in client.config.ts:')
  return {
    client: {     
      domain: process.env.DOMAIN,
      client: process.env.CLIENT_NAME,
      maxage: process.env.JWT_EXPIRES_IN
    },
  };
};
