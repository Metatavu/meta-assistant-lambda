const { str, url } = require('envalid');

const env = envalid.cleanEnv(process.env, {
  X_FORECAST_API_KEY: str(),
  METATAVU_BOT_TOKEN: str(),
  TIMEBANK_BASE_URL: url(),
  FORECAST_BASE_URL: url(),
  KEYCLOAK_CLIENT_SECRET: str(),
  KEYCLOAK_BASE_URL: url(),
  KEYCLOAK_REALM: str(),
  KEYCLOAK_USERNAME: str(),
  KEYCLOAK_PASSWORD: str(),
  KEYCLOAK_CLIENT: str(),
  STAGING_IDS: str()
});

module.exports = env;