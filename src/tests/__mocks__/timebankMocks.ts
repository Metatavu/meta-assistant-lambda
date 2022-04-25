import { PersonDto, TimeEntry } from "src/generated/client/api";

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
}];

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