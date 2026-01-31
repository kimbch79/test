
import { Schedule } from '../types';

const STORAGE_PREFIX = 'vm_edu_calendar_';

export const saveSchedules = (code: string, schedules: Schedule[]) => {
  localStorage.setItem(`${STORAGE_PREFIX}${code}`, JSON.stringify(schedules));
};

export const loadSchedules = (code: string): Schedule[] => {
  const data = localStorage.getItem(`${STORAGE_PREFIX}${code}`);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse schedules', e);
    return [];
  }
};

export const clearSchedules = (code: string) => {
  localStorage.removeItem(`${STORAGE_PREFIX}${code}`);
};
