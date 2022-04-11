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
      const result = await fetch(`${process.env.forecast_base_url}non_project_time`, { headers: headers });
      const nonProjectTimes: NonProjectTime[] = await result.json();
      return nonProjectTimes.filter(nonProject => nonProject.is_internal_time !== true);
    } catch(error) {
      console.error("Error while loading non project time");
      Promise.reject(error);
    }
  };

  /**
   * Get all time registrations after yesterday
   * 
   * @param dayBeforeYesterday the day before yesterday
   * @returns all time registrations after yesterday
   */
  export const getTimeRegistrations = async (dayBeforeYesterday: string): Promise<TimeRegistrations[]> => {
    try {
      const dayBeforeYesterdayUrl = dayBeforeYesterday.replace(/[-]/g, "");
      const result = await fetch(`${process.env.forecast_v3_url}time_registrations?date_after=${dayBeforeYesterdayUrl}`, { headers: headers });
      const timeRegistrations: TimeRegistrations[] = await result.json();
      return timeRegistrations.filter(registration => registration.non_project_time !== null);
    } catch(error) {
      console.error("Error while loading time registrations");
      Promise.reject(error);
    }
  };
}

export default ForecastApiUtilities;