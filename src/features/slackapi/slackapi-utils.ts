import { DailyCombinedData, WeeklyCombinedData } from "@functions/schema";
import { LogLevel, WebClient } from "@slack/web-api";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { DateTime } from "luxon";
import TimeUtilities from "../generic/time-utils";

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
   * @param user timebank data
   * @returns string message if id match
   */
  const constructDailyMessage = (user: DailyCombinedData) => {
    const { name, logged, expected, date, project, internal, difference } = user;

    const displayDate = DateTime.fromISO(date).toFormat("dd-MM-yyyy");
    const displayLogged = TimeUtilities.timeConversion(logged);
    const displayExpected = TimeUtilities.timeConversion(expected);
    const displayDifference = TimeUtilities.timeConversion(difference);
    const displayProject = TimeUtilities.timeConversion(project);
    const displayInternal = TimeUtilities.timeConversion(internal);

    return `Hi ${name},
      yesterday (${displayDate}) you worked ${displayLogged} with an expected time of ${displayExpected}.
      Difference: ${displayDifference}.
      Project time: ${displayProject}, Internal time: ${displayInternal}.
      Have a great rest of the day!`;
  };

  /**
   * Create weekly message from users timebank data
   *
   * @param user timebank data
   * @param weekStart date for data
   * @param weekEnd date for data
   * @returns message
   */
  const constructWeeklySummaryMessage = (user: WeeklyCombinedData, weekStart: string, weekEnd: string) => {
    const { name } = user;
    const { logged, expected, projectTime, internalTime, total, id: { week } } = user.selectedWeek;
    const startDate = DateTime.fromISO(weekStart).toFormat('dd-MM-yyyy');
    const endDate = DateTime.fromISO(weekEnd).toFormat("dd-MM-yyyy");
    const displayLogged = TimeUtilities.timeConversion(logged);
    const displayExpected = TimeUtilities.timeConversion(expected);
    const displayDifference = TimeUtilities.timeConversion(total);
    const displayProject = TimeUtilities.timeConversion(projectTime);
    const displayInternal = TimeUtilities.timeConversion(internalTime);

    return `Hi ${name},
      Last week (week: ${ week }, ${startDate} - ${endDate}) you worked ${displayLogged} with an expected time of ${displayExpected}.
      Difference: ${displayDifference}.
      Project time: ${displayProject}, Internal time: ${displayInternal}.
      Have great week!`;
  };

  /**
   * Post a daily slack message to users
   *
   * @param dailyCombinedData list of combined timebank and slack user data
   */
  export const postDailyMessage = (dailyCombinedData: DailyCombinedData[]) => {
    dailyCombinedData.forEach(user => {
      const { slackId } = user;

        try {
        client.chat.postMessage({
          channel: slackId,
          text: constructDailyMessage(user)
        });
      } catch (error) {
        console.error(`Error while posting slack messages to user ${user.name}`);
      }
    });
  };

  /**
   * Post a slack message to users
   *
   * @param weeklyCombinedData list of combined timebank and slack user data
   * @param weekStart when time data starts
   * @param weekEnd when time data ends
   */
  export const postWeeklyMessage = (weeklyCombinedData: WeeklyCombinedData[], weekStart: string, weekEnd: string) => {
    weeklyCombinedData.forEach(user => {
      const { slackId } = user;

        try {
          console.log(constructWeeklySummaryMessage(user, weekStart, weekEnd));
            // client.chat.postMessage({
            // channel: slackId,
            // text: constructWeeklySummaryMessage(user)
          // });
          }
        catch (error) {
            console.error(`Error while posting weekly slack messages to user ${user.name}`);
        }
    });
  };
};

export default SlackApiUtilities;