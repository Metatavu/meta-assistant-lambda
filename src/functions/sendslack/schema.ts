export default {
  type: "object",
  properties: {
    name: { type: 'string' }
  },
  required: ['name']
} as const;

export type PersonData = {
  id: number;
  first_name: string;
  last_name: string;
}

export type TimeData = {
  person: number;
  date: string;
  expected: number;
  logged: number;
}

export type UseTimebankData = {
  expected: number;
    logged: number;
    Pid: number;
    date: string;
    id: number;
    name: string;
}

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
export type TimeEntryTotalDto = {
  id: number;
  total: number;
  logged: number;
  expected: number;
  internalTime: number;
  projectTime: number;
}

export interface TimeEntry {
  externalId: string;
  person: number;
  internalTime: number;
  projectTime: number;
  logged: number;
  expected: number;
  total: number;
  date: string;
}

export type TimeEntryTotalId = {
  year: number;
  month: number;
  week: number;
}