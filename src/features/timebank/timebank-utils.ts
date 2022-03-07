import { FormattedTimebankData, WeeklyFormattedTimebankData, PersonDto, TimeEntry } from "@functions/sendslack/schema";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";

/**
 * Namespace for timebank utilities
 */
namespace TimeBankUtilities {

  /**
   * Formats timebank data to slack data format
   *
   * @param personData list of persons
   * @param timeData list of time entries
   * @param slackUsers list of slack users
   * @returns list of formatted slack data
   */
  export const formatTimebankData = async (
    personData: PersonDto[],
    timeData: TimeEntry[],
    slackUsers: Member[]
  ): Promise<FormattedTimebankData[] | WeeklyFormattedTimebankData[]> => (
    personData.map(person => {
      const { id, first_name, last_name } = person;
      const combinedName = `${first_name} ${last_name}`;

      const personsTimeEntries = timeData.filter(entry => entry.person === person.id);
      const slackUser = slackUsers.find(slackUser => slackUser.real_name === combinedName);
      const length = personsTimeEntries.length;

      if(length === 1){
        return {
          id: id,
          name: combinedName,
          slackId: slackUser?.id,
          expected: personsTimeEntries[0].expected,
          logged: personsTimeEntries[0].logged,
          date: personsTimeEntries[0].date
        };
      }
      const totals: FormattedTimebankData = calculateWeeklyTotals(personsTimeEntries, combinedName, id, slackUser);

      // return totals;

      let multiplePersonTimeEntries: FormattedTimebankData[] = [];

      for (let i = 0; i < length; i++) {
        multiplePersonTimeEntries.push({
          id: id,
          name: combinedName,
          slackId: slackUser?.id,
          expected: personsTimeEntries[i].expected,
          logged: personsTimeEntries[i].logged,
          date: personsTimeEntries[i].date,
        });
      }
      
      const weekly: boolean = true;

      console.log({
        totals,
        multiplePersonTimeEntries,
        id,
        weekly
      })

      return { totals, multiplePersonTimeEntries, id, weekly }
    })
  );

  /**
   * Sum timebank data for previous 7 days
   * 
   * @param formattedTimebankData
   * @returns 
   */
  export const calculateWeeklyTotals = (personsTimeEntries: TimeEntry[], combinedName: string, id: number, slackUser: Member ) => {
    
      let logged = 0;
      let expected = 0;
      let date = "";

      personsTimeEntries.forEach(day => {
        logged += day.logged;
        expected += day.expected;
        date = day.date;
      });
      return { name: combinedName, logged, expected, id, slackId: slackUser?.id, date }
  };
};

export default TimeBankUtilities;