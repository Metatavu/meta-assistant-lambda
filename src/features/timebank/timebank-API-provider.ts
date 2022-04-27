import { TimePeriod, WeeklyCombinedData } from "@functions/schema";
import { PersonDto, TimebankApi, TimeEntry } from "src/generated/client/api";

/**
 * Namespace for timebank API provider
 */
namespace TimeBankApiProvider {
  export const client = new TimebankApi(process.env.timebank_base_url);

  /**
   * Get list of timebank users from TimeBank API
   *
   * @returns valid persons data
   */
  export const getTimebankUsers = async (): Promise<PersonDto[]> => {
    try {
      const { body } = await client.timebankControllerGetPersons();
      if(body.length === 0){
        throw new Error("Error while loading persons from Timebank");
      }
      return body.filter(person => person.defaultRole !== null);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
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
      const { body } = await client.timebankControllerGetEntries(id.toString(), before, after);
      if(body){
        return body;
      }
      throw new Error("Error while loading time entries from Timebank");
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  /**
   * Get totals time entries for user for specific time period
   *
   * @param timePeriod of time data to sum
   * @param person person data from timebank
   * @param year of data to request
   * @param week of data to request
   * @returns total time data with user name
   */
  export const getTotalTimeEntries = async (timePeriod: TimePeriod, person: PersonDto, year: number, week: number): Promise<WeeklyCombinedData> => {
    try {
      const { body } = await client.timebankControllerGetTotal(person.id.toString(), timePeriod);
      const selectedWeek = body.filter(timePeriod => timePeriod.id.year === year && timePeriod.id.week === week)[0];

      const { firstName, lastName } = person;
      const combinedName = `${firstName} ${lastName}`;

      return {
        selectedWeek: selectedWeek,
        name: combinedName,
        personId: person.id,
        expected: person.monday
      };
    } catch (error) {
      console.error("Error while loading total time entries");
      return Promise.reject(error);
    }
  };
}

export default TimeBankApiProvider;