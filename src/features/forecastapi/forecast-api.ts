import { NonProjectTime, TimeRegistrations } from "@functions/schema";
import fetch, { Headers } from "node-fetch";

/**
 * Namespace for forecast-api
 */
namespace ForecastApiUtilities {
  const header ={
    "X-FORECAST-API-KEY": process.env.X_FORECAST_API_KEY
  };

  const headers = new Headers(header);

  /**
   * Gets non project time types from forecast
   *
   * @returns All non project times where is_internal_time is false
   */
  export const getNonProjectTime = async (): Promise<NonProjectTime[]> => {
    try {
      const request: any = await fetch(`${process.env.FORECAST_BASE_URL}/v1/non_project_time`, { headers: headers });

      const nonProjectTimes: NonProjectTime[] = await request.json();

      return nonProjectTimes.filter(nonProjectTime => !nonProjectTime.is_internal_time);
    } catch (error) {
      throw new Error(`Error while loading non project times, ${error.message}`)
    }
  };

  /**
   * Get all allocations after yesterday
   * 
   * @param dayBeforeYesterday the day before yesterday
   * @returns all allocations after yesterday
   */
  export const getTimeRegistrations = async (dayBeforeYesterday: string): Promise<TimeRegistrations[]> => {
    try {
      const dayBeforeYesterdayUrl = dayBeforeYesterday.replace(/[-]/g, "");
      const result: any = await fetch(`${process.env.FORECAST_BASE_URL}/v3/time_registrations?date_after=${dayBeforeYesterdayUrl}`, { headers: headers });

      const timeRegistrations: TimeRegistrations[] = await result.json();

      return timeRegistrations.filter(timeRegistration => timeRegistration.non_project_time);
    } catch (error) {
      if (error instanceof TypeError) {
        throw error
      }
      throw new Error(`Error while loading time registrations, ${error.message}`)
    }
  };
}

export default ForecastApiUtilities;