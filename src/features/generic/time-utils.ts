import { DailyCombinedData, Dates } from "@functions/schema";
import { DateTime, Duration } from "luxon";
import { TimeEntryTotalDto } from "src/generated/client/api";

/**
 * Namespace for time utilities
 */
namespace TimeUtilities {

  /**
   * Converts minutes into hours and minutes
   *
   * @param duration in minutes from timebank Data
   * @returns string of timebank data converted to hours and minutes
   */
  export const timeConversion = (duration: number): string => {
    const dur = Duration.fromObject({ minutes: duration });
    const time = dur.shiftTo("hours", "minutes");
    return `${time.hours}h ${time.minutes} minutes`;
  };

  /**
   * Generates dates and numbers for previous week
   *
   * @returns various date formats/ numbers for start and end of previous week
   */
  export const lastWeekDateProvider = (): Dates => {
    const startOfWeek = DateTime.now().startOf("week");

    const weekStartDate = startOfWeek.minus({ weeks: 1 });
    const weekEndDate = startOfWeek.minus({ days: 1 });

    return { weekEndDate, weekStartDate };
  }

  /**
   * Handle formatting multiple time variables
   *
   * @param user data from timebank
   * @returns human friendly time formats
   */
  export const handleTimeConversion = (user: TimeEntryTotalDto) => {
    const { logged, expected, internalTime, total, projectTime } = user;

    const displayLogged = TimeUtilities.timeConversion(logged);
    const displayExpected = TimeUtilities.timeConversion(expected);
    const displayDifference = TimeUtilities.timeConversion(total);
    const displayProject = TimeUtilities.timeConversion(projectTime);
    const displayInternal = TimeUtilities.timeConversion(internalTime);

    return {
      displayLogged: displayLogged,
      displayExpected: displayExpected,
      displayDifference: displayDifference,
      displayProject: displayProject,
      displayInternal: displayInternal
    }
  }

  /**
   * Changes project times to percents and makes over- and undertime messages
   * 
   * @param user data from timebank
   * @returns project time percents and over- and undertime messages
   */
  export const calculateWorkedTimeAndBillableHours = (user: TimeEntryTotalDto | DailyCombinedData) => {
    const { projectTime, expected,total } = user;

    const billableHours = (projectTime/expected * 100).toFixed(1);
    const billableHoursWithPercentage = `${billableHours}%`;

    const overtime = TimeUtilities.timeConversion(total);
    const undertime = TimeUtilities.timeConversion(total * -1);

    let underOverMessage = "No overtime, you worked the expected time.";
    if (total < 0) {
      underOverMessage = `Undertime: ${undertime}`;
    }
    
    if (total > 0) {
      underOverMessage = `Overtime: ${overtime}`;
    }

    return {
      underOverMessage,
      billableHoursWithPercentage: billableHoursWithPercentage,
      billableHours: billableHours
    }
  };
}

export default TimeUtilities;