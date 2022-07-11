import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, DailyHandlerResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";
import schema, { WeeklyCombinedData } from "../schema";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import TimeBankUtilities from "src/features/timebank/timebank-utils";
import SlackApiUtilities from "src/features/slackapi/slackapi-utils";
import { Timespan } from "src/generated/client/api";
import ForecastApiUtilities from "src/features/forecastapi/forecast-api";
import TimeUtilities from "src/features/generic/time-utils";
import Auth from "src/features/auth/auth-provider";
import { DateTime } from "luxon";
import Mailer from "src/features/mailer";

/**
 * AWS-less handler for sendDailyMessage
 *
 * @returns Promise of DailyHandlerResponse
 */
export const sendSprintEmailHandler = async (): Promise<any> => {
  try {
    const { accessToken } = await Auth.getAccessToken();
    const lastSprintDates = TimeUtilities.getLastSprint();
    const sprintStart = DateTime.fromISO(lastSprintDates.sprintStart);
    const sprintEnd = DateTime.fromISO(lastSprintDates.sprintEnd);

    let timebankUsers = await TimeBankApiProvider.getTimebankUsers(accessToken);

    if (!timebankUsers) {
      throw new Error("No persons retrieved from Timebank")
    }

    const weeklyCombinedDatas: WeeklyCombinedData[] = [];

    for (const timebankUser of timebankUsers) {
      let firstWeek = await TimeBankApiProvider.getPersonTotalEntries(
        Timespan.WEEK, timebankUser, sprintStart.year, sprintStart.month, sprintStart.weekNumber, accessToken
      );
      let secondWeek = await TimeBankApiProvider.getPersonTotalEntries(
        Timespan.WEEK, timebankUser, sprintEnd.year, sprintEnd.month, sprintEnd.weekNumber, accessToken
      );
      if (firstWeek && secondWeek) {
        weeklyCombinedDatas.push(firstWeek, secondWeek);
      }
    }

    timebankUsers = timebankUsers.filter(person => Boolean(weeklyCombinedDatas.find(weeklyCombinedData => weeklyCombinedData.personId === person.id)));

    const emails = Mailer.sendMail({ recipient: ["", ""], subject: "Testing testing!", text: "Testing Mailgun!" });

    const errors = [];

    if (errors.length) {
      let errorMessage = "Error while posting slack messages, ";

      errors.forEach(error => {
        errorMessage += `${error.response.error}\n`;
      });
      console.error(errorMessage);
    }

    return {
      message: "Everything went well sending the daily, see data for message breakdown...",
      data: emails
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
export const sendSprintEmail: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => (
  formatJSONResponse({
    ...await sendSprintEmailHandler(),
    event: event
  })
);

export const main = middyfy(sendSprintEmail);