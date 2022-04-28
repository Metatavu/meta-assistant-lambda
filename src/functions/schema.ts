import { DateTime } from "luxon";
import { TimeEntryTotalDto } from "src/generated/client/api";

/**
 * Serverless schema type
 */
export default {
  type: "object",
  properties: {
    name: { type: "string" }
  },
  required: ["name"]
} as const;

/**
 * DailyCombinedData interface
 */
export interface DailyCombinedData {
  name: string;
  firstName: string;
  personId: number;
  expected: number;
  logged: number;
  projectTime: number;
  internalTime: number;
  total: number;
  date: string;
  slackId?: string;
}

/**
 * WeeklyCombinedData interface
 */
export interface WeeklyCombinedData {
  selectedWeek: TimeEntryTotalDto;
  name: string;
  firstName: string;
  slackId?: string;
  personId: number;
  expected: number;
}

/**
 * WeeklyFormattedTimebankData interface- for use in future weeklyBreakdown functionality
 */
export interface WeeklyBreakdownCombinedData {
  totals: DailyCombinedData;
  multiplePersonTimeEntries: DailyCombinedData[];
}

/**
 * Dates interface
 */
export interface Dates {
  weekStartDate: DateTime;
  weekEndDate: DateTime;
}

/**
 * Enum for TimePeriod
 */
export enum TimePeriod {
  ALL_TIME = "ALL_TIME",
  YEAR ="YEAR",
  MONTH = "MONTH",
  WEEK = "WEEK"
}

/**
* Interface for time registrations
*/
export interface TimeRegistrations {
  id: number;
  person: number;
  project?: number;
  non_project_time: number;
  time_registered: number;
  date: string;
  approval_status: string;
}
/**
 * Interface for dates
 */
export interface PreviousWorkdayDates {
  today: string;
  yesterday: string;
  numberOfToday: number;
  dayBeforeYesterday: string;
}

/**
 * Interface for non project time
 */
export interface NonProjectTime {
  id: number;
  name: string;
  is_internal_time: boolean;
}

/**
 * Interface for Daily Message Data
 */
export interface DailyMessageData {
  message: string;
  name: string;
  displayDate?: string;
  displayLogged: string;
  displayExpected: string;
  displayProject: string;
  displayInternal: string;
  billableHoursPercentage: string;
}

/**
 * Interface for Weekly Message Data
 */
export interface WeeklyMessageData {
  message: string;
  name: string;
  week: number,
  startDate: string,
  endDate: string,
  displayLogged: string;
  displayExpected: string;
  displayProject: string;
  displayInternal: string;
  billableHoursPercentage: string;
}