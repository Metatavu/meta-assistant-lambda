import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"

/**
 * Middleware to parse JSON from handler.ts
 * 
 * @param handler 
 * @returns parsed JSON from handler.ts
 */
export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser())
}
