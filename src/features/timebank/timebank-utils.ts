import { FormattedTimebankData } from "@functions/sendslack/schema";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { PersonDto, TimeEntry } from "src/generated/client/api";

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
  ): Promise<FormattedTimebankData[]> => (
    personData.map(person => {
      const { id, firstName, lastName } = person;
      const combinedName = `${firstName} ${lastName}`;

      const personsTimeEntries = timeData.filter(entry => entry.person === person.id);
      const slackUser = slackUsers.find(slackUser => slackUser.real_name === combinedName);

      return {
        id: id,
        name: combinedName,
        slackId: slackUser?.id,
        expected: personsTimeEntries[0].expected,
        logged: personsTimeEntries[0].logged,
        date: personsTimeEntries[0].date.toISOString()
      };
    })
  );
};

export default TimeBankUtilities;