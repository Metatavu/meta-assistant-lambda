import { WeeklyBreakdownCombinedData } from "@functions/schema";
import { DateTime } from "luxon";
import TimeUtilities from "src/features/generic/time-utils";

/**
 * File not currently in use, could be used in future for implementing a weekly breakdown in response to user interaction
 * Create weekly summary message based on specific users timebank data
 *
 * @param filteredTimebankData list of relevant timebank data
 * @returns string of multiple days breakdown message
 */
export const constructWeeklyBreakdownMessage = (filteredTimebankData: WeeklyBreakdownCombinedData) => {
  const { name, date } = filteredTimebankData.totals;

  // startDate and endDate could be modified to return a breakdown message for required time period
  const startDate = DateTime.fromISO(date).minus({days: 7}).toFormat('dd-MM-yyyy');
  const endDate = DateTime.fromISO(date).toFormat("dd-MM-yyyy");

  const startMessage = `Hi ${name}, here are your times for last week (${startDate} - ${endDate}). Have great week!\n`;

  let listMessage = "";

  filteredTimebankData.multiplePersonTimeEntries.forEach(day => {
    const displayDate = DateTime.fromISO(day.date).toFormat("dd-MM-yyyy");
    const dayName = DateTime.fromISO(day.date).weekdayLong;

    const {
      displayLogged,
      displayExpected,
      displayDifference,
      displayInternal,
      displayProject
    } = TimeUtilities.handleTimeConversion(day);

    listMessage += `On ${dayName} (${displayDate}) you worked ${displayLogged} with an expected time of ${displayExpected}.
      Difference: ${displayDifference}.
      Project time: ${displayProject}, Internal time: ${displayInternal}.\n`
  })

  return startMessage + listMessage;
};