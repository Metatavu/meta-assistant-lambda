import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, DailyHandlerResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";
import schema from "../schema";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import TimeBankUtilities from "src/features/timebank/timebank-utils";
import SlackApiUtilities from "src/features/slackapi/slackapi-utils";
import { TimeEntry } from "src/generated/client/api";
import ForecastApiUtilities from "src/features/forecastapi/forecast-api";
import TimeUtilities from "src/features/generic/time-utils";

/**
 * AWS-less handler for sendDailyMessage
 *
 * @returns Promise of DailyHandlerResponse
 */
export async function sendDailyMessageHandler(): Promise<DailyHandlerResponse> {
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

    return {
      message: "Everything went well sending the daily, see data for message breakdown...",
      data: messagesSent
    };
  } catch (error) {
    console.error(error);
    return {
      message: `Error while sending slack message: ${error}`
    };
  }
}

/**
 * Lambda function for sending slack message
 *
 * @param event API Gateway proxy event
 * @returns JSON response
 */
export const sendDailyMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => {
  let res: DailyHandlerResponse = await sendDailyMessageHandler();

  res.event = event;

  return formatJSONResponse(res);
};

export const main = middyfy(sendDailyMessage);