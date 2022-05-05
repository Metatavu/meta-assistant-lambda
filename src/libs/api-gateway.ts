import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";
import { DailyMessageData, WeeklyMessageData } from "@functions/schema";
import schema from "../functions/schema";

/**
 * ValidatedAPIGatewayProxyEvent<S> data type for serverless lambda function
 */
export type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & { body: FromSchema<S> };

/**
 * ValidatedEventAPIGatewayProxyEvent<S> data type for serverless lambda function
 */
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export type DailyHandlerResponse = {
  message: string,
  data?: DailyMessageData[],
  event?: ValidatedAPIGatewayProxyEvent<typeof schema>,
};

export type WeeklyHandlerResponse = {
  message: string,
  data?: WeeklyMessageData[],
  event?: ValidatedAPIGatewayProxyEvent<typeof schema>,
};

/**
 * Provides response when function invoked
 * 
 * @param response 
 * @returns status code and response body
 */
export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};