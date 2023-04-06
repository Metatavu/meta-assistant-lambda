import envalid, { str , url , cleanEnv } from 'envalid';
const { str, num, bool } = require('envalid');

export const env = envalid.cleanEnv(process.env, {
  X_FORECAST_API_KEY: str({default: ""}),
  METATAVU_BOT_TOKEN: str({default: ""}),
  TIMEBANK_BASE_URL: url(),
  FORECAST_BASE_URL: url(),
  KEYCLOAK_CLIENT_SECRET: str({default: ""}),
  KEYCLOAK_BASE_URL: url(),
  KEYCLOAK_REALM: str({default: ""}),
  KEYCLOAK_USERNAME: str({default: ""}),
  KEYCLOAK_PASSWORD: str({default: ""}),
  KEYCLOAK_CLIENT: str({default: ""}),
  STAGING_IDS: str({default: ""})
});

module.exports = {
    X_FORECAST_API_KEY: env.X_FORECAST_API_KEY,
    METATAVU_BOT_TOKEN: env.METATAVU_BOT_TOKEN,
    TIMEBANK_BASE_URL: env.TIMEBANK_BASE_URL,
    FORECAST_BASE_URL: env.FORECAST_BASE_URL,
    KEYCLOAK_CLIENT_SECRET: env.KEYCLOAK_CLIENT_SECRET,
    KEYCLOAK_BASE_URL: env.KEYCLOAK_BASE_URL,
    KEYCLOAK_REALM: env.KEYCLOAK_REALM,
    KEYCLOAK_USERNAME: env.KEYCLOAK_USERNAME,
    KEYCLOAK_PASSWORD: env.KEYCLOAK_PASSWORD,
    KEYCLOAK_CLIENT: env.KEYCLOAK_CLIENT,
    STAGING_IDS: env.STAGING_IDS,
};