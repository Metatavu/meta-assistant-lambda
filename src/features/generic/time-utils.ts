import { Duration } from "luxon";

/**
 *  namespace for time utilities
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

};

export default TimeUtilities;