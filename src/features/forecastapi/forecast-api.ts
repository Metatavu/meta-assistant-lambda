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
    const result: any = await fetch(`${process.env.FORECAST_BASE_URL}/v1/non_project_time`, { headers: headers });

    if (result.status !== 200) throw new Error(`Error while loading non project time, ${result.message}`);

    const nonProjectTimes: NonProjectTime[] = await result.json();

    return nonProjectTimes.filter(nonProjectTime => !nonProjectTime.is_internal_time);
  };

  /**
   * Get all allocations after yesterday
   * 
   * @param dayBeforeYesterday the day before yesterday
   * @returns all allocations after yesterday
   */
  export const getTimeRegistrations = async (dayBeforeYesterday: string): Promise<TimeRegistrations[]> => {
    const dayBeforeYesterdayUrl = dayBeforeYesterday.replace(/[-]/g, "");
    const result: any = await fetch(`${process.env.FORECAST_BASE_URL}/v3/time_registrations?date_after=${dayBeforeYesterdayUrl}`, { headers: headers });

    if (result.status !== 200) throw new Error("Error while loading time registrations", result.message);

    const timeRegistrations: TimeRegistrations[] = await result.json();

    return timeRegistrations.filter(timeRegistration => timeRegistration.non_project_time);
  };
}

export default ForecastApiUtilities;