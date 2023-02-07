import type { AWS } from "@serverless/typescript";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

import sendDailyMessage from "@functions/send-daily-message";
import sendWeeklyMessage from "@functions/send-weekly-message";

const serverlessConfiguration: AWS = {
  service: "meta-assistant-lambda",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    memorySize: 128,
    timeout: 12,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      METATAVU_BOT_TOKEN: process.env.METATAVU_BOT_TOKEN,
      TIMEBANK_BASE_URL: process.env.TIMEBANK_BASE_URL,
      X_FORECAST_API_KEY: process.env.X_FORECAST_API_KEY,
      FORECAST_BASE_URL: process.env.FORECAST_BASE_URL
    }
  },
  // import the function via paths
  functions: { sendDailyMessage: sendDailyMessage, sendWeeklyMessage: sendWeeklyMessage },
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
      concurrency: 10
    }
  }
};

module.exports = serverlessConfiguration;