import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, DailyHandlerResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";
import schema from "../schema";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import TimeBankUtilities from "src/features/timebank/timebank-utils";
import SlackApiUtilities from "src/features/slackapi/slackapi-utils";
import { DailyEntry } from "src/generated/client/api";
import ForecastApiUtilities from "src/features/forecastapi/forecast-api";
import TimeUtilities from "src/features/generic/time-utils";
import Auth from "src/features/auth/auth-provider";

/**
 * AWS-less handler for sendDailyMessage
 *
 * @returns Promise of DailyHandlerResponse
 */
export const sendDailyMessageHandler = async (): Promise<DailyHandlerResponse> => {
  try {
    const { accessToken } = await Auth.getAccessToken();
    const previousWorkDays = TimeUtilities.getPreviousTwoWorkdays();
    const { yesterday, dayBeforeYesterday } = previousWorkDays;

    const timebankUsers = await TimeBankApiProvider.getTimebankUsers(accessToken);
    const slackUsers = await SlackApiUtilities.getSlackUsers();
    const timeRegistrations = await ForecastApiUtilities.getTimeRegistrations(dayBeforeYesterday);
    const NonProjectTimes = await ForecastApiUtilities.getNonProjectTime();

    if (!timebankUsers) {
      throw new Error("No persons retrieved from Timebank")
    }

    const dailyEntries: DailyEntry[] = [];

    for (const timebankUser of timebankUsers) {
      let dailyEntry = await TimeBankApiProvider.getDailyEntries(timebankUser.id, yesterday, yesterday, accessToken)
      if (dailyEntry && !dailyEntry.isVacation) {
        dailyEntries.push(dailyEntry)
      }
    }
    
    const filteredTimebankUsers = timebankUsers.filter(person => dailyEntries.find(dailyEntry => dailyEntry.person === person.id))

    const dailyCombinedData = TimeBankUtilities.combineDailyData(filteredTimebankUsers, dailyEntries, slackUsers);
    const messagesSent = await SlackApiUtilities.postDailyMessageToUsers(dailyCombinedData, timeRegistrations, previousWorkDays, NonProjectTimes);
    
    const errors = messagesSent.filter(messageSent => messageSent.response.error);

    if (errors.length) {
      let errorMessage = "Error while posting slack messages, ";

      errors.forEach(error => {
        errorMessage += `${error.response.error}\n`;
      });
      console.error(errorMessage);
    }

    return {
      message: "Everything went well sending the daily, see data for message breakdown...",
      data: messagesSent
    };
  } catch (error) {
    console.error(error.toString());
    return {
      message: `Error while sending slack message: ${error}`
    };
  }
};

/**
 * Lambda function for sending slack message
 *
 * @param event API Gateway proxy event
 * @returns JSON response
 */
export const sendDailyMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => (
  formatJSONResponse({
    ...await sendDailyMessageHandler(),
    event: event
  })
);

export const main = middyfy(sendDailyMessage);