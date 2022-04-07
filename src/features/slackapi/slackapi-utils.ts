import { DailyCombinedData, WeeklyCombinedData, TimeRegistrations, PreviousWorkdayDates, NonProjectTime } from "@functions/schema";
import { LogLevel, WebClient } from "@slack/web-api";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { DateTime } from "luxon";
import TimeUtilities from "../generic/time-utils";

/**
 * Namespace for Slack API utilities
 */
namespace SlackApiUtilities {

  export const client = new WebClient(process.env.metatavu_bot_token, {
    logLevel: LogLevel.DEBUG
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
   * @param numberOfToday Todays number
   * @returns string message if id match
   */
  const constructDailyMessage = (user: DailyCombinedData, numberOfToday: number) => {
    const { name, date } = user;

    const displayDate = DateTime.fromISO(date).toFormat("dd-MM-yyyy");

    const {
      displayLogged,
      displayExpected,
      displayInternal,
      displayProject
    } = TimeUtilities.handleTimeConversion(user);

    const {
      message,
      billableHoursPercentage
    } = TimeUtilities.calculateWorkedTimeAndBillableHours(user);

    return `     
Hi ${name},
${numberOfToday === 1 ? "Last friday" :"Yesterday"} (${displayDate}) you worked ${displayLogged} with an expected time of ${displayExpected}.
${message}
Project time: ${displayProject}, Internal time: ${displayInternal}.
Your percentage of billable hours was: ${billableHoursPercentage}% ${+billableHoursPercentage >= 75 ? ":+1:" : ":-1:"}
Have a great rest of the day!
    `;
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
    const { name, selectedWeek: { id: { week } } } = user;

    const startDate = DateTime.fromISO(weekStart).toFormat("dd-MM-yyyy");
    const endDate = DateTime.fromISO(weekEnd).toFormat("dd-MM-yyyy");

    const {
      displayLogged,
      displayExpected,
      displayInternal,
      displayProject
    } = TimeUtilities.handleTimeConversion(user.selectedWeek);

    const {
      message,
      billableHoursPercentage
    } = TimeUtilities.calculateWorkedTimeAndBillableHours(user.selectedWeek);

    return `
Hi ${name},
Last week (week: ${ week }, ${startDate} - ${endDate}) you worked ${displayLogged} with an expected time of ${displayExpected}.
${message}
Project time: ${displayProject}, Internal time: ${displayInternal}.
Your percentage of billable hours was: ${billableHoursPercentage}%
You ${+billableHoursPercentage >= 75 ? "worked the target 75% billable hours last week:+1:" : "did not work the target 75% billable hours last week:-1:"}.
Have a great week!
    `;
  };

  /**
   * Post a daily slack message to users
   *
   * @param dailyCombinedData list of combined timebank and slack user data
   * @param timeRegistrations all time registrations after yesterday
   * @param previousWorkDays dates and the number of today
   */
  export const postDailyMessage = (
    dailyCombinedData: DailyCombinedData[],
    timeRegistrations: TimeRegistrations[],
    previousWorkDays: PreviousWorkdayDates,
    NonProjectTimes: NonProjectTime[]) => {
    const { numberOfToday, yesterday, today } = previousWorkDays;

    dailyCombinedData.forEach(user => {
      const { slackId, personId, expected } = user;

      const isAway = TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(timeRegistrations, personId, expected, today, NonProjectTimes);
      const firstDayBack= TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(timeRegistrations, personId, expected, yesterday, NonProjectTimes);

      if (isAway === undefined && firstDayBack === undefined) {
        try {
          client.chat.postMessage({
            channel: slackId,
            text: constructDailyMessage(user, numberOfToday)
          });
        } catch (error) {
          console.error(`Error while posting slack messages to user ${user.name}`);
        }
      }
    });
  };

  /**
   * Post a slack message to users
   *
   * @param weeklyCombinedData list of combined timebank and slack user data
   * @param NonProjectTimes all non project times
   * @param timeRegistrations all time registrations after yesterday
   * @param previousWorkDays dates and the number of today
   */
  export const postWeeklyMessage = (weeklyCombinedData: WeeklyCombinedData[],
    timeRegistrations:TimeRegistrations[],
    previousWorkDays: PreviousWorkdayDates,
    NonProjectTimes: NonProjectTime[]) => {
    const { weekStartDate, weekEndDate } = TimeUtilities.lastWeekDateProvider();

    weeklyCombinedData.forEach(user => {
      const { slackId, personId } = user;
      const { yesterday, today } = previousWorkDays;

      const isAway = TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(timeRegistrations, personId, 435, today, NonProjectTimes);
      const firstDayBack= TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(timeRegistrations, personId, 435, yesterday, NonProjectTimes);

      if (isAway === undefined && firstDayBack === undefined) {
        try {
          client.chat.postMessage({
            channel: slackId,
            text: constructWeeklySummaryMessage(user, weekStartDate.toISODate(), weekEndDate.toISODate())
          });
        } catch (error) {
          console.error(`Error while posting slack messages to user ${user.name}`);
        }
      }
    });
  };
}

export default SlackApiUtilities;