import { DailyCombinedData, WeeklyBreakdownCombinedData } from "@functions/schema";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { PersonDto, TimeEntry } from "src/generated/client/api";

/**
 * File not currently in use, could be used in future for implementing a weekly breakdown in response to user interaction
 * Formats 7 individual days timebank data and combines with slack data
 *
 * @param personData list of persons
 * @param timeData list of time entries
 * @param slackUsers list of slack users
 * @returns list of formatted weekly slack day
 */
export const combineWeeklyBreakdownData = (
  personData: PersonDto[],
  timeData: TimeEntry[],
  slackUsers: Member[]
  ): WeeklyBreakdownCombinedData[] => (
  personData.map(person => {
    const { firstName, lastName } = person;
    const combinedName = `${firstName} ${lastName}`;

    const personsTimeEntries = timeData.filter(entry => entry.person === person.id);
    const slackUser = slackUsers.find(slackUser => slackUser.real_name === combinedName);
    const length = personsTimeEntries.length;

    const totals: DailyCombinedData = calculateTotals(personsTimeEntries, combinedName, slackUser);

    let multiplePersonTimeEntries: DailyCombinedData[] = [];

    for (let i = 0; i < length; i++) {
      multiplePersonTimeEntries.push({
        name: combinedName,
        slackId: slackUser?.id,
        expected: personsTimeEntries[i].expected,
        logged: personsTimeEntries[i].logged,
        projectTime: personsTimeEntries[i].projectTime,
        internalTime: personsTimeEntries[i].internalTime,
        total: personsTimeEntries[i].total,
        date: personsTimeEntries[i].date.toISOString(),
      });
    }

    return { totals, multiplePersonTimeEntries }
  })
);

/**
 * Sum timebank data for multiple days
 *
 * @param personsTimeEntries list of daily time entries
 * @param combinedName string of first and last from API response
 * @param id timebank is number
 * @param slackUser data
 * @returns object of weekly totals of DailyCombinedData type
 */
export const calculateTotals = (personsTimeEntries: TimeEntry[], combinedName: string, slackUser: Member ) => {
    let logged = 0;
    let expected = 0;
    let projectTime = 0;
    let internalTime = 0;
    let date = "";
    let total = 0;

    personsTimeEntries.forEach(day => {
      logged += day.logged;
      expected += day.expected;
      projectTime += day.projectTime;
      internalTime += day.internalTime;
      total += day.total;
      date = day.date.toISOString();
    });
    return { name: combinedName, logged, expected, slackId: slackUser?.id, date, projectTime, internalTime, total }
};