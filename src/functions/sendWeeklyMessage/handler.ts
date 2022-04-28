import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";
import ForecastApiUtilities from "src/features/forecastapi/forecast-api";
import TimeUtilities from "src/features/generic/time-utils";
import SlackApiUtilities from "src/features/slackapi/slackapi-utils";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import TimeBankUtilities from "src/features/timebank/timebank-utils";
import schema, { TimePeriod, WeeklyCombinedData } from "../schema";

/**
 * Lambda for sending weekly messages
 *
 * @param event API Gateway proxy event
 * @returns JSON response
 */
export const sendWeeklyMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => {
  try {
    const previousWorkDays = TimeUtilities.getPreviousTwoWorkdays();
    const { dayBeforeYesterday } = previousWorkDays;

    const timebankUsers = await TimeBankApiProvider.getTimebankUsers();
    const slackUsers = await SlackApiUtilities.getSlackUsers();
    const timeRegistrations = await ForecastApiUtilities.getTimeRegistrations(dayBeforeYesterday);
    const NonProjectTimes = await ForecastApiUtilities.getNonProjectTime();

    const { weekStartDate, weekEndDate } = TimeUtilities.lastWeekDateProvider();
    const timeEntries: WeeklyCombinedData[] = [];

    for (const person of timebankUsers) {
      timeEntries.push(await TimeBankApiProvider.getTotalTimeEntries(TimePeriod.WEEK, person, weekStartDate.year, weekEndDate.weekNumber));
    }

    const weeklyCombinedData = TimeBankUtilities.combineWeeklyData(timeEntries, slackUsers);

    const messagesSent = SlackApiUtilities.postWeeklyMessage(weeklyCombinedData, timeRegistrations, previousWorkDays, NonProjectTimes);

    return formatJSONResponse({
      message: "Everything went well sending the weekly, see data for message breakdown...",
      data: messagesSent.map(messagesSent => messagesSent.name),
      event: event
    });
  } catch (error) {
    return formatJSONResponse({
      message: `Error while sending slack message: ${error}`,
      event: event
    });
  }
};

export const main = middyfy(sendWeeklyMessage);