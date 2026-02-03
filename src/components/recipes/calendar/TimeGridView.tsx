import React, { useEffect, useRef } from 'react';
import { 
  format, 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  differenceInMinutes, 
  startOfDay, 
  isToday,
  setHours,
  setMinutes
} from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarEvent, FamilyMember } from './data';

interface TimeGridViewProps {
  currentDate: Date;
  view: 'week' | 'day';
  events: CalendarEvent[];
  members: FamilyMember[];
  onEventClick?: (event: CalendarEvent) => void;
  onTimeSlotClick?: (date: Date) => void;
}

export function TimeGridView({ 
  currentDate, 
  view, 
  events, 
  members,
  onEventClick,
  onTimeSlotClick 
}: TimeGridViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate days based on view
  const days = view === 'week' 
    ? eachDayOfInterval({
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate),
      })
    : [currentDate];

  // Time slots (6 AM to 10 PM)
  const startHour = 6;
  const endHour = 22;
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  // Scroll to 8 AM on mount
  useEffect(() => {
    if (containerRef.current) {
      const hourHeight = 60; // px per hour
      const scrollTo = (8 - startHour) * hourHeight;
      containerRef.current.scrollTop = scrollTo;
    }
  }, []);

  const getMemberColor = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.color : 'bg-gray-500';
  };

  const getEventStyle = (event: CalendarEvent) => {
    const start = event.start;
    const end = event.end;
    
    // Calculate position relative to startHour
    const startMinutes = differenceInMinutes(start, setMinutes(setHours(start, startHour), 0));
    const durationMinutes = differenceInMinutes(end, start);
    
    // 60px per hour = 1px per minute
    const top = Math.max(0, startMinutes);
    const height = Math.max(20, durationMinutes); // Minimum height for visibility

    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.start, date) && !event.isAllDay);
  };

  const getAllDayEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.start, date) && event.isAllDay);
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      {/* Header (Days) */}
      <div className="flex border-b bg-muted/30">
        <div className="w-16 flex-shrink-0 border-r bg-background" /> {/* Time column spacer */}
        <div className={cn("grid flex-1", view === 'week' ? "grid-cols-7" : "grid-cols-1")}>
          {days.map((day) => (
            <div 
              key={day.toString()} 
              className={cn(
                "p-2 text-center border-r last:border-r-0",
                isToday(day) && "bg-accent/5"
              )}
            >
              <div className="text-xs font-medium text-muted-foreground uppercase">
                {format(day, 'EEE')}
              </div>
              <div className={cn(
                "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mt-1",
                isToday(day) ? "bg-primary text-primary-foreground" : "text-foreground"
              )}>
                {format(day, 'd')}
              </div>
              
              {/* All Day Events */}
              <div className="mt-1 space-y-1">
                {getAllDayEventsForDay(day).map(event => (
                  <div 
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className={cn(
                      "text-[10px] px-1 py-0.5 rounded truncate text-white cursor-pointer",
                      getMemberColor(event.memberId)
                    )}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Grid */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto relative"
      >
        <div className="flex min-h-[960px]"> {/* 16 hours * 60px */}
          {/* Time Labels */}
          <div className="w-16 flex-shrink-0 border-r bg-background sticky left-0 z-10">
            {hours.map((hour) => (
              <div key={hour} className="h-[60px] border-b text-xs text-muted-foreground text-right pr-2 pt-1 relative">
                <span className="-top-2.5 relative bg-background px-1">
                  {format(setHours(new Date(), hour), 'h a')}
                </span>
              </div>
            ))}
          </div>

          {/* Grid Columns */}
          <div className={cn("grid flex-1", view === 'week' ? "grid-cols-7" : "grid-cols-1")}>
            {days.map((day) => (
              <div 
                key={day.toString()} 
                className={cn(
                  "relative border-r last:border-r-0",
                  isToday(day) && "bg-accent/5"
                )}
              >
                {/* Hour Lines */}
                {hours.map((hour) => (
                  <div 
                    key={hour} 
                    className="h-[60px] border-b border-dashed border-muted/50"
                    onClick={() => onTimeSlotClick?.(setHours(day, hour))}
                  />
                ))}

                {/* Events */}
                {getEventsForDay(day).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    style={getEventStyle(event)}
                    className={cn(
                      "absolute left-1 right-1 rounded p-1 text-xs text-white overflow-hidden cursor-pointer hover:opacity-90 z-10 shadow-sm border border-white/20",
                      getMemberColor(event.memberId)
                    )}
                  >
                    <div className="font-semibold truncate">{event.title}</div>
                    <div className="truncate opacity-90">
                      {format(event.start, 'h:mm')} - {format(event.end, 'h:mm a')}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

