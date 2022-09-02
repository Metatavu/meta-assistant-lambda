import { DailyCombinedData, SprintCombinedData, WeeklyCombinedData } from "@functions/schema";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { DailyEntry, Person } from "src/generated/client/api";
import TimeUtilities from "../generic/time-utils";

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

      if (length === 1) {
        return {
          name: combinedName,
          firstName: firstName,
          slackId: slackUser?.id,
          personId: person.id,
          expected: personsTimeEntries[0].expected,
          logged: personsTimeEntries[0].logged,
          projectTime: personsTimeEntries[0].projectTime,
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
   * Combines summary of last sprint worktimes
   * 
   * @param timeData array of WeeklyCombinedData
   * @returns SprintCombinedData
   */
  export const combineSprintData = (timeData: WeeklyCombinedData[]): SprintCombinedData => {
    const firstWeek = timeData[0].selectedWeek;
    const secondWeek = timeData[1].selectedWeek;
    const totalInternalTime = firstWeek.internalTime + secondWeek.internalTime;
    const totalProjectTime = firstWeek.projectTime + secondWeek.projectTime;
    const totalLogged = firstWeek.logged + secondWeek.logged;
    const totalExpected = firstWeek.expected + secondWeek.expected;
    const totalBalance = firstWeek.balance + secondWeek.balance;
    const sprintStartWeek = Number(secondWeek.timePeriod.split(",")[2]);
    const sprintEndWeek = Number(firstWeek.timePeriod.split(",")[2]);
    const sprintYear = Number(secondWeek.timePeriod.split(",")[0]);

    return {
      name: timeData[0].name,
      internalTime: TimeUtilities.timeConversion(totalInternalTime),
      projectTime: TimeUtilities.timeConversion(totalProjectTime),
      logged: TimeUtilities.timeConversion(totalLogged),
      expected: TimeUtilities.timeConversion(totalExpected),
      balance: TimeUtilities.timeConversion(totalBalance),
      mailData: {
        sprintStartWeek: sprintStartWeek,
        sprintEndWeek: sprintEndWeek,
        sprintYear: sprintYear,
        name: timeData[0].firstName,
        percentage: Math.round(totalProjectTime/totalLogged*100),
        recipients: [timeData[0].email, `${process.env.CEO_EMAIL}@metatavu.fi`]
      }
    };
  };
}

export default TimeBankUtilities;