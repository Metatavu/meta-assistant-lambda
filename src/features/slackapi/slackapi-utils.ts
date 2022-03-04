import { FormattedTimebankData } from "@functions/sendslack/schema";
import { LogLevel, WebClient } from "@slack/web-api";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import dotenv from "dotenv";
import { DateTime, Duration } from "luxon";

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
  export const getSlackUserData = async (): Promise<Member[]> => {
    let userData: Member[] = [];

    /**
     * Put Slack Users from getUsersList into userData
     *
     * @param usersArray
     */
    const saveUsers = (usersArray: Member[]) => {
      userData = usersArray.map((user) => {
        return { name: user.real_name, id: user.id };
      });
    };

    /**
     * Request list of Slack Users
     */
    const getUsersList = async () => {
      try {
        const result = await client.users.list();
        saveUsers(result.members);
      } catch (error) {
        console.error("Error while loading slack users list");
        Promise.reject(error);
      }
    };
    await getUsersList();
    return userData;
  };

    /**
   * Converts minutes into hours and minutes
   *
   * @param duration in minutes from timebank Data
   * @returns string of timebank data converted to hours and minutes
   */
  const timeConversion = (duration: number): string => {
    const dur = Duration.fromObject({ minutes: duration });
    const time = dur.shiftTo("hours", "minutes");
    return `${time.hours}h ${time.minutes} minutes`;
  };

  /**
   * Create message based on specific users timebank data
   *
   * @param formattedTimebankData list of relevant timebank data
   * @param id of timebank user
   * @returns string message if id match
   */
  const customMessage = (formattedTimebankData: FormattedTimebankData[], id: number) => {
    let message: string = "";
    for (let each of formattedTimebankData) {
      if (each.id === id) {
        message = `Hi ${each.name}, yesterday (${DateTime.fromISO(
          each.date
        ).toFormat("dd-MM-yyyy")}) you worked ${timeConversion(each.logged)} 
              with an expected time of ${timeConversion(
                each.expected
              )}. Have a great rest of the day!\n`;
        return message;
      }
    }
    return "Something went wrong with your data today, please contact support";
  };
  
  /**
   * Post custom timebank data to matching slack user channel
   */
  export const postMessage = async (formattedTimebankData: FormattedTimebankData[], userData: Member[]) => {
    await userData.forEach((slackUser) => {
      formattedTimebankData.forEach((timebankUser) => {
        if (slackUser.name === timebankUser.name) {
          try {
            client.chat.postMessage({
              channel: slackUser.id,
              text: customMessage(formattedTimebankData, timebankUser.id)
            });
          }
          catch (error) {
            console.error("Error while posting slack messages");
            Promise.reject(error);
          }
        }
      });
    });
  };
};

export default SlackApiUtilities;