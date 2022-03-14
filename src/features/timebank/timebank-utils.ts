import { DailyCombinedData, WeeklyCombinedData } from "@functions/schema";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { PersonDto, TimeEntry } from "src/generated/client/api";

/**
 * Namespace for timebank utilities
 */
namespace TimeBankUtilities {

  /**
   * Combines daily timebank data with slack data
   *
   * @param personData list of persons
   * @param timeData list of time entries
   * @param slackUsers list of slack users
   * @returns list of combined daily slack data
   */
  export const combineDailyData = (
    personData: PersonDto[],
    timeData: TimeEntry[],
    slackUsers: Member[]
  ): DailyCombinedData[] => (
    personData.map(person => {
      const { firstName, lastName } = person;
      const combinedName = `${firstName} ${lastName}`;

      const personsTimeEntries = timeData.filter(entry => entry.person === person.id);
      const slackUser = slackUsers.find(slackUser => slackUser.real_name === combinedName);
      const length = personsTimeEntries.length;

      if (length === 1){
        return {
          name: combinedName,
          slackId: slackUser?.id,
          expected: personsTimeEntries[0].expected,
          logged: personsTimeEntries[0].logged,
          projectTime: personsTimeEntries[0].projectTime,
          internalTime: personsTimeEntries[0].internalTime,
          total: personsTimeEntries[0].total,
          date: personsTimeEntries[0].date.toISOString()
        };
      }
    })
  );

  /**
   * Combines weekly timebank data with slack data
   *
   * @param timeData list of time entries
   * @param slackUsers list of slack users
   * @returns list of combined totals time data with slack user id
   */
  export const combineWeeklyData = (timeData: WeeklyCombinedData[], slackUsers: Member[]): WeeklyCombinedData[] => (
    timeData.map(entry => {
      const slackUser = slackUsers.find(slackUser => slackUser.real_name === entry.name);

      return slackUser ? { ...entry, slackId: slackUser.id } : entry;
    })
  );
};

export default TimeBankUtilities;