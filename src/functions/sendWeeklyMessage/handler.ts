import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, WeeklyHandlerResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";
import ForecastApiUtilities from "src/features/forecastapi/forecast-api";
import TimeUtilities from "src/features/generic/time-utils";
import SlackApiUtilities from "src/features/slackapi/slackapi-utils";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import TimeBankUtilities from "src/features/timebank/timebank-utils";
import schema, { TimePeriod, WeeklyCombinedData } from "../schema";

/**
 * AWS-less handler for sendWeeklyMessage
 * 
 * @returns Promise of WeeklyHandlerResponse
 */
export async function sendWeeklyMessageHandler(): Promise<WeeklyHandlerResponse> {
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

    const messagesSent = await SlackApiUtilities.postWeeklyMessage(weeklyCombinedData, timeRegistrations, previousWorkDays, NonProjectTimes);

    return {
      message: "Everything went well sending the weekly, see data for message breakdown...",
      data: messagesSent
    };
  } catch (error) {

    return {
      message: `Error while sending slack message: ${error}`
    };
  }
}

/**
 * Lambda for sending weekly messages
 *
 * @param event API Gateway proxy event
 * @returns JSON response
 */
export const sendWeeklyMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => {
  let res: WeeklyHandlerResponse = await sendWeeklyMessageHandler();

  res.event = event;

  return formatJSONResponse(res);
};

export const main = middyfy(sendWeeklyMessage);