import { ValidatedAPIGatewayProxyEvent, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import TimeUtilities from "src/features/generic/time-utils";
import SlackApiUtilities from "src/features/slackapi/slackapi-utils";
import TimeBankApiProvider from "src/features/timebank/timebank-API-provider";
import TimeBankUtilities from "src/features/timebank/timebank-utils";
import schema, { WeeklyCombinedData } from "../schema";

/**
 * main function
 *
 * @param event
 * @returns JSON response
 */
const sendWeeklyMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => {

  try {
    const timebankUsers = await TimeBankApiProvider.getTimebankUsers();
    const slackUsers = await SlackApiUtilities.getSlackUsers();

    const timeEntries: WeeklyCombinedData[] = [];

    const dates = TimeUtilities.lastWeekDateProvider();

    for (const person of timebankUsers) {
      timeEntries.push(...await TimeBankApiProvider.getTotalTimeEntries("WEEK", person, dates.numberedYear, dates.numberedWeek));
    }

    const weeklyCombinedData = await TimeBankUtilities.combineWeeklyData(timeEntries, slackUsers);

    SlackApiUtilities.postWeeklyMessage(weeklyCombinedData, dates.weekStartString, dates.weekEndString);

    return formatJSONResponse({
      message: `Everything went well ${event.body.name}...`,
      event,
    });
  } catch (error) {
    return formatJSONResponse({
      message: `Error while sending slack message: ${error}`,
      event,
    });
  }
};

export const main = middyfy(sendWeeklyMessage);