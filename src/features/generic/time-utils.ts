import { Dates } from "@functions/schema";
import { DateTime, Duration } from "luxon";

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
      const weekStartDate = DateTime.now().startOf('week').minus({ weeks: 1 });
      const weekEndDate = DateTime.now().startOf('week').minus({ days: 1 });
      const numberedYear = weekEndDate.year;
      const numberedWeek = weekStartDate.weekNumber;
      const weekStartString = weekStartDate.toISODate();
      const weekEndString = weekEndDate.toISODate();

      return { numberedYear, numberedWeek,  weekStartString, weekEndString };
    }
};

export default TimeUtilities;