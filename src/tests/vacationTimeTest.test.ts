/* eslint-disable max-len */
import TimeUtilities from "src/features/generic/time-utils";
import { NonProjectTime, TimeRegistrations } from "src/functions/schema";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("vacation time tests", () => {
  it("not on vacation, should return false", () => {
    const fakeTimeRegistrations: TimeRegistrations[] = [
      {
        id: 100,
        person: 1,
        non_project_time: 1,
        time_registered: 100,
        date: "2022-04-20",
        approval_status: "APPROVED"
      },
      {
        id: 101,
        person: 2,
        non_project_time: 2,
        time_registered: 50,
        date: "2022-04-20",
        approval_status: "APPROVED"
      }
    ];

    const fakeProjectTimes: NonProjectTime[] = [
      {
        id: 1,
        name: "vacation",
        is_internal_time: false
      },
      {
        id: 2,
        name: "something",
        is_internal_time: false
      }
    ];

    const fakePersonId = 2;
    const fakeExpected = 100;
    const fakeDate = "2022-04-20";

    const result = TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(fakeTimeRegistrations, fakePersonId, fakeExpected, fakeDate, fakeProjectTimes);

    expect(result).toBe(false);
  });

  it("on vacation, should return true", () => {
    const fakeTimeRegistrations: TimeRegistrations[] = [
      {
        id: 100,
        person: 1,
        non_project_time: 1,
        time_registered: 100,
        date: "2022-04-20",
        approval_status: "APPROVED"
      },
      {
        id: 101,
        person: 2,
        non_project_time: 2,
        time_registered: 50,
        date: "2022-04-20",
        approval_status: "APPROVED"
      }
    ];

    const fakeProjectTimes: NonProjectTime[] = [
      {
        id: 1,
        name: "vacation",
        is_internal_time: false
      },
      {
        id: 2,
        name: "something",
        is_internal_time: false
      }
    ];

    const fakePersonId = 1;
    const fakeExpected = 100;
    const fakeDate = "2022-04-20";

    const result = TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(fakeTimeRegistrations, fakePersonId, fakeExpected, fakeDate, fakeProjectTimes);

    expect(result).toBe(true);
  });

  it("should throw an error if no non project times", () => {
    const fakeTimeRegistrations: TimeRegistrations[] = [
      {
        id: 100,
        person: 1,
        non_project_time: 1,
        time_registered: 100,
        date: "2022-04-20",
        approval_status: "APPROVED"
      },
      {
        id: 101,
        person: 2,
        non_project_time: 2,
        time_registered: 29,
        date: "2022-04-20",
        approval_status: "APPROVED"
      }
    ];

    const fakeProjectTimes = undefined;

    const fakePersonId1 = 1;
    const fakeExpected = 100;
    const fakeDate = "2022-04-20";

    expect(() => TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(fakeTimeRegistrations, fakePersonId1, fakeExpected, fakeDate, fakeProjectTimes)).toThrow(TypeError);
  });

  it("should return false if no person id, expected and date", () => {
    const fakeTimeRegistrations: TimeRegistrations[] = [
      {
        id: 100,
        person: 1,
        non_project_time: 1,
        time_registered: 435,
        date: "2022-04-20",
        approval_status: "APPROVED"
      },
      {
        id: 101,
        person: 2,
        non_project_time: 2,
        time_registered: 100,
        date: "2022-04-20",
        approval_status: "APPROVED"
      }
    ];

    const fakeProjectTimes: NonProjectTime[] = [
      {
        id: 1,
        name: "vacation",
        is_internal_time: false
      },
      {
        id: 2,
        name: "something",
        is_internal_time: false
      }
    ];

    const fakePersonId1 = undefined;
    const fakeExpected = undefined;
    const fakeDate = undefined;

    const result = TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(fakeTimeRegistrations, fakePersonId1, fakeExpected, fakeDate, fakeProjectTimes);
    expect(result).toBe(false);
  });

  it("should throw an error if no time registrations", () => {
    const fakeTimeRegistrations = null;

    const fakeProjectTimes: NonProjectTime[] = [
      {
        id: 1,
        name: "vacation",
        is_internal_time: false
      },
      {
        id: 2,
        name: "something",
        is_internal_time: false
      }
    ];

    const fakePersonId1 = 1;
    const fakeExpected = 435;
    const fakeDate = "2022-04-20";

    expect(() => TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(fakeTimeRegistrations, fakePersonId1, fakeExpected, fakeDate, fakeProjectTimes)).toThrow(TypeError);
  });

  it("should return false", () => {
    const fakeTimeRegistrations: TimeRegistrations[] = [
      {
        id: 100,
        person: 1,
        non_project_time: 1,
        time_registered: 435,
        date: "2022-04-20",
        approval_status: "APPROVED"
      },
      {
        id: 101,
        person: 2,
        non_project_time: 2,
        time_registered: 100,
        date: "2022-04-20",
        approval_status: "APPROVED"
      }
    ];

    const fakeProjectTimes: NonProjectTime[] = [
      {
        id: 1,
        name: "vacation",
        is_internal_time: false
      },
      {
        id: 2,
        name: "something",
        is_internal_time: false
      }
    ];

    const fakePersonId1 = NaN;
    const fakeExpected = NaN;
    const fakeDate = null;

    const result = TimeUtilities.checkIfUserIsAwayOrIsItFirstDayBack(fakeTimeRegistrations, fakePersonId1, fakeExpected, fakeDate, fakeProjectTimes);
    expect(result).toBe(false);
  });
});