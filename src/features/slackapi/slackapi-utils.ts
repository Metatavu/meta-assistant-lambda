import { FormattedTimebankData } from "@functions/sendslack/schema";
import { LogLevel, WebClient } from "@slack/web-api";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import dotenv from "dotenv";
import { DateTime } from "luxon";
import TimeUtilities from "../generic/time-utils";

dotenv.config({ path: __dirname + "/../../../../../.env" });

/**
 * Namespace for Slack API utilities
 */
namespace SlackApiUtilities {

  const client = new WebClient(process.env.metatavu_bot_token, {
    logLevel: LogLevel.DEBUG,
  });

  /**
   * Get list of slack users
   *
   * @returns Promise of slack user data
   */
  export const getSlackUsers = async (): Promise<Member[]> => {
    try {
      const result = await client.users.list();
      return result.members;
    } catch (error) {
      console.error("Error while loading slack users list");
      Promise.reject(error);
    }
  };

  /**
   * Create message based on specific users timebank data
   *
   * @param filteredTimebankData list of relevant timebank data
   * @returns string message if id match
   */
  const constructSingleDayMessage = (filteredTimebankData: FormattedTimebankData) => {
    const { name, logged, expected, date } = filteredTimebankData;
    const displayDate = DateTime.fromISO(date).toFormat("dd-MM-yyyy");

    return `Hi ${name}, yesterday (${displayDate}) you worked ${TimeUtilities.timeConversion(logged)} with an expected time of ${TimeUtilities.timeConversion(expected)}. Have a great rest of the day!`;
  };


  /**
   * Post a slack message to users
   *
   * @param slackUsers list of slack users
   * @param formattedTimebankData list of formatted timebank data
   */
  export const postMessage = (slackUsers: Member[], formattedTimebankData: FormattedTimebankData[]) => {
    slackUsers.forEach(slackUser => {
      const timeBankData = formattedTimebankData.filter(data => data.slackId === slackUser?.id);

      if (timeBankData?.length === 1) {
        console.log(constructSingleDayMessage(timeBankData[0]));
        // try {
        //   client.chat.postMessage({
        //     channel: slackUser.id,
        //     text: constructSingleDayMessage(timeBankData[0])
        //   });
        // }
        // catch (error) {
        //   console.error(`Error while posting slack messages to user ${slackUser.real_name}`);
        // }
      }
    });
  };
};

export default SlackApiUtilities;