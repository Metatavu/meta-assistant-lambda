import TimeUtilities from "src/features/generic/time-utils";
import { PersonDto, TimeEntry, TimeEntryTotalDto } from "src/generated/client/api";

export const timebankGetUsersMock: PersonDto[] = [{
  id: 123,
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
},
{
  id: 4040,
  firstName:"Meta",
  lastName: "T",
  email: "me@here",
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
},
{
  id: 124,
  firstName:"on",
  lastName: "vacation",
  email: "me@vacation",
  userType: "test",
  clientId: 123,
  holidayCalendarId: 123,
  monday: 100,
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
}
];

export const timebankGetUsersMock2: PersonDto[] = [
  {
    id: 1,
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
  },
  {
    id: 2,
    firstName:"tester2",
    lastName: "test",
    email: "test2",
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
    defaultRole: null,
    cost: 123,
    language: "test",
    createdBy: 123,
    updatedBy: 123,
    createdAt: new Date,
    updatedAt: new Date,
    startDate: "test"
  },
  {
    id: 3,
    firstName:"tester3",
    lastName: "test",
    email: "test3",
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
    defaultRole: 124,
    cost: 123,
    language: "test",
    createdBy: 123,
    updatedBy: 123,
    createdAt: new Date,
    updatedAt: new Date,
    startDate: "test"
  }
];

export const timeEntryMock1: TimeEntry[] = [
  {
    externalId: "tester",
    person: 123,
    internalTime: 123,
    projectTime: 100,
    logged: 123,
    expected: 123,
    total: 1,
    date: new Date
  }
];

export const timeEntryMock2: TimeEntry[] = [
  {
    externalId: "MetaT",
    person: 4040,
    internalTime: 600,
    projectTime: 500,
    logged: 600,
    expected: 500,
    total: 123,
    date: new Date
  }
];

export const timeEntryMock3: TimeEntry[] = [
  {
    externalId: "tester2",
    person: 124,
    internalTime: 0,
    projectTime: 0,
    logged: 0,
    expected: 100,
    total: 0,
    date: new Date
  }
];

export const timeEntryMock4: TimeEntry[] = [
  {
    externalId: "tester3",
    person: 3,
    internalTime: 600,
    projectTime: 0,
    logged: 600,
    expected: 1000,
    total: -400,
    date: new Date
  }
];

export const timeEntryArrayMock: TimeEntry[] = [
  {
    externalId: "tester",
    person: 1,
    internalTime: 76,
    projectTime: 0,
    logged: 600,
    expected: 1000,
    total: 100,
    date: new Date
  },
  {
    externalId: "tester3",
    person: 3,
    internalTime: 600,
    projectTime: 0,
    logged: 600,
    expected: 1000,
    total: -400,
    date: new Date
  },
  {
    externalId: "tester3",
    person: 3,
    internalTime: 600,
    projectTime: 0,
    logged: 600,
    expected: 1000,
    total: 10,
    date: new Date
  },
  {
    externalId: "tester3",
    person: 3,
    internalTime: 600,
    projectTime: 0,
    logged: 600,
    expected: 1000,
    total: 100,
    date: new Date
  },
  {
    externalId: "MetaT",
    person: 4040,
    internalTime: 600,
    projectTime: 500,
    logged: 600,
    expected: 500,
    total: 123,
    date: new Date
  }
];

const { weekStartDate, weekEndDate } = TimeUtilities.lastWeekDateProvider();

export const timeTotalsMock1: TimeEntryTotalDto[] = [
  {
    id: {
      year: weekStartDate.year,
      week: weekEndDate.weekNumber
    },
    total: 32,
    logged: 2175,
    expected: 2175,
    internalTime: 2175,
    projectTime: 50
  }
];

export const timeTotalsMock2: TimeEntryTotalDto[] = [
  {
    id: {
      year: weekStartDate.year,
      week: weekEndDate.weekNumber
    },
    total: 0,
    logged: 100,
    expected: 100,
    internalTime: 25,
    projectTime: 75
  }
];

export const timeTotalsMock3: TimeEntryTotalDto[] = [
  {
    id: {
      year: weekStartDate.year,
      week: weekEndDate.weekNumber
    },
    total: 0,
    logged: 0,
    expected: 100,
    internalTime: 0,
    projectTime: 0
  }
];