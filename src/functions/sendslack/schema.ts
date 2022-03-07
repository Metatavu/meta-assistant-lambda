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
 * FormattedTimebankData interface
 */
export interface FormattedTimebankData {
  id: number;
  name: string;
  expected: number;
  logged: number;
  date: string;
  slackId?: string;
}