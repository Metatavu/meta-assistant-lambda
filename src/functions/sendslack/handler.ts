import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { DateTime } from "luxon";
import schema, { TimeEntry } from "./schema";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import TimeBankUtilities from "src/features/timebank/timebank-utils";
import SlackApiUtilities from "src/features/slackapi/slackapi-utils";

/**
 * main function
 * 
 * @param event 
 * @returns JSON response
 */
const sendSlack: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => {

  try {
    const persons = await TimeBankApiProvider.getPersons();

    const timeEntries: TimeEntry[] = [];

    const yesterday = DateTime.now().minus({ days: 1 }).toISODate();
  
    for (const person of persons) {
      timeEntries.push(...await TimeBankApiProvider.getTimeEntries(person.id, yesterday, yesterday ));
    }

    const formattedTimebankData = await TimeBankUtilities.formatTimebankData(persons, timeEntries);
    
    const userData = await SlackApiUtilities.getSlackUserData();

    SlackApiUtilities.postMessage(formattedTimebankData, userData);

    return formatJSONResponse({
      message: `Everything went well ${event.body.name}...`,
      event,
    });
  } catch (error) {
    return formatJSONResponse({
      message: `Error while sending slack message: ${error}`,
      event,
    });
  }
};

export const main = middyfy(sendSlack);