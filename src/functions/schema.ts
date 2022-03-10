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
  id: number;
  name: string;
  expected: number;
  logged: number;
  project: number;
  internal: number;
  difference: number;
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
 * Dates interface
 */
export interface Dates {
  numberedYear: number;
  numberedWeek: number;
  weekStartString: string;
  weekEndString: string;
}
