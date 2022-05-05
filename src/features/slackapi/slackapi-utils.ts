import { DailyCombinedData, WeeklyCombinedData, TimeRegistrations, PreviousWorkdayDates, NonProjectTime, DailyMessageData, WeeklyMessageData } from "@functions/schema";
import { ChatPostMessageResponse, LogLevel, WebClient } from "@slack/web-api";
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
    const result = await client.users.list();

    if (result.members) return result.members;

    throw new Error(`Error while loading slack users list, ${result.error}`);
  };

  /**
   * Create message based on specific users timebank data
   *
   * @param user timebank data
   * @param numberOfToday Todays number
   * @returns string message if id match
   */
  const constructDailyMessage = (user: DailyCombinedData, numberOfToday: number): DailyMessageData => {
    const { name, date, firstName } = user;

    const displayDate = DateTime.fromISO(date).toFormat("dd.MM.yyyy");

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

    const customMessage = `
Hi ${firstName},
${numberOfToday === 1 ? "Last friday" :"Yesterday"} (${displayDate}) you worked ${displayLogged} with an expected time of ${displayExpected}.
${message}
Project time: ${displayProject}, Internal time: ${displayInternal}.
Your percentage of billable hours was: ${billableHoursPercentage}% ${+billableHoursPercentage >= 75 ? ":+1:" : ":-1:"}
Have a great rest of the day!
    `;
    return {
      message: customMessage,
      name: name,
      displayDate: displayDate,
      displayLogged: displayLogged,
      displayExpected: displayExpected,
      displayProject: displayProject,
      displayInternal: displayInternal,
      billableHoursPercentage: billableHoursPercentage
    };
  };

  /**
   * Create weekly message from users timebank data
   *
   * @param user timebank data
   * @param weekStart date for data
   * @param weekEnd date for data
   * @returns message
   */
  const constructWeeklySummaryMessage = (user: WeeklyCombinedData, weekStart: string, weekEnd: string): WeeklyMessageData => {
    const { name, selectedWeek: { id: { week } }, firstName } = user;

    const startDate = DateTime.fromISO(weekStart).toFormat("dd.MM.yyyy");
    const endDate = DateTime.fromISO(weekEnd).toFormat("dd.MM.yyyy");

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

    const customMessage = `
Hi ${firstName},
Last week (week: ${ week }, ${startDate} - ${endDate}) you worked ${displayLogged} with an expected time of ${displayExpected}.
${message}
Project time: ${displayProject}, Internal time: ${displayInternal}.
Your percentage of billable hours was: ${billableHoursPercentage}%
You ${+billableHoursPercentage >= 75 ? "worked the target 75% billable hours last week:+1:" : "did not work the target 75% billable hours last week:-1:"}.
Have a great week!
    `;
    return {
      message: customMessage,
      name: name,
      week: week,
      startDate: startDate,
      endDate: endDate,
      displayLogged: displayLogged,
      displayExpected: displayExpected,
      displayProject: displayProject,
      displayInternal: displayInternal,
      billableHoursPercentage: billableHoursPercentage
    };
  };

  /**
   * Sends given message to given slack channel
   *
   * @param channelId channel ID
   * @param message message to be send
   * @returns Promise of ChatPostMessageResponse
   */
  const sendMessage = (channelId: string, message: string): Promise<ChatPostMessageResponse> => (
    client.chat.postMessage({
      channel: channelId,
      text: message
    })
  );

  /**
   * Post a daily slack message to users
   *
   * @param dailyCombinedData list of combined timebank and slack user data
   * @param timeRegistrations all time registrations after yesterday
   * @param previousWorkDays dates and the number of today
   * @param nonProjectTimes all non project times
   */
  export const postDailyMessage = async (
    dailyCombinedData: DailyCombinedData[],
    timeRegistrations: TimeRegistrations[],
    previousWorkDays: PreviousWorkdayDates,
    nonProjectTimes: NonProjectTime[]
  ): Promise<DailyMessageData[]> => {
    const { numberOfToday, yesterday, today } = previousWorkDays;

    let messagesRecord: DailyMessageData[] = [];

    const promises: Promise<ChatPostMessageResponse>[] = dailyCombinedData.map(user => {
      const { slackId, personId, expected } = user;

      const isAway = TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(timeRegistrations, personId, expected, today, nonProjectTimes);
      const firstDayBack= TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(timeRegistrations, personId, expected, yesterday, nonProjectTimes);

      const message = constructDailyMessage(user, numberOfToday);

      if (!isAway && !firstDayBack && expected !== 0) {
        messagesRecord.push(message);
        return sendMessage(slackId, message.message);
      }
    }).filter(p => p);

    const responses: ChatPostMessageResponse[] = await Promise.all(promises);
    const errors = responses.filter(response => response.error);

    if (errors.length) {
      let errorMessage = "Error while posting slack messages, ";

      errors.forEach(e => {
        errorMessage += `${e.error}\n`;
      });

      throw new Error(errorMessage);
    }

    return messagesRecord;
  };

  /**
   * Post a slack message to users
   *
   * @param weeklyCombinedData list of combined timebank and slack user data
   * @param nonProjectTimes all non project times
   * @param timeRegistrations all time registrations after yesterday
   * @param previousWorkDays dates and the number of today
   */
  export const postWeeklyMessage = async (
    weeklyCombinedData: WeeklyCombinedData[],
    timeRegistrations:TimeRegistrations[],
    previousWorkDays: PreviousWorkdayDates,
    nonProjectTimes: NonProjectTime[]
  ): Promise<WeeklyMessageData[]> => {
    const { weekStartDate, weekEndDate } = TimeUtilities.lastWeekDateProvider();
    const { yesterday, today } = previousWorkDays;

    let messagesRecord: WeeklyMessageData[] = [];

    const promises: Promise<ChatPostMessageResponse>[]  = weeklyCombinedData.map(user => {
      const { slackId, personId, expected } = user;

      const isAway = TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(timeRegistrations, personId, expected, today, nonProjectTimes);
      const firstDayBack = TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(timeRegistrations, personId, expected, yesterday, nonProjectTimes);

      const message = constructWeeklySummaryMessage(user, weekStartDate.toISODate(), weekEndDate.toISODate());

      if (!isAway && !firstDayBack) {
        messagesRecord.push(message);
        return sendMessage(slackId, message.message);
      }
    }).filter(p => p);

    const responses: ChatPostMessageResponse[] = await Promise.all(promises);
    const errors: ChatPostMessageResponse[] = responses.filter(response => response.error);

    if (errors.length) {
      let errorMessage = "Error while posting slack messages, ";

      errors.forEach(e => {
        errorMessage += `${e.error}\n`;
      });

      throw new Error(errorMessage);
    }

    return messagesRecord;
  };
}

export default SlackApiUtilities;