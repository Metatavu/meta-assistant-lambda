import TimeUtilities from "../features/generic/time-utils";
import { DailyCombinedData, NonProjectTime, TimeRegistrations } from "@functions/schema";
import { TimeEntryTotalDto } from "src/generated/client/api";
import { DateTime } from "luxon";

describe("time-utils functions testing", () => {
  const user1: DailyCombinedData = {
    name: "Kkona",
    firstName: "k",
    personId: 300,
    expected: 100,
    logged: 120,
    projectTime: 100,
    internalTime: 20,
    total: 20,
    date: "2022-19-04"
  };
  
  const user2: DailyCombinedData = {
    name: "Kkona",
    firstName: "k",
    personId: 300,
    expected: 100,
    logged: 80,
    projectTime: 80,
    internalTime: 0,
    total: -20,
    date: "2022-19-04"
  };
  
  const user3: DailyCombinedData = {
    name: "Kkona",
    firstName: "k",
    personId: 300,
    expected: 100,
    logged: 100,
    projectTime: 75,
    internalTime: 25,
    total: 0,
    date: "2022-19-04"
  };

  const user4: DailyCombinedData = {
    name: null,
    firstName: "k",
    personId: null,
    expected: null,
    logged: null,
    projectTime: null,
    internalTime: null,
    total: null,
    date: null
  };

  const user5 = null;

  const user6: DailyCombinedData = {
    name: "Kkona",
    firstName: "k",
    personId: 300,
    expected: 100,
    logged: 0,
    projectTime: 0,
    internalTime: 0,
    total: -100,
    date: "2022-19-04"
  };

  describe("calculateWorkedTimeAndBillableHours test", () => {
    it("Should return percentage of billable hours and overtime message", () =>{
      const result = TimeUtilities.calculateWorkedTimeAndBillableHours(user1);

      expect(result.message).toBe("Overtime: 0h 20 minutes");
      expect(result.billableHoursPercentage).toBe("83");
    });

    it("Should return percentage of billable hours and undertime message", () =>{
      const result = TimeUtilities.calculateWorkedTimeAndBillableHours(user2);

      expect(result.message).toBe("Undertime: 0h 20 minutes");
      expect(result.billableHoursPercentage).toBe("100");
    });

    it("Should return percentage of billable hours and message", () =>{
      const result = TimeUtilities.calculateWorkedTimeAndBillableHours(user3);

      expect(result.message).toBe("You worked the expected amount of time");
      expect(result.billableHoursPercentage).toBe("75");
    });

    it("should return NaN and You worked the expected amount of time message", () => {
      const result = TimeUtilities.calculateWorkedTimeAndBillableHours(user4);

      expect(result.billableHoursPercentage).toBe("NaN");
      expect(result.message).toBe("You worked the expected amount of time");
    });

    it("should return 0% billable hours and undertime message", () => {
      const result = TimeUtilities.calculateWorkedTimeAndBillableHours(user6);

      expect(result.billableHoursPercentage).toBe("0");
      expect(result.message).toBe("Undertime: 1h 40 minutes");
    });

    it("should throw an error if no user data", () => {
      expect(() => TimeUtilities.calculateWorkedTimeAndBillableHours(user5)).toThrow();
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
      const fakeUserData: TimeEntryTotalDto = {
        total: 0,
        logged: 435,
        expected: 435,
        internalTime: 100,
        projectTime: 335
      };
  
      const result = TimeUtilities.handleTimeConversion(fakeUserData);
      expect(result.displayExpected).toBe("7h 15 minutes");
      expect(result.displayInternal).toBe("1h 40 minutes");
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
});