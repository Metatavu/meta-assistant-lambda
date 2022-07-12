import { ChatPostMessageResponse } from "@slack/web-api/dist/response/ChatPostMessageResponse";
import { DateTime } from "luxon";
import { PersonTotalTime } from "src/generated/client/api";

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
  date: string;
  balance: number;
  slackId?: string;
}

/**
 * WeeklyCombinedData interface
 */
export interface WeeklyCombinedData {
  selectedWeek: PersonTotalTime;
  name: string;
  firstName: string;
  email: string;
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
 * Interface for DisplayValues
 */
export interface DisplayValues {
  logged: string;
  expected: string;
  difference: string;
  project: string;
  internal: string;
}

/**
 * Interface for calculateWorkedTimeAndBillableHours
 */
export interface CalculateWorkedTimeAndBillableHoursResponse {
  message: string;
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

/**
 * Interface for Weekly Message Result
 */
export interface WeeklyMessageResult {
  message: WeeklyMessageData;
  response: ChatPostMessageResponse;
}

/**
 * Interface for Daily Message Result
 */
export interface DailyMessageResult {
  message: DailyMessageData;
  response: ChatPostMessageResponse;
}

/**
 * Interface for Parsed Access Token
 */
export interface ParsedAccessToken {
  accessToken: string;
}

/**
 * Interface for Last Sprint Dates
 */
export interface LastSprintDates {
  sprintStart: string;
  sprintEnd: string;
}

/**
 * Interface for MailData
 */
export interface MailData {
  sprintStartWeek: number;
  sprintEndWeek: number;
  sprintYear: number;
  name: string;
  percentage: number;
  recipients: string[];
}

/**
 * Interface for SprintCombinedData
 */
export interface SprintCombinedData {
  name: string;
  internalTime: string;
  projectTime: string;
  logged: string;
  expected: string;
  balance: string;
  mailData: MailData;
}