import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, DailyHandlerResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";
import schema, { WeeklyCombinedData } from "../schema";
import TimeBankApiProvider from "src/features/timebank/timebank-api";
import TimeBankUtilities from "src/features/timebank/timebank-utils";
import { Timespan } from "src/generated/client/api";
import TimeUtilities from "src/features/generic/time-utils";
import Auth from "src/features/auth/auth-provider";
import { DateTime } from "luxon";
import Mailer from "src/features/mailer/mailer";

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

    const timebankUsers = await TimeBankApiProvider.getTimebankUsers(accessToken);

    if (!timebankUsers) {
      throw new Error("No persons retrieved from Timebank");
    }

    const weeklyCombinedDatas: WeeklyCombinedData[] = [];

    for (const timebankUser of timebankUsers) {
      let secondWeek = await TimeBankApiProvider.getPersonTotalEntries(
        Timespan.WEEK, timebankUser, sprintEnd.year, sprintEnd.month, sprintEnd.weekNumber, accessToken
      );
      let firstWeek = await TimeBankApiProvider.getPersonTotalEntries(
        Timespan.WEEK, timebankUser, sprintStart.year, sprintStart.month, sprintStart.weekNumber, accessToken
      );
      if (firstWeek && secondWeek) {
        weeklyCombinedDatas.push(firstWeek, secondWeek);
      }
    }
    const filteredTimebankUsers = timebankUsers.filter(person => weeklyCombinedDatas.find(weeklyCombinedData => weeklyCombinedData.personId === person.id));

    const emails = filteredTimebankUsers.map(person => {
      let email = TimeBankUtilities.combineSprintData(weeklyCombinedDatas.filter(weeklyCombinedData => weeklyCombinedData.personId == person.id));

      if (email.mailData.percentage < person.minimumBillableRate) {
        return email;
      }
    });

    const sentEmails = await Promise.all(emails.map(async email => {
      return await Mailer.sendMail(email);
    }));

    const errors = sentEmails.filter(sentEmail => sentEmail.includes("Failed"));

    if (errors.length) {
      let errorMessage = "Error while sending emails,\n";

      errors.forEach(error => {
        errorMessage += `${error}\n`;
      });
      console.error(errorMessage);
    }

    return {
      message: "Everything went well sending the emails, see data for sent emails breakdown...",
      data: sentEmails
    };
  } catch (error) {
    console.error(error.toString());
    return {
      message: `Error while sending emails: ${error}`
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