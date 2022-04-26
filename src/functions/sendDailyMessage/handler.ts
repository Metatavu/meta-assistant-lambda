import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";

import schema from "../schema";
import TimeBankApiProvider from "../../features/timebank/timebank-API-provider";
import TimeBankUtilities from "../../features/timebank/timebank-utils";
import SlackApiUtilities from "../../features/slackapi/slackapi-utils";
import { TimeEntry } from "../../generated/client/api";
import ForecastApiUtilities from "../../features/forecastapi/forecast-api";
import TimeUtilities from "../../features/generic/time-utils";

/**
 * Lambda function for sending slack message
 *
 * @param event API Gateway proxy event
 * @returns JSON response
 */
export const sendDailyMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => {
  try {
    const previousWorkDays = TimeUtilities.getPreviousTwoWorkdays();
    const { yesterday, dayBeforeYesterday } = previousWorkDays;

    const timebankUsers = await TimeBankApiProvider.getTimebankUsers();
    const slackUsers = await SlackApiUtilities.getSlackUsers();
    const timeRegistrations = await ForecastApiUtilities.getTimeRegistrations(dayBeforeYesterday);
    const NonProjectTimes = await ForecastApiUtilities.getNonProjectTime();

    const timeEntries: TimeEntry[] = [];

    for (const person of timebankUsers) {
      timeEntries.push(...await TimeBankApiProvider.getTimeEntries(person.id, yesterday, yesterday));
    }

    const dailyCombinedData = TimeBankUtilities.combineDailyData(timebankUsers, timeEntries, slackUsers);
    const messagesSent = await SlackApiUtilities.postDailyMessage(dailyCombinedData, timeRegistrations, previousWorkDays, NonProjectTimes);

    return formatJSONResponse({
      message: "Everything went well, see data for message breakdown...",
      data: messagesSent,
      event: event
    });
  } catch (error) {
    return formatJSONResponse({
      message: `Error while sending slack message: ${error}`,
      event: event
    });
  }
};

export const main = middyfy(sendDailyMessage);