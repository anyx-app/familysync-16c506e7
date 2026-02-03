import { addDays, setHours, setMinutes, subDays } from "date-fns";

export interface FamilyMember {
  id: string;
  name: string;
  color: string; // Tailwind class or hex
  avatar?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  memberId: string;
  description?: string;
  location?: string;
  isAllDay?: boolean;
}

export const FAMILY_MEMBERS: FamilyMember[] = [
  { id: "1", name: "Mom", color: "bg-pink-500" },
  { id: "2", name: "Dad", color: "bg-blue-500" },
  { id: "3", name: "Kids", color: "bg-green-500" },
  { id: "4", name: "Family", color: "bg-purple-500" },
];

const today = new Date();

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Soccer Practice",
    start: setHours(setMinutes(today, 0), 16), // 4:00 PM
    end: setHours(setMinutes(today, 30), 17), // 5:30 PM
    memberId: "3",
    location: "City Field",
    description: "Don't forget shin guards!",
  },
  {
    id: "2",
    title: "Grocery Run",
    start: setHours(setMinutes(addDays(today, 1), 0), 10), // Tomorrow 10:00 AM
    end: setHours(setMinutes(addDays(today, 1), 0), 11), // Tomorrow 11:00 AM
    memberId: "2",
    description: "Weekly essentials",
  },
  {
    id: "3",
    title: "Family Dinner",
    start: setHours(setMinutes(subDays(today, 1), 0), 18), // Yesterday 6:00 PM
    end: setHours(setMinutes(subDays(today, 1), 0), 20), // Yesterday 8:00 PM
    memberId: "4",
    location: "Home",
  },
  {
    id: "4",
    title: "Dentist Appt",
    start: setHours(setMinutes(addDays(today, 2), 30), 14), // Day after tomorrow 2:30 PM
    end: setHours(setMinutes(addDays(today, 2), 15), 15), // Day after tomorrow 3:15 PM
    memberId: "1",
    location: "Dr. Smith",
  },
  {
    id: "5",
    title: "School Play",
    start: setHours(setMinutes(addDays(today, 5), 0), 19),
    end: setHours(setMinutes(addDays(today, 5), 0), 21),
    memberId: "3",
    isAllDay: false,
  },
];

