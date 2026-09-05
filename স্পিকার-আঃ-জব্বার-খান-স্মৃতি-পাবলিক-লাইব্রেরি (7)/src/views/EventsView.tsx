import React from 'react';
import { storage } from '../lib/storage';
import { SafeImage } from '../components/common/SafeImage';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

export const EventsView: React.FC = () => {
  const events = storage.getEvents();

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-800">
        <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-emerald-400" />
          <span>ইভেন্ট ও কার্যক্রম (Events & Workshops)</span>
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200 mt-1">
          বইমেলা, তথ্যপ্রযুক্তি কর্মশালা, প্রতিযোগিতা ও সামাজিক সাংস্কৃতিক আয়োজন
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(evt => (
          <div
            key={evt.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="aspect-16/9 bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <SafeImage
                src={evt.imageUrl}
                alt={evt.title}
                category="event"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{evt.date}</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{evt.time}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{evt.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>আয়োজক: {evt.organizer}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
