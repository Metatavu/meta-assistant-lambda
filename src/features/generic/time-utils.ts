import { DailyCombinedData, Dates, TimeRegistrations } from "@functions/schema";
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

    return { weekEndDate: weekEndDate, weekStartDate: weekStartDate };
  };

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
    };
  };
  /**
   * 
   * @param user data from timebank
   * @returns message based on the worked time and percentage of billable hours
   */
  export const calculateWorkedTimeAndBillableHours = (user: TimeEntryTotalDto | DailyCombinedData) => {
    const { total, projectTime, expected } = user;

    const billableHoursPercentage = (projectTime/expected * 100).toFixed(1);

    const undertime = TimeUtilities.timeConversion(total * -1);
    const overtime = TimeUtilities.timeConversion(total);

    let message ="You worked the expected amount of time";
    if (total > 0){
      message = `Overtime: ${overtime}`;
    } else if (total < 0){
      message = `Undertime: ${undertime}`;
    }
    
    return {
      message: message,
      billableHoursPercentage: billableHoursPercentage
    };
  };

  /**
   * 
   * @param timeRegistrations 
   * @param personId 
   * @param expected 
   * @returns undefined if can't find time registration
   */
  export const checkIfUserIsAway = (timeRegistrations: TimeRegistrations[], personId: number, expected: number) => {
    const today = DateTime.now().toISODate();

    return timeRegistrations.find(
      timeRegistration => timeRegistration.person === personId
      && timeRegistration.date === today
      && timeRegistration.time_registered === expected);
  };

  /**
   * 
   * @param timeRegistrations
   * @param personId
   * @param yesterday
   * @returns undefined if can't find time registration
   */
  export const checkIsItFirstDayAfterVacation = (timeRegistrations: TimeRegistrations[], personId: number, yesterday: string) => {
    return timeRegistrations.find(
      timeRegistration => timeRegistration.person === personId
      && timeRegistration.date === yesterday
      && timeRegistration.time_registered === 435);
  };

  /**
   * 
   * @returns yesterday, day before yesterday and number of today
   */
  export const yesterdayAndDayBeforeYesterdayDateProvider = () => {
    let yesterday = DateTime.now().minus({ days: 1 }).toISODate();
    let dayBeforeYesterday = DateTime.now().minus({ days: 2 }).toISODate();
    const dayOfWeek = new Date().getDay();

    if (dayOfWeek === 1) {
      yesterday = DateTime.now().minus({ days: 3 }).toISODate();
      dayBeforeYesterday = DateTime.now().minus({ days: 4 }).toISODate();
      const yesterdayAndDayOfWeek = {
        yesterday: yesterday,
        numberOfDay: dayOfWeek,
        dayBeforeYesterday: dayBeforeYesterday
      };

      return yesterdayAndDayOfWeek;
    } else {
      const yesterdayAndDayOfWeek = {
        yesterday: yesterday,
        numberOfDay: dayOfWeek,
        dayBeforeYesterday: dayBeforeYesterday
      };

      return yesterdayAndDayOfWeek;
    }
  };
}

export default TimeUtilities;