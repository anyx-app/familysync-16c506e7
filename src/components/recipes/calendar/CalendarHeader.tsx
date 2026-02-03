import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export type CalendarView = 'day' | 'week' | 'month';

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  className?: string;
}

export function CalendarHeader({
  currentDate,
  onDateChange,
  view,
  onViewChange,
  className,
}: CalendarHeaderProps) {
  
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-background border-b", className)}>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 mr-2">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleToday} className="ml-1">
            Today
          </Button>
        </div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          {format(currentDate, 'MMMM yyyy')}
        </h2>
      </div>

      <div className="flex items-center bg-muted p-1 rounded-lg">
        <button
          onClick={() => onViewChange('day')}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
            view === 'day' 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Day
        </button>
        <button
          onClick={() => onViewChange('week')}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
            view === 'week' 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Week
        </button>
        <button
          onClick={() => onViewChange('month')}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
            view === 'month' 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Month
        </button>
      </div>
    </div>
  );
}

