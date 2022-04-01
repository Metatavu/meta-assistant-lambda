import { timeRegistrations } from "@functions/schema";
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
   * get all allocations after yesterday
   * 
   * @param yesterday yesterday
   * @returns all allocations after yesterday
   */
  export const getTimeRegistrations = async (yesterday:string):Promise<timeRegistrations[]> => {
    try{
      yesterday = yesterday.replace(/[-]/g, "");
      const result = await fetch(`${process.env.forecast_v3_url}time_registrations?date_after=${yesterday}`, { headers: headers });
      const timeRegistrations: timeRegistrations[] = await result.json();
      return timeRegistrations.filter(timeRegistrations => timeRegistrations.non_project_time !== null);
    }catch(error){
      console.error("Error while loading timeregistrations");
      Promise.reject(error);
    }
  };
}
export default ForecastApiUtilities;