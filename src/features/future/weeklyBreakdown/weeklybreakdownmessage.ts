// import { WeeklyFormattedTimebankData } from "@functions/schema";
// import { DateTime } from "luxon";
// import TimeUtilities from "src/features/generic/time-utils";

// /**
//    * Create weekly summary message based on specific users timebank data
//    *
//    * @param filteredTimebankData list of relevant timebank data
//    * @returns string message if id match
//    */
//  const constructWeeklyBreakdownMessage = (filteredTimebankData: WeeklyFormattedTimebankData) => {
//   const { name, date } = filteredTimebankData.totals;
//   const startDate = DateTime.fromISO(date).minus({days: 7}).toFormat('dd-MM-yyyy');
//   const endDate = DateTime.fromISO(date).toFormat("dd-MM-yyyy");

//   const startMessage = `Hi ${name}, here are your times for last week (${startDate} - ${endDate}). Have great week!\n`;
  
//   let listMessage = "";

//   filteredTimebankData.multiplePersonTimeEntries.forEach(day => {
//     const displayDate = DateTime.fromISO(day.date).toFormat("dd-MM-yyyy");
//     const dayName = DateTime.fromISO(day.date).weekdayLong;
//     const { logged, expected, project, internal, difference } = day;
//     const displayLogged = TimeUtilities.timeConversion(logged);
//     const displayExpected = TimeUtilities.timeConversion(expected);
//     const displayDifference = TimeUtilities.timeConversion(difference);
//     const displayProject = TimeUtilities.timeConversion(project);
//     const displayInternal = TimeUtilities.timeConversion(internal);

//     listMessage += `On ${dayName} (${displayDate}) you worked ${displayLogged} with an expected time of ${displayExpected}.
//       Difference: ${displayDifference}.
//       Project time: ${displayProject}, Internal time: ${displayInternal}.\n`
//   })

//   return startMessage + listMessage;
// };