import { DateTime } from "luxon";
import { NonProjectTime, TimeRegistrations } from "src/functions/schema";

export const forecastMockNonProjectTime: NonProjectTime[] = [
  {
    id : 123,
    name: "vacation",
    is_internal_time : false
  },
  {
    id : 124,
    name: "not vacation",
    is_internal_time : true
  },
  {
    id : 456,
    name: "something",
    is_internal_time : false
  }
];

const date = DateTime.now();

export const mockForecastTimeRegistrations: TimeRegistrations[] = [
  {
    id: 16841456,
    person: 1,
    project: null,
    non_project_time: 228255,
    time_registered: 435,
    date: "2022-04-20",
    approval_status: "APPROVED"
  },
  {
    id: 17753014,
    person: 2,
    project: null,
    non_project_time: 280335,
    time_registered: 433,
    date: "2022-04-20",
    approval_status: "APPROVED"
  },
  {
    id: 17753014,
    person: 3,
    project: 86676,
    non_project_time: null,
    time_registered: 433,
    date: "2022-04-20",
    approval_status: "APPROVED"
  },
  {
    id: 17753014,
    person: 4,
    project: null,
    non_project_time: 123,
    time_registered: 433,
    date: "2022-04-20",
    approval_status: "APPROVED"
  },
  {
    id: 123,
    person: 123,
    non_project_time: 345,
    time_registered: 456,
    date: "22,22,22",
    approval_status: "sure"
  },
  {
    id: 100,
    person: 124,
    non_project_time: 123,
    time_registered: 100,
    date: date.toISODate(),
    approval_status: "sure"
  }
];

export const emptyTimeRegistrationsArray: TimeRegistrations[] = [
  {
    id: 4040,
    person: 1244,
    non_project_time: null,
    time_registered: 600,
    date: "22,22,22",
    approval_status: "sure"
  }
];

//Forecast error mock 1
export const forecastErrorMock = [
  {
    status: 401,
    message: "Server failed to authenticate the request."
  },
  {
    status: 401,
    message: "Server failed to authenticate the request."
  }
];

//Forecast error mock 2
export const emptyNonProjecTimeArray: NonProjectTime[] = [
  {
    id: 4040,
    name: "something",
    is_internal_time: true
  }
];