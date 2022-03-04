import fetch from "node-fetch";
import { PersonDto, TimeEntry } from "@functions/sendslack/schema";

/**
 * Namespace for timebank API provider
 */
namespace TimeBankApiProvider {
  
  /**
   * gets person data from TimeBank API
   * 
   * @returns valid persons data
   */
  export const getPersons = async (): Promise<PersonDto[]> => {
    try {
      const response = await fetch("https://time-bank-api.metatavu.io/timebank/persons");
      const Data = await response.json();
      return Data.filter((person) => {
        if (person.default_role === null) {
          return;
        } else {
          return person;
        }
      });
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