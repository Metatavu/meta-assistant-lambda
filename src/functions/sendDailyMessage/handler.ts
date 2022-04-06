import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "../schema";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import TimeBankUtilities from "src/features/timebank/timebank-utils";
import SlackApiUtilities from "src/features/slackapi/slackapi-utils";
import { TimeEntry } from "src/generated/client/api";
import ForecastApiUtilities from "src/features/forecastapi/forecast-api";
import TimeUtilities from "src/features/generic/time-utils";

/**
 * Lambda function for sending slack message
 *
 * @param event API Gateway proxy event
 * @returns JSON response
 */
const sendDailyMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => {
  try {
    const yesterdaysAndTodaysDates = TimeUtilities.yesterdayAndDayBeforeYesterdayDateProvider();
    const { yesterday, dayBeforeYesterday } = yesterdaysAndTodaysDates;

    const timebankUsers = await TimeBankApiProvider.getTimebankUsers();
    const slackUsers = await SlackApiUtilities.getSlackUsers();
    const timeRegistrations = await ForecastApiUtilities.getTimeRegistrations(dayBeforeYesterday);

    const timeEntries: TimeEntry[] = [];

    for (const person of timebankUsers) {
      timeEntries.push(...await TimeBankApiProvider.getTimeEntries(person.id, yesterday, yesterday));
    }

    const dailyCombinedData = TimeBankUtilities.combineDailyData(timebankUsers, timeEntries, slackUsers);
    SlackApiUtilities.postDailyMessage(dailyCombinedData, timeRegistrations, yesterdaysAndTodaysDates);

    return formatJSONResponse({
      message: `Everything went well ${event.body.name}...`,
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