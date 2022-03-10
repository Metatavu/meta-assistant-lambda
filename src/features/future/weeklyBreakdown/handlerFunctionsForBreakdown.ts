import schema from "@functions/schema";
import { formatJSONResponse, ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import TimeUtilities from "src/features/generic/time-utils";
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

    // selected week (currently for previous week) could be modified to return a breakdown message by day for required time period
    const { weekStartDate, weekEndDate } = TimeUtilities.lastWeekDateProvider();

    const timeEntries: TimeEntry[] = [];

    for (const person of timebankUsers) {
      timeEntries.push(...await TimeBankApiProvider.getTimeEntries(person.id, weekEndDate.toISODate(), weekStartDate.toISODate()));
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