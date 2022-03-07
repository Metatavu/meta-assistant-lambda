/**
 * Serverless schema type
 */
export default {
  type: "object",
  properties: {
    name: { type: 'string' }
  },
  required: ['name']
} as const;

/**
 * PersonDto type
 */
export type PersonDto = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  client_id: number;
  holiday_calendar_id: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  active: boolean;
  default_role: number;
  cost: number;
  language: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  start_date: string;
}

/**
 * TimeEntry type
 */
export type TimeEntry = {
  externalId: string;
  person: number;
  internalTime: number;
  projectTime: number;
  logged: number;
  expected: number;
  total: number;
  date: string;
}

/**
 * FormattedTimebankData interface
 */
 export interface FormattedTimebankData {
  id: number;
  name: string;
  expected: number;
  logged: number;
  date: string;
  weekly?: boolean;
}