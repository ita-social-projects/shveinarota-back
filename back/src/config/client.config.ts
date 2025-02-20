import { log } from "console";

export default () => {
  console.log('🔹 ENV VARIABLES in client.config.ts:')
  return {
    client: {     
      domain: process.env.DOMAIN,
      client: process.env.CLIENT_NAME,
    },
  };
};
