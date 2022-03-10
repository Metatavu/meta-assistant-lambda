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
      const startOfWeek = DateTime.now().startOf("week");

      const weekStartDate = startOfWeek.minus({ weeks: 1 });
      const weekEndDate = startOfWeek.minus({ days: 1 });

      return { weekEndDate, weekStartDate };
    }
};

export default TimeUtilities;