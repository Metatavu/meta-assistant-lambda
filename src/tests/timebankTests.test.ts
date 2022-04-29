import { IncomingMessage } from "http";
import { Socket } from "net";
import TimeUtilities from "../features/generic/time-utils";
import TimeBankApiProvider from "../features/timebank/timebank-API-provider";
import { TimePeriod } from "../functions/schema";
import { timebankGetUsersMock2, timeEntryMock3, timeEntryMock4, timeEntryArrayMock, timebankUser1, timebankUser2, timeTotalsMock1, timeTotalsMock2 } from "./__mocks__/timebankMocks";

const message: IncomingMessage = new IncomingMessage(new Socket);
let timebankClient = TimeBankApiProvider.client;

beforeEach(() => {
  jest.resetAllMocks();
});

describe("timebank-api-provider tests", () => {
  describe("getTimebankUsers test", () => {
    const users = timebankGetUsersMock2;

    it("should return two timebank users", async () => {
      jest.spyOn(timebankClient, "timebankControllerGetPersons").mockReturnValueOnce(Promise.resolve({ response: message, body: users }));
      const results = await TimeBankApiProvider.getTimebankUsers();

      expect(results[0].id).toBe(1);
      expect(results[0].firstName).toBe("tester");
      expect(results[0].defaultRole).toBe(123);

      expect(results[1].id).toBe(3);
      expect(results[1].firstName).toBe("tester3");
      expect(results[1].defaultRole).toBe(124);

      expect(results.length).toBe(2);
    });
  });

  describe("getTimeEntries tests", () => {
    it("Should return person's time entries", async () => {
      const fakeTimeEntry1 = timeEntryMock3;
      const fakeTimeEntry2 = timeEntryMock4;

      const fakeId1 = 1;
      const fakeId2 = 3;
      const fakeYesterday = "2022-04-20";

      jest.spyOn(timebankClient, "timebankControllerGetEntries")
        .mockReturnValueOnce(Promise.resolve({ response: message, body: fakeTimeEntry1 }))
        .mockReturnValueOnce(Promise.resolve({ response: message, body: fakeTimeEntry2 }));

      const results1 = await TimeBankApiProvider.getTimeEntries(fakeId1, fakeYesterday, fakeYesterday);
      const results2 = await TimeBankApiProvider.getTimeEntries(fakeId2, fakeYesterday, fakeYesterday);

      expect(results1[0].total).toBe(0);

      expect(results2[0].total).toBe(-400);
    });

    it("Should throw error if no person id", async () => {
      const fakeTimeEntry = timeEntryMock3;

      const fakeId = null;
      const fakeYesterday = "2022-04-20";

      jest.spyOn(timebankClient, "timebankControllerGetEntries").mockReturnValueOnce(Promise.resolve({ response: message, body: fakeTimeEntry }));

      expect(async () => {
        await TimeBankApiProvider.getTimeEntries(fakeId, fakeYesterday, fakeYesterday);
      }).rejects.toThrow(TypeError);
    });

    it("Should return all time registrations if no date", async () => {
      const fakeTimeEntries = timeEntryArrayMock;

      const fakeId = 1;
      const fakeYesterday = undefined;

      jest.spyOn(timebankClient, "timebankControllerGetEntries").mockReturnValueOnce(Promise.resolve({ response: message, body: fakeTimeEntries }));

      const result = await TimeBankApiProvider.getTimeEntries(fakeId, fakeYesterday, fakeYesterday);
      expect(result.length).toBe(5);
    });
  });

  describe("getTotalTimeEntries test", () => {
    const fakePerson1 = timebankUser1;
    const fakePerson2 = timebankUser2;

    const fakeTimeEntryTotalDto1 = timeTotalsMock1;
    const fakeTimeEntryTotalDto2 = timeTotalsMock2;

    const {  weekEndDate, weekStartDate } = TimeUtilities.lastWeekDateProvider();

    let fakeTimePeriod = TimePeriod.WEEK;
    const fakeYear = weekStartDate.year;
    const fakeWeek = weekEndDate.weekNumber;

    it("Should return total time entries", async () => {
      jest.spyOn(timebankClient, "timebankControllerGetTotal")
        .mockReturnValueOnce(Promise.resolve({ response: message, body: fakeTimeEntryTotalDto1 }))
        .mockReturnValueOnce(Promise.resolve({ response: message, body: fakeTimeEntryTotalDto2 }));

      const result1 = await TimeBankApiProvider.getTotalTimeEntries(fakeTimePeriod, fakePerson1, fakeYear, fakeWeek);
      const result2 = await TimeBankApiProvider.getTotalTimeEntries(fakeTimePeriod, fakePerson2, fakeYear, fakeWeek);

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
      expect(result2.selectedWeek.total).toBe(0);
    });

    it("Should throw an error if no person id", () => {
      fakePerson1.id = null;
      jest.spyOn(timebankClient, "timebankControllerGetTotal").mockReturnValueOnce(Promise.resolve({ response: message, body: fakeTimeEntryTotalDto1 }));

      expect(async () => {
        await TimeBankApiProvider.getTotalTimeEntries(fakeTimePeriod, fakePerson1, fakeYear, fakeWeek);
      }).rejects.toThrow(TypeError);
      expect.assertions(1);
    });
  });
});