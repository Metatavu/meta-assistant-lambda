import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DateTime } from "luxon";
import SlackApiUtilities from "src/features/slackapi/slackapi-utils";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import TimeBankUtilities from "src/features/timebank/timebank-utils";

import schema, { TimeEntry } from "./schema";

/**
 * main function
 *
 * @param event
 * @returns JSON response
 */
const sendWeeklySlack: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => {

  try {

    const timebankUsers = await TimeBankApiProvider.getTimebankUsers();
    const slackUsers = await SlackApiUtilities.getSlackUsers();

    const timeEntries: TimeEntry[] = [];

    const lastWeek = DateTime.now().minus({ days: 7 }).toISODate();
    const today = DateTime.now().toISODate();

    for (const person of timebankUsers) {
      timeEntries.push(...await TimeBankApiProvider.getTimeEntries(person.id, today, lastWeek ));
    }

    const formattedTimebankData = await TimeBankUtilities.formatTimebankData(timebankUsers, timeEntries, slackUsers);

    // console.log("formattedTimebankData", formattedTimebankData[0]);

    SlackApiUtilities.postMessage(formattedTimebankData);

    console.log("In the weekly function");

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

export const main = middyfy(sendWeeklySlack);