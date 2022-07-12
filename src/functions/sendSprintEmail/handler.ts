import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, DailyHandlerResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";
import schema, { MailData, WeeklyCombinedData } from "../schema";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import TimeBankUtilities from "src/features/timebank/timebank-utils";
import { Timespan } from "src/generated/client/api";
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

    const mailData: MailData = {
      sprintStartWeek: sprintStart.weekNumber,
      sprintEndWeek: sprintEnd.weekNumber,
      sprintYear: sprintEnd.year,
      name: "",
      percentage: 50,
      recipients: ["", ""]
    }

    const emails = await Mailer.sendMail(mailData);

    const errors = [];

    if (errors.length) {
      let errorMessage = "Error while sending emails, ";

      errors.forEach(error => {
        errorMessage += `${error.response.error}\n`;
      });
      console.error(errorMessage);
    }

    return {
      message: "Everything went well sending the emails, see data for sent messages breakdown...",
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
 * Lambda function for sending email messages
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