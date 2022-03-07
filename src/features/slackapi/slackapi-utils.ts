import { FormattedTimebankData, WeeklyFormattedTimebankData } from "@functions/sendslack/schema";
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
   * Create weekly message based on specific users timebank data
   *
   * @param filteredTimebankData list of relevant timebank data
   * @returns string message if id match
   */
   const constructWeeklyMessage = (filteredTimebankData: WeeklyFormattedTimebankData) => {
    const { name, logged, expected, date } = filteredTimebankData.totals;

    return `Hi ${name}, last week (${DateTime.fromISO(date).minus({days: 7}).toFormat('dd-MM-yyyy')} - ${DateTime.fromISO(date).toFormat("dd-MM-yyyy")}) you worked ${TimeUtilities.timeConversion(logged)} with an expected time of ${TimeUtilities.timeConversion(expected)}. Have great week!`;
  };
 
  /**
   * Create weekly summary message based on specific users timebank data
   *
   * @param filteredTimebankData list of relevant timebank data
   * @returns string message if id match
   */
   const constructWeeklySummaryMessage = (filteredTimebankData: WeeklyFormattedTimebankData) => {
    const { name, date } = filteredTimebankData.totals;

    const startMessage = `Hi ${name}, here are your times for last week (${DateTime.fromISO(date).minus({days: 7}).toFormat('dd-MM-yyyy')} - ${DateTime.fromISO(date).toFormat("dd-MM-yyyy")}). Have great week!\n`;
    
    let listMessage = "";

    filteredTimebankData.multiplePersonTimeEntries.forEach(day => {
      console.log("multipersontimes", day);
      const displayDate = DateTime.fromISO(day.date).toFormat("dd-MM-yyyy");
      const { logged, expected } = day;

      listMessage += `On (${displayDate}) you worked ${TimeUtilities.timeConversion(logged)} with an expected time of ${TimeUtilities.timeConversion(expected)}.\n`
    })

    return startMessage + listMessage;
  };

  /**
   * Post a slack message to users
   *
   * @param slackUsers list of slack users
   * @param formattedTimebankData list of formatted timebank data
   */
  export const postMessage = (formattedTimebankData: FormattedTimebankData[] | WeeklyFormattedTimebankData[]) => {

    formattedTimebankData.forEach(user => {
      if (user.weekly) {
        try {
         
          console.log(constructWeeklyMessage(user));
          console.log(constructWeeklySummaryMessage(user));
            // client.chat.postMessage({
            // channel: slackUser.id,
            // text: constructSingleDayMessage(timeBankData[0])
          // });
          }
        catch (error) {
            console.error(`Error while posting weekly slack messages to user ${user.totals.name}`);
        }
      }
      else {
        try {
          console.log(constructSingleDayMessage(user));
            // client.chat.postMessage({
            // channel: slackUser.id,
            // text: constructSingleDayMessage(timeBankData[0])
          // });
        }
        catch (error) {
            console.error(`Error while posting slack messages to user ${user.name}`);
        }
      }
    });
  };
};

export default SlackApiUtilities;