import fetch from "node-fetch";
import { PersonDto, TimeEntry } from "@functions/sendslack/schema";

/**
 * Namespace for timebank API provider
 */
namespace TimeBankApiProvider {

  /**
   * Get list of timebank users from TimeBank API
   *
   * @returns valid persons data
   */
  export const getTimebankUsers = async (): Promise<PersonDto[]> => {
    try {
      const response = await fetch("https://time-bank-api.metatavu.io/timebank/persons");
      const data = await response.json();

      return data.filter(person => person.default_role !== null);
    } catch (error) {
      console.error("Error while loading persons");
      Promise.reject(error);
    }
  };

  /**
   * Get time entries for specific timebank user
   *
   * @param id from persons data
   * @param before string for timebank dates
   * @param after string for timebank dates
   * @returns Array of time entries for person
   */
  export const getTimeEntries = async (id: number, before: string, after: string): Promise<TimeEntry[]> => {
    try {
      const response = await fetch(`https://time-bank-api.metatavu.io/timebank/entries/${id}?before=${before}&after=${after}`);
      return await response.json();
    } catch (error) {
      console.error("Error while loading time entries");
      Promise.reject(error);
    }
  };
};

export default TimeBankApiProvider;