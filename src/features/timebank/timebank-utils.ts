import { DailyCombinedData, WeeklyCombinedData } from "@functions/schema";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { DailyEntry, Person } from "src/generated/client/api";

/**
 * Namespace for Timebank utilities
 */
namespace TimebankUtilities {

  /**
   * Combines daily timebank data with slack data
   *
   * @param personData list of persons
   * @param timeData list of time entries
   * @param slackUsers list of slack users
   * @returns list of combined daily slack data
   */
  export const combineDailyData = (
    personData: Person[],
    timeData: DailyEntry[],
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
          firstName: firstName,
          minimumBillableRate: person.minimumBillableRate,
          slackId: slackUser?.id,
          personId: person.id,
          expected: personsTimeEntries[0].expected,
          logged: personsTimeEntries[0].logged,
          loggedProjectTime: personsTimeEntries[0].loggedProjectTime,
          billableProjectTime: personsTimeEntries[0].billableProjectTime,
          nonBillableProjectTime: personsTimeEntries[0].nonBillableProjectTime,
          internalTime: personsTimeEntries[0].internalTime,
          balance: personsTimeEntries[0].balance,
          date: personsTimeEntries[0].date
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
  /**
   * Filters staging users only when staging IDs are in the envs
   * 
   * @param filteredTimebankUsers list of users after filtering
   * @param listOfIds list of staging IDs in the envs
   * @returns list of users with the matching staging IDs
   */
  export const filterStagingUsers = (filteredTimebankUsers: Person[], listOfIds: string[]): Person[] => {
    return filteredTimebankUsers.filter(person => {
      if (listOfIds.length === 0) {
        return true;
      } else if (listOfIds.includes(person.id.toString())) {
        return true;
      } else {
        return false;
      }
    });
  };
}

export default TimebankUtilities;