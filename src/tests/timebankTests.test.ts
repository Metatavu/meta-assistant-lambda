import TimeUtilities from "../features/generic/time-utils";
import TimeBankApiProvider from "../features/timebank/timebank-API-provider";
import TestHelpers from "./utilities/test-utils";
import { Timespan, DailyEntry } from "src/generated/client/api";
import { timebankGetUsersMock2, dailyEntryMock3, dailyEntryMock4, dailyEntryArrayMock, timebankUser1, timebankUser2, timeTotalsMock1, timeTotalsMock2, timeTotalsMock4 } from "./__mocks__/timebankMocks";

let accessToken: string;

const consoleSpy = jest.spyOn(console, "error");

beforeAll( async () => {
  accessToken = await TestHelpers.mockAccessToken();
})

beforeEach(() => {
  jest.resetAllMocks();
});

describe("timebank-api-provider tests", () => {
  describe("getTimebankUsers test", () => {
    it("should return two timebank users", async () => {
      TestHelpers.mockTimebankPersons(200, timebankGetUsersMock2);

      const results = await TimeBankApiProvider.getTimebankUsers(accessToken);

      expect(results[0].id).toBe(1);
      expect(results[0].firstName).toBe("tester");
      expect(results[1].id).toBe(2);
      expect(results[1].firstName).toBe("tester2");
      expect(results[2].id).toBe(3);
      expect(results[2].firstName).toBe("tester3");
      expect(results.length).toBe(3);
    });
  });

  describe("getTimeEntries tests", () => {
    it("Should return person's time entries", async () => {
      TestHelpers.mockTimebankDailyEntries(200, [dailyEntryMock3, dailyEntryMock4]);

      const fakeId1 = 124;
      const fakeId2 = 3;
      const fakeYesterday = "2022-04-20";

      const results1 = await TimeBankApiProvider.getDailyEntries(fakeId1, fakeYesterday, fakeYesterday, accessToken);
      const results2 = await TimeBankApiProvider.getDailyEntries(fakeId2, fakeYesterday, fakeYesterday, accessToken);

      expect(results1.balance).toBe(0);
      expect(results2.balance).toBe(-400);
    });

    it("Should print corresponding error to console if no person id", async () => {
      TestHelpers.mockTimebankDailyEntries(404, dailyEntryMock3)

      TimeBankApiProvider.getDailyEntries(null, "2022-04-22", "2022-04-22", accessToken);

      expect(consoleSpy).toHaveBeenCalledWith("Error: Invalid ID was given (expecting a number)")
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    it("Should return all time registrations if no date", async () => {
      TestHelpers.mockTimebankDailyEntries(200, dailyEntryArrayMock)

      let amountOfCalls = 0

      let result: DailyEntry[] = []; 
      for (let i = 0; i < dailyEntryArrayMock.length; i++) {
        result.push(await TimeBankApiProvider.getDailyEntries(1, undefined, undefined, accessToken));
        amountOfCalls++;
      }

      expect(result.length).toBe(5);
    });
  });

  describe("getTotalTimeEntries test", () => {
    const fakePerson1 = timebankUser1;
    const fakePerson2 = timebankUser2;

    const fakePersonTotalTime1 = timeTotalsMock1;
    const fakePersonTotalTime2 = timeTotalsMock2;
    const fakePersonTotalTime3 = timeTotalsMock4;

    const {  weekEndDate, weekStartDate } = TimeUtilities.lastWeekDateProvider();

    const fakeTimespan = Timespan.WEEK;
    const fakeYear = weekStartDate.year;
    const fakeWeek = weekEndDate.weekNumber;
    const fakeMonth = weekStartDate.month;

    it("Should return total time entries", async () => {
      TestHelpers.mockTimebankPersonTotalTimes(200, [fakePersonTotalTime1, fakePersonTotalTime2]);

      const result1 = await TimeBankApiProvider.getPersonTotalEntries(fakeTimespan, fakePerson1, fakeYear, fakeMonth, fakeWeek, accessToken);
      const result2 = await TimeBankApiProvider.getPersonTotalEntries(fakeTimespan, fakePerson2, fakeYear, fakeMonth, fakeWeek, accessToken);

      expect(result1.personId).toBe(1);
      expect(result1.name).toBe("tester test");
      expect(result1.selectedWeek.logged).toBe(2175);
      expect(result1.selectedWeek.expected).toBe(2175);
      expect(result1.selectedWeek.internalTime).toBe(2175);
      expect(result1.selectedWeek.projectTime).toBe(50);
      expect(result2.personId).toBe(3);
      expect(result2.name).toBe("tester3 test");
      expect(result2.selectedWeek.projectTime).toBe(75);
      expect(result2.selectedWeek.expected).toBe(100);
      expect(result2.selectedWeek.internalTime).toBe(25);
      expect(result2.selectedWeek.logged).toBe(100);
      expect(result2.selectedWeek.balance).toBe(0);
    });

    it("Should print corresponding error to console if no person id", () => {
      TestHelpers.mockTimebankPersonTotalTimes(404, fakePersonTotalTime1);

      fakePerson1.id = null;

      TimeBankApiProvider.getPersonTotalEntries(fakeTimespan, fakePerson1, fakeYear, fakeMonth, fakeWeek, accessToken);

      expect(consoleSpy).toHaveBeenCalledWith("Error: No ID on person");
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
  });
});