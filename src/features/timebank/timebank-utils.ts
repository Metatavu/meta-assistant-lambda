import { FormattedTimebankData, PersonDto, TimeEntry } from "@functions/sendslack/schema";

/**
 * Namespace for timebank utilities
 */
namespace TimeBankUtilities {

  /**
   * Formats timebank data to slack data format
   *
   * @param personData list of persons 
   * @param timeData list of time entries
   * @returns list of formatted slack data 
   */
  export const formatTimebankData = async (personData: PersonDto[], timeData: TimeEntry[]): Promise<FormattedTimebankData[]> => (
    personData.map(person => {
      const { id, first_name, last_name } = person;
      const personsTimeEntries = timeData.filter(entry => entry.person === person.id);

      return {
        id: id,
        name: `${first_name} ${last_name}`,
        expected: personsTimeEntries[0].expected,
        logged: personsTimeEntries[0].logged,
        date: personsTimeEntries[0].date
      };
    })
  );
};

export default TimeBankUtilities;