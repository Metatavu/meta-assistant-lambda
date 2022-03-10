import { DateTime } from "luxon";
import { TimeEntryTotalDto } from "src/generated/client/api";

/**
 * Serverless schema type
 */
export default {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
} as const;

/**
 * DailyCombinedData interface
 */
export interface DailyCombinedData {
  name: string;
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
  slackId?: string;
}

/**
 * WeeklyFormattedTimebankData interface- for use in future weeklyBreakdwon functionality
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
  ALL_TIME = 'ALL_TIME',
  YEAR ='YEAR',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
}