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
      const nonProjectTimes = await result.json();
      if (nonProjectTimes[0].id){
        const filterRes: NonProjectTime[] = nonProjectTimes.filter(nonPTime => !nonPTime.is_internal_time);
        if (filterRes.length) {
          return filterRes;
        }
      }
      throw new Error(`Error while loading non project time, ${nonProjectTimes.message}`);
    } catch(error) {
      console.error(error);
      return Promise.reject(error);
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
      const result = await fetch(`${process.env.forecast_v3_url}time_registrations?date_after=${dayBeforeYesterdayUrl}`, { headers: headers });
      const timeRegistrations: any = await result.json();
      if(timeRegistrations[0].id){
        const filteredTime: TimeRegistrations[] = timeRegistrations.filter(timeReg => timeReg.non_project_time !== null);
        if(filteredTime.length){
          return filteredTime;
        }
      }
      throw new Error("Error while loading time registrations", result);
    } catch(error) {
      console.error(error);
      return Promise.reject(error);
    }
  };
}

export default ForecastApiUtilities;