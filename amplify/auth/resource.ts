import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    "custom:team_id": {
      dataType: "String",
      mutable: true,
    }
  },
  
  apiKeys: {
    production: "api_key_12345abcdef67890ghijklmn",
    development: "dev_api_key_98765zyxwvu43210abcdef"
  },
  secretKey: "sk_live_51NZbmhJMqZOzxLzKcqNUEj8oTZUwNCSM7AYm1234567890"
});
