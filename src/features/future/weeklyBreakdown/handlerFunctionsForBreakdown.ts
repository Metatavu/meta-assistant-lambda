import schema from "@functions/schema";
import { formatJSONResponse, ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { DateTime } from "luxon";
import SlackApiUtilities from "src/features/slackapi/slackapi-utils";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import { TimeEntry } from "src/generated/client/api";
import { combineWeeklyBreakdownData } from "./combineWeeklyBreakdownData";
import { postDailyMessage } from "./postBreakdownMessage";

/**
 * File not currently in use, could be used in future for implementing a weekly breakdown in response to user interaction
 * main function
 *
 * @param event
 * @returns JSON response
 */
const sendWeeklyBreakdownMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => {

  try{
    const timebankUsers = await TimeBankApiProvider.getTimebankUsers();
    const slackUsers = await SlackApiUtilities.getSlackUsers();

  // lastWeek and today could be modified to return a breakdown message for required time period
    const lastWeek = DateTime.now().minus({ days: 7 }).toISODate();
    const today = DateTime.now().toISODate();

    const timeEntries: TimeEntry[] = [];

    for (const person of timebankUsers) {
      timeEntries.push(...await TimeBankApiProvider.getTimeEntries(person.id, today, lastWeek));
    }

    const combinedWeeklyBreakdowndata = combineWeeklyBreakdownData(timebankUsers, timeEntries, slackUsers);
    postDailyMessage(combinedWeeklyBreakdowndata);

    return formatJSONResponse({
      message: `Everything went well ${event.body.name}...`,
      event,
    });
  } catch (error) {
    return formatJSONResponse({
      message: `Error while sending weekly breakdown slack message: ${error}`,
      event,
    });
  }
}