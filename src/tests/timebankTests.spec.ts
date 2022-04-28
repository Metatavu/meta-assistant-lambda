import { IncomingMessage } from "http";
import { Socket } from "net";
import TimeUtilities from "../features/generic/time-utils";
import TimeBankApiProvider from "../features/timebank/timebank-API-provider";
import { PersonDto, TimeEntryTotalDto, TimeEntryTotalId } from "../generated/client/api";
import { TimePeriod } from "../functions/schema";
import { timebankGetUsersMock2, timeEntryMock3, timeEntryMock4, timeEntryArrayMock } from "./__mocks__/timebankMocks";

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
    let person1: PersonDto = {
      id: 13,
      firstName:"tester",
      lastName: "test",
      email: "test",
      userType: "test",
      clientId: 123,
      holidayCalendarId: 123,
      monday: 123,
      tuesday: 123,
      wednesday: 123,
      thursday: 123,
      friday: 123,
      saturday: 123,
      sunday: 123,
      active: true,
      defaultRole: 123,
      cost: 123,
      language: "test",
      createdBy: 123,
      updatedBy: 123,
      createdAt: new Date,
      updatedAt: new Date,
      startDate: "test"
    };

    let person2: PersonDto = {
      id: 14,
      firstName:"k",
      lastName: "kk",
      email: "kk@",
      userType: "test",
      clientId: 123,
      holidayCalendarId: 123,
      monday: 200,
      tuesday: 200,
      wednesday: 200,
      thursday: 200,
      friday: 200,
      saturday: 0,
      sunday: 0,
      active: true,
      defaultRole: 123,
      cost: 123,
      language: "test",
      createdBy: 123,
      updatedBy: 123,
      createdAt: new Date,
      updatedAt: new Date,
      startDate: "test"
    };

    const fakeTimeEntryTotalId: TimeEntryTotalId = {
      year: 2022,
      month: undefined,
      week: 16
    };

    const fakeTimeEntryTotalDto1: TimeEntryTotalDto[] = [
      {
        id: fakeTimeEntryTotalId,
        total: 0,
        logged: 300,
        expected: 300,
        internalTime: 100,
        projectTime: 200
      }
    ];

    const fakeTimeEntryTotalDto2: TimeEntryTotalDto[] = [
      {
        id: fakeTimeEntryTotalId,
        total: 0,
        logged: 0,
        expected: 300,
        internalTime: 0,
        projectTime: 0
      }
    ];

    const {  weekEndDate, weekStartDate } = TimeUtilities.lastWeekDateProvider();

    let fakeTimePeriod = TimePeriod.WEEK;
    const fakePerson1 = person1;
    const fakePerson2 = person2;
    const fakeYear = weekStartDate.year;
    const fakeWeek = weekEndDate.weekNumber;

    it("Should return total time entries", async () => {
      jest.spyOn(timebankClient, "timebankControllerGetTotal")
        .mockReturnValueOnce(Promise.resolve({ response: message, body: fakeTimeEntryTotalDto1 }))
        .mockReturnValueOnce(Promise.resolve({ response: message, body: fakeTimeEntryTotalDto2 }));

      const result1 = await TimeBankApiProvider.getTotalTimeEntries(fakeTimePeriod, fakePerson1, fakeYear, fakeWeek);
      const result2 = await TimeBankApiProvider.getTotalTimeEntries(fakeTimePeriod, fakePerson2, fakeYear, fakeWeek);

      expect(result1.personId).toBe(13);
      expect(result1.name).toBe("tester test");
      expect(result1.selectedWeek.logged).toBe(300);
      expect(result1.selectedWeek.expected).toBe(300);
      expect(result1.selectedWeek.internalTime).toBe(100);
      expect(result1.selectedWeek.projectTime).toBe(200);

      expect(result2.personId).toBe(14);
      expect(result2.name).toBe("k kk");
      expect(result2.selectedWeek.projectTime).toBe(0);
      expect(result2.selectedWeek.expected).toBe(300);
      expect(result2.selectedWeek.internalTime).toBe(0);
      expect(result2.selectedWeek.logged).toBe(0);
      expect(result1.selectedWeek.total).toBe(0);
    });

    it("Should throw an error if no person id", () => {
      person1.id = null;
      jest.spyOn(timebankClient, "timebankControllerGetTotal").mockReturnValueOnce(Promise.resolve({ response: message, body: fakeTimeEntryTotalDto1 }));

      expect(async () => {
        await TimeBankApiProvider.getTotalTimeEntries(fakeTimePeriod, fakePerson1, fakeYear, fakeWeek);
      }).rejects.toThrow(TypeError);
      expect.assertions(1);
    });
  });
});