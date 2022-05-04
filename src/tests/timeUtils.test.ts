import TimeUtilities from "../features/generic/time-utils";
import { DateTime } from "luxon";
import { dailyCombinedDataMock1, dailyCombinedDataMock2, dailyCombinedDataMock3, dailyCombinedDataMock4, dailyCombinedDataMock5, timeTotalsMock } from "./__mocks__/timebankMocks";

describe("time-utils functions testing", () => {
  describe("calculateWorkedTimeAndBillableHours test", () => {
    const results1 = TimeUtilities.calculateWorkedTimeAndBillableHours(dailyCombinedDataMock1);
    const results2 = TimeUtilities.calculateWorkedTimeAndBillableHours(dailyCombinedDataMock2);
    const results3 = TimeUtilities.calculateWorkedTimeAndBillableHours(dailyCombinedDataMock3);
    const results4 = TimeUtilities.calculateWorkedTimeAndBillableHours(dailyCombinedDataMock4);

    it("Should return correct worked time and percentage of billable hours", () => {
      expect(results1.billableHoursPercentage).toBe("100");
      expect(results1.message).toBe("You worked the expected amount of time");

      expect(results2.billableHoursPercentage).toBe("0");
      expect(results2.message).toBe("Undertime: 0h 50 minutes");

      expect(results3.billableHoursPercentage).toBe("50");
      expect(results3.message).toBe("You worked the expected amount of time");

      expect(results4.billableHoursPercentage).toBe("67");
      expect(results4.message).toBe("Overtime: 0h 50 minutes");
    });

    it("should throw an error if no user data", () => {
      expect(() => TimeUtilities.calculateWorkedTimeAndBillableHours(dailyCombinedDataMock5)).toThrow();
    });
  });

  describe("timeConversion tests", () => {
    it("should return 1h 40 minutes", () => {
      const duration = 100;

      const result = TimeUtilities.timeConversion(duration);

      expect(result).toBe("1h 40 minutes");
    });

    it("should return 0h 0 minutes if duration is undefined or null", () => {
      const duration = undefined;

      const result = TimeUtilities.timeConversion(duration);
      expect(result).toBe("0h 0 minutes");

      const duration2 = null;

      const result2 = TimeUtilities.timeConversion(duration2);
      expect(result2).toBe("0h 0 minutes");
    });

    it("should throw an error if duration is NaN", () => {
      const duration = NaN;

      expect(() => TimeUtilities.timeConversion(duration)).toThrow();
    });
  });

  describe("handleTimeConversion test", () => {
    it("should return converted times", () => {
      const fakeUserData = timeTotalsMock;

      const result = TimeUtilities.handleTimeConversion(fakeUserData);
      expect(result.displayExpected).toBe("2h 0 minutes");
      expect(result.displayInternal).toBe("1h 0 minutes");
      expect(result.displayLogged).toBe("1h 0 minutes");
      expect(result.displayProject).toBe("1h 0 minutes");
      expect(result.displayDifference).toBe("0h 0 minutes");
    });

    it("should throw an error if no user data", () => {
      const fakeUserData = undefined;

      expect(() => TimeUtilities.handleTimeConversion(fakeUserData)).toThrow();
    });
  });

  describe("laskWeekDateProvider test", () => {
    const startOfWeek = DateTime.now().startOf("week");

    const fakeWeekStartDate = startOfWeek.minus({ weeks: 1 });
    const fakeWeekEndDate = startOfWeek.minus({ days: 1 });

    const results = TimeUtilities.lastWeekDateProvider();

    expect(results.weekStartDate).toEqual(fakeWeekStartDate);
    expect(results.weekEndDate).toEqual(fakeWeekEndDate);
  });

  describe("getPreviousTwoWorkDays test", () => {
    const fakeToday = DateTime.now();
    const fakeDayOfWeek = new Date().getDay();

    let fakePreviousWorkDay = fakeToday.minus({ days: 1 }).toISODate();
    let fakeDayBeforePreviousWorkDay = fakeToday.minus({ days: 2 }).toISODate();

    if (fakeDayOfWeek === 1) {
      fakePreviousWorkDay = fakeToday.minus({ days: 3 }).toISODate();
      fakeDayBeforePreviousWorkDay = fakeToday.minus({ days: 4 }).toISODate();
    }

    const results = TimeUtilities.getPreviousTwoWorkdays();

    expect(results.dayBeforeYesterday).toEqual(fakeDayBeforePreviousWorkDay);
    expect(results.numberOfToday).toEqual(fakeDayOfWeek);
    expect(results.today).toEqual(fakeToday.toISODate());
    expect(results.yesterday).toEqual(fakePreviousWorkDay);
  });

  describe("getPreviousTwoWorkDays test when week day is 1", () => {
    const fakeToday = DateTime.now().set({ day: 2, month: 1, year: 2022 });
    const fakeDayOfWeek = 1;

    let fakePreviousWorkDay = fakeToday.minus({ days: 1 }).toISODate();
    let fakeDayBeforePreviousWorkDay = fakeToday.minus({ days: 2 }).toISODate();

    if (fakeDayOfWeek === 1) {
      fakePreviousWorkDay = fakeToday.minus({ days: 3 }).toISODate();
      fakeDayBeforePreviousWorkDay = fakeToday.minus({ days: 4 }).toISODate();
    }

    const results = TimeUtilities.getPreviousTwoWorkdays(fakeToday, fakeDayOfWeek);

    expect(results.dayBeforeYesterday).toEqual(fakeDayBeforePreviousWorkDay);
    expect(results.numberOfToday).toEqual(fakeDayOfWeek);
    expect(results.today).toEqual(fakeToday.toISODate());
    expect(results.yesterday).toEqual(fakePreviousWorkDay);
  });
});