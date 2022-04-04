import { TimeRegistrations } from "@functions/schema";
import fetch, { Headers } from "node-fetch";

/**
 *  Namespace for forecast-api
 */
namespace ForecastApiUtilities {
  const header ={
    "X-FORECAST-API-KEY": `${process.env.X_FORECAST_API_KEY}`
  };

  const headers = new Headers(header);

  /**
   * Get all allocations after yesterday
   * 
   * @param yesterday yesterday
   * @returns all allocations after yesterday
   */
  export const getTimeRegistrations = async (dayBeforeYesterday: string): Promise<TimeRegistrations[]> => {
    try {
      const dayBeforeYesterdayUrl = dayBeforeYesterday.replace(/[-]/g, "");
      const result = await fetch(`${process.env.forecast_v3_url}time_registrations?date_after=${dayBeforeYesterdayUrl}`, { headers: headers });
      const timeRegistrations: TimeRegistrations[] = await result.json();
      return timeRegistrations.filter(timeRegistrations => timeRegistrations.non_project_time !== null);
    } catch(error) {
      console.error("Error while loading time registrations");
      Promise.reject(error);
    }
  };
}
export default ForecastApiUtilities;