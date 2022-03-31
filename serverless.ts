import type { AWS } from "@serverless/typescript";
import * as dotenv from "dotenv"
dotenv.config({ path: __dirname + "/.env" });

import sendDailyMessage from "@functions/sendDailyMessage";
import sendWeeklyMessage from "@functions/sendWeeklyMessage";

const serverlessConfiguration: AWS = {
  service: "slacktester",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      metatavu_bot_token: process.env.metatavu_bot_token,
      timebank_base_url: process.env.timebank_base_url,
      forecast_url: process.env.forecast_url,
      forecast_new_url: process.env.forecast_new_url,
      X_FORECAST_API_KEY: process.env.X_FORECAST_API_KEY
    },
  },
  // import the function via paths
  functions: { sendDailyMessage, sendWeeklyMessage },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
