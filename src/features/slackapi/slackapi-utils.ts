import { DailyCombinedData, WeeklyCombinedData, TimeRegistrations, PreviousWorkdayDates, NonProjectTime, DailyMessageData, DailyMessageResult, WeeklyMessageData, WeeklyMessageResult } from "@functions/schema";
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

    if (!result.members) throw new Error(`Error while loading slack users list, ${result.error}`);

    return result.members;
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
      logged,
      expected,
      internal,
      project
    } = TimeUtilities.handleTimeConversion(user);

    const {
      message,
      billableHoursPercentage
    } = TimeUtilities.calculateWorkedTimeAndBillableHours(user);

    const customMessage = `
Hi ${firstName},
${numberOfToday === 1 ? "Last friday" :"Yesterday"} (${displayDate}) you worked ${logged} with an expected time of ${expected}.
${message}
Project time: ${project}, Internal time: ${internal}.
Your percentage of billable hours was: ${billableHoursPercentage}% ${+billableHoursPercentage >= 75 ? ":+1:" : ":-1:"}
Have a great rest of the day!
    `;
    return {
      message: customMessage,
      name: name,
      displayDate: displayDate,
      displayLogged: logged,
      displayExpected: expected,
      displayProject: project,
      displayInternal: internal,
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
      logged,
      expected,
      internal,
      project
    } = TimeUtilities.handleTimeConversion(user.selectedWeek);

    const {
      message,
      billableHoursPercentage
    } = TimeUtilities.calculateWorkedTimeAndBillableHours(user.selectedWeek);

    const customMessage = `
Hi ${firstName},
Last week (week: ${ week }, ${startDate} - ${endDate}) you worked ${logged} with an expected time of ${expected}.
${message}
Project time: ${project}, Internal time: ${internal}.
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
      displayLogged: logged,
      displayExpected: expected,
      displayProject: project,
      displayInternal: internal,
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
  export const postDailyMessageToUsers = async (
    dailyCombinedData: DailyCombinedData[],
    timeRegistrations: TimeRegistrations[],
    previousWorkDays: PreviousWorkdayDates,
    nonProjectTimes: NonProjectTime[]
  ): Promise<DailyMessageResult[]> => {
    const { numberOfToday, yesterday, today } = previousWorkDays;

    let messageResults: DailyMessageResult[] = [];

    for (const userData of dailyCombinedData) {
      const { slackId, personId, expected } = userData;

      const isAway = TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(timeRegistrations, personId, expected, today, nonProjectTimes);
      const firstDayBack= TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(timeRegistrations, personId, expected, yesterday, nonProjectTimes);

      const message = constructDailyMessage(userData, numberOfToday);

      if (!isAway && !firstDayBack) {
        messageResults.push({
          message: message,
          response: await sendMessage(slackId, message.message)
        });
      }

      return messageResults;
    }
  };

  /**
   * Post a weekly summary slack message to users
   *
   * @param weeklyCombinedData list of combined timebank and slack user data
   * @param nonProjectTimes all non project times
   * @param timeRegistrations all time registrations after yesterday
   * @param previousWorkDays dates and the number of today
   */
  export const postWeeklyMessageToUsers = async (
    weeklyCombinedData: WeeklyCombinedData[],
    timeRegistrations:TimeRegistrations[],
    previousWorkDays: PreviousWorkdayDates,
    nonProjectTimes: NonProjectTime[]
  ): Promise<WeeklyMessageResult[]> => {
    const { weekStartDate, weekEndDate } = TimeUtilities.lastWeekDateProvider();
    const { yesterday, today } = previousWorkDays;

    const messageResults: WeeklyMessageResult[] = [];

    for (const userData of weeklyCombinedData) {
      const { slackId, personId, expected } = userData;

      const isAway = TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(timeRegistrations, personId, expected, today, nonProjectTimes);
      const firstDayBack = TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(timeRegistrations, personId, expected, yesterday, nonProjectTimes);

      const message = constructWeeklySummaryMessage(userData, weekStartDate.toISODate(), weekEndDate.toISODate());

      if (!isAway && !firstDayBack) {
        messageResults.push({
          message: message,
          response: await sendMessage(slackId, message.message)
        });
      }
    }

    return messageResults
  };
}

export default SlackApiUtilities;