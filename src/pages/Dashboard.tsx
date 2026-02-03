import React from 'react';
import { Calendar as CalendarIcon, CheckSquare, Plus, Clock, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF6F61] via-[#FF8A75] to-[#FFD54F] p-8 md:p-12 shadow-xl shadow-[#FF6F61]/20">
        <div className="relative z-10 text-white">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-sm">
            {greeting}, Smith Family!
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
            You have <span className="font-bold text-white underline decoration-2 underline-offset-4">3 events</span> and <span className="font-bold text-white underline decoration-2 underline-offset-4">2 tasks</span> pending today.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#FF6F61] shadow-lg hover:bg-slate-50 hover:scale-105 transition-all duration-300">
              <Plus size={18} strokeWidth={3} />
              Add Event
            </button>
            <button className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-6 py-3 text-sm font-bold text-white border border-white/40 hover:bg-white/30 transition-all duration-300">
              View Calendar
            </button>
          </div>
        </div>
        
        {/* Abstract Shapes Decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-[#FFD54F]/30 blur-3xl" />
      </section>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Card: Today's Schedule */}
        <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <CalendarIcon size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Schedule</h2>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today</span>
          </div>
          
          <div className="space-y-4">
            {[
              { title: 'Soccer Practice', time: '4:00 PM', color: 'bg-green-100 text-green-700 border-green-200' },
              { title: 'Family Dinner', time: '7:00 PM', color: 'bg-orange-100 text-orange-700 border-orange-200' },
            ].map((event, i) => (
              <div key={i} className={`flex items-center justify-between rounded-xl p-4 border ${event.color}`}>
                <span className="font-semibold">{event.title}</span>
                <span className="text-sm font-medium opacity-80">{event.time}</span>
              </div>
            ))}
            {/* Empty State / Add More */}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-semibold text-slate-400 hover:border-[#FF6F61] hover:text-[#FF6F61] transition-colors">
              <Plus size={16} />
              Add Event
            </button>
          </div>
        </div>

        {/* Card: Shopping List */}
        <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <CheckSquare size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Shopping</h2>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active</span>
          </div>

          <div className="space-y-3">
             {[
              { label: 'Milk', checked: true },
              { label: 'Eggs', checked: false },
              { label: 'Bread', checked: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group/item cursor-pointer">
                <div className={`h-6 w-6 rounded-md border-2 flex items-center justify-center transition-colors ${item.checked ? 'bg-purple-500 border-purple-500' : 'border-slate-300 group-hover/item:border-purple-500'}`}>
                  {item.checked && <CheckSquare size={14} className="text-white" />}
                </div>
                <span className={`text-slate-700 font-medium ${item.checked ? 'line-through text-slate-400' : ''}`}>
                  {item.label}
                </span>
              </div>
            ))}
             <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700">
              View all lists <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Card: Quick Actions / Feature Highlight */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
                <Clock size={12} className="mr-2" /> Quick Actions
              </div>
              <h3 className="text-2xl font-bold leading-tight mb-2">Sync Your Calendars</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect external Google or Apple calendars to see everything in one place.
              </p>
            </div>
            <button className="mt-8 w-full rounded-xl bg-white py-3 text-sm font-bold text-slate-900 shadow-lg hover:bg-slate-100 transition-colors">
              Connect Accounts
            </button>
          </div>
           {/* Decor */}
           <div className="absolute top-0 right-0 h-48 w-48 translate-x-12 -translate-y-12 bg-gradient-to-br from-[#FF6F61] to-[#FFD54F] opacity-20 blur-3xl rounded-full pointer-events-none" />
        </div>

      </div>
    </div>
  );
}
