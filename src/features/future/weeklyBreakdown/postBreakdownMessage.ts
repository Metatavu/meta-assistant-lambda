import { WeeklyBreakdownCombinedData } from "@functions/schema";
import SlackApiUtilities from "src/features/slackapi/slackapi-utils";
import { constructWeeklyBreakdownMessage } from "./weeklybreakdownmessage";

/**
 * File not currently in use, could be used in future for implementing a weekly breakdown in response to user interaction
 * Post a weekly breakdown slack message to users
 *
 * @param dailyCombinedData list of combined timebank and slack user data
 */
export const postDailyMessage = (weeklyBreakdownCombinedData: WeeklyBreakdownCombinedData[]) => {
  weeklyBreakdownCombinedData.forEach(user => {
    const { slackId } = user.totals;

    const client = SlackApiUtilities.client;

    try {
        client.chat.postMessage({
        channel: slackId,
        text: constructWeeklyBreakdownMessage(user)
      });
    } catch (error) {
      console.error(`Error while posting slack messages to user ${user.totals.name}`);
    }
  });
};