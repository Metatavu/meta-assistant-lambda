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
  ALL_TIME = 'ALL_TIME',
  YEAR ='YEAR',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
}

/**
 * Allocations interface
 */
export interface Allocations{
  id: number;
  non_project_time: number;
  person: number;
  start_date: Date;
  end_date: Date;
  monday: number
  tuesday: number
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date
}

/**
 * non project time interface
 */
export interface NonProjectTime {
  id: number;
  name:string;
  is_internal_time:boolean;
  created_by:number;
  updated_by:number;
  created_at:string;
  updated_at:string;
}

/**
 * all persons allocations interface
 */
export interface AllPersonsAllocations {
  allocationId: number;
  allocationPerson: number;
  allocationNonProjectTime: number;
  allocationStartDate: Date;
  allocationEndDate: Date;
}
