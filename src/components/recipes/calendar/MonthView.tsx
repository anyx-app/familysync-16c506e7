import React from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarEvent, FamilyMember } from './data';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  members: FamilyMember[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
}

export function MonthView({ 
  currentDate, 
  events, 
  members,
  onEventClick,
  onDateClick 
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.start, date));
  };

  const getMemberColor = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.color : 'bg-gray-500';
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 grid-rows-5 flex-1 min-h-[600px]">
        {days.map((day, dayIdx) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div
              key={day.toString()}
              onClick={() => onDateClick?.(day)}
              className={cn(
                "min-h-[120px] p-2 border-b border-r relative transition-colors hover:bg-muted/20 cursor-pointer",
                !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                isToday(day) && "bg-accent/5",
                (dayIdx + 1) % 7 === 0 && "border-r-0" // Remove right border for last column
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={cn(
                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                    isToday(day) 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground"
                  )}
                >
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[100px]">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded truncate font-medium text-white shadow-sm transition-opacity hover:opacity-90",
                      getMemberColor(event.memberId)
                    )}
                    title={event.title}
                  >
                    {format(event.start, 'h:mm a')} {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

