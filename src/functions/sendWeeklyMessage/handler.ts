import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
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
const sendWeeklyMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => {
  try {
    const { yesterday, dayBeforeYesterday }  = TimeUtilities.yesterdayAndDayBeforeYesterdayDateProvider();

    const timebankUsers = await TimeBankApiProvider.getTimebankUsers();
    const slackUsers = await SlackApiUtilities.getSlackUsers();
    const timeRegistrations = await ForecastApiUtilities.getTimeRegistrations(dayBeforeYesterday);

    const { weekStartDate, weekEndDate } = TimeUtilities.lastWeekDateProvider();
    const timeEntries: WeeklyCombinedData[] = [];

    for (const person of timebankUsers) {
      timeEntries.push(await TimeBankApiProvider.getTotalTimeEntries(TimePeriod.WEEK, person, weekStartDate.year, weekEndDate.weekNumber));
    }

    const weeklyCombinedData = TimeBankUtilities.combineWeeklyData(timeEntries, slackUsers);

    SlackApiUtilities.postWeeklyMessage(weeklyCombinedData, weekStartDate.toISODate(), weekEndDate.toISODate(), timeRegistrations, yesterday);

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

export const main = middyfy(sendWeeklyMessage);