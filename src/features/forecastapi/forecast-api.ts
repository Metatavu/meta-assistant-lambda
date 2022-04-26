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
      const NonProjectTimes = await result.json();
      if (NonProjectTimes.length){
        const filterRes: NonProjectTime[] = NonProjectTimes.filter(NonProjectTime => NonProjectTime.is_internal_time !== true);
        if (filterRes.length) {
          return filterRes;
        }
      }
      throw new Error(`Error while loading non project time, ${NonProjectTimes.message}`);
    } catch(error) {
      console.error(error);
      return Promise.reject(error);
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
      const filteredTime = timeRegistrations.filter(timeRegistrations => timeRegistrations.non_project_time !== null);
      if(filteredTime.length){
        return filteredTime;
      }
      throw new Error("Error while loading time registrations", result);
    } catch(error) {
      console.error( error);
      return Promise.reject(error);
    }
  };
}

export default ForecastApiUtilities;