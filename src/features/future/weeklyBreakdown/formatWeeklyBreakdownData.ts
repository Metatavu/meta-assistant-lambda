// import { FormattedTimebankData } from "@functions/schema";
// import { Member } from "@slack/web-api/dist/response/UsersListResponse";
// import { PersonDto, TimeEntry } from "src/generated/client/api";

// /**
//  * WeeklyFormattedTimebankData interface
//  */
// export interface WeeklyFormattedTimebankData {
//   totals: FormattedTimebankData;
//   multiplePersonTimeEntries: FormattedTimebankData[];
// }

// /**
//    * Formats weekly timebank data and combines with slack data
//    *
//    * @param personData list of persons
//    * @param timeData list of time entries
//    * @param slackUsers list of slack users
//    * @returns list of formatted weekly slack day
//    */
// export const formatWeeklyTimebankData = (
//   personData: PersonDto[],
//   timeData: TimeEntry[],
//   slackUsers: Member[]
//   ): WeeklyFormattedTimebankData[] => (
//     personData.map(person => {
//       const { id, firstName, lastName } = person;
//       const combinedName = `${firstName} ${lastName}`;

//       const personsTimeEntries = timeData.filter(entry => entry.person === person.id);
//       const slackUser = slackUsers.find(slackUser => slackUser.real_name === combinedName);
//       const length = personsTimeEntries.length;

//     const totals: FormattedTimebankData = calculateWeeklyTotals(personsTimeEntries, combinedName, id, slackUser);

//     let multiplePersonTimeEntries: FormattedTimebankData[] = [];

//     for (let i = 0; i < length; i++) {
//       multiplePersonTimeEntries.push({
//         id: id,
//         name: combinedName,
//         slackId: slackUser?.id,
//         expected: personsTimeEntries[i].expected,
//         logged: personsTimeEntries[i].logged,
//         project: personsTimeEntries[i].projectTime,
//         internal: personsTimeEntries[i].internalTime,
//         difference: personsTimeEntries[i].total,
//         date: personsTimeEntries[i].date.toISOString(),
//       });
//     }

//     return { totals, multiplePersonTimeEntries }
//   })
// );

// /**
//  * Sum timebank data for previous 7 days
//  *
//  * @param personsTimeEntries list of daily time entries
//  * @param combinedName string of first and last from API response
//  * @param id timebank is number
//  * @param slackUser data
//  * @returns object of weekly totals of FormattedTimebankData type
//  */
// export const calculateWeeklyTotals = (personsTimeEntries: TimeEntry[], combinedName: string, id: number, slackUser: Member ) => {

//     let logged = 0;
//     let expected = 0;
//     let project = 0;
//     let internal = 0;
//     let date = "";
//     let difference = 0;

//     personsTimeEntries.forEach(day => {
//       logged += day.logged;
//       expected += day.expected;
//       project += day.projectTime;
//       internal += day.internalTime;
//       difference += day.total;
//       date = day.date.toISOString();
//     });
//     return { name: combinedName, logged, expected, id, slackId: slackUser?.id, date, project, internal, difference }
// };