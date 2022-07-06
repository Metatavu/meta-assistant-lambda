import { WeeklyCombinedData } from "@functions/schema";
import { Person, DailyEntriesApi, PersonsApi, DailyEntry, Timespan } from "src/generated/client/api";
import Auth from "src/features/auth/auth-provider"

/**
 * Namespace for timebank API provider
 */
namespace TimeBankApiProvider {
  export const personsClient = new PersonsApi(process.env.TIMEBANK_BASE_URL);
  export const dailyEntriesClient = new DailyEntriesApi(process.env.TIMEBANK_BASE_URL);

  /**
   * Get list of timebank users from TimeBank API
   *
   * @returns valid persons data
   */
  export const getTimebankUsers = async (accessToken: string): Promise<Person[]> => {
    const { body } = await personsClient.listPersons(true, {
      headers:
        {"Authorization": `Bearer ${accessToken}`}
    });

    if (!body.length) {
      throw new Error("Error while loading Persons from Timebank");
    }

    return body;
  };

  /**
   * Get time entries for specific timebank user
   *
   * @param id from persons data
   * @param before string for timebank dates
   * @param after string for timebank dates
   * @returns Array of time entries for person
   */
  export const getDailyEntries = async (id: number, before: string, after: string, accessToken: string): Promise<DailyEntry> => {
    try {
      if (id === null) throw new Error("Invalid ID was given (expecting a number)")
      const request = await dailyEntriesClient.listDailyEntries(id, before, after, undefined, {
          headers: 
            { "Authorization": `Bearer ${accessToken}` }
        });
        
        if (request.response.statusCode === 200) return request.body[0]
        else throw new Error(`Error while loading DailyEntries for person ${id} from TImebank`)
    } catch (error) {
      console.error(error);
      throw new Error(error)
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
  export const getPersonTotalEntries = async (timespan: Timespan, person: Person, year: number, month: number, week: number, accessToken: string): Promise<WeeklyCombinedData> => {
    try {
      if (person.id === null) throw new Error("No ID on person!")
      const { body } = await personsClient.listPersonTotalTime(person.id, timespan, {
        headers:
          { "Authorization": `Bearer ${accessToken}`}
      });
      if (!body.length) throw new Error("Error while loading PersonTotalTimes");

      const filteredWeeks = body.filter(personTotalTime => personTotalTime.timePeriod === `${year},${month},${week}` );
      if (filteredWeeks.length !== 1) throw new Error("Found more than one PersonTotalTime for given year and week");

      const selectedWeek = filteredWeeks[0];
      const { firstName, lastName } = person;
      const combinedName = `${firstName} ${lastName}`;

      return {
        selectedWeek: selectedWeek,
        name: combinedName,
        firstName: person.firstName,
        personId: person.id,
        expected: person.monday
      };
    } catch (error) {
      console.error(`Error while loading PersonTotalTimes for person ${person.id}`)
      throw new Error(error)
    }
  };
}

export default TimeBankApiProvider;