import React, { useState } from 'react';
import { addDays, addMonths, addWeeks, subDays, subMonths, subWeeks } from 'date-fns';
import { CalendarHeader } from '../components/recipes/calendar/CalendarHeader';
import { MonthView } from '../components/recipes/calendar/MonthView';
import { TimeGridView } from '../components/recipes/calendar/TimeGridView';
import { MOCK_EVENTS, FAMILY_MEMBERS } from '../components/recipes/calendar/data';

type ViewType = 'month' | 'week' | 'day';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
      return;
    }

    switch (view) {
      case 'month':
        setCurrentDate(curr => direction === 'next' ? addMonths(curr, 1) : subMonths(curr, 1));
        break;
      case 'week':
        setCurrentDate(curr => direction === 'next' ? addWeeks(curr, 1) : subWeeks(curr, 1));
        break;
      case 'day':
        setCurrentDate(curr => direction === 'next' ? addDays(curr, 1) : subDays(curr, 1));
        break;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-[600px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onDateChange={setCurrentDate}
      />
      
      <div className="flex-1 overflow-hidden relative">
        {view === 'month' ? (
          <MonthView
            currentDate={currentDate}
            events={MOCK_EVENTS}
            members={FAMILY_MEMBERS}
            onDateClick={(date) => {
              setCurrentDate(date);
              setView('day');
            }}
            onEventClick={(event) => console.log('Event clicked:', event)}
          />
        ) : (
          <TimeGridView
            currentDate={currentDate}
            view={view as 'week' | 'day'}
            events={MOCK_EVENTS}
            members={FAMILY_MEMBERS}
            onEventClick={(event) => console.log('Event clicked:', event)}
            onTimeSlotClick={(date) => console.log('Time slot clicked:', date)}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;

