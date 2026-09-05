import React from 'react';
import { storage } from '../lib/storage';
import { FileText, Calendar, Pin, Download } from 'lucide-react';

export const NoticesView: React.FC = () => {
  const notices = storage.getNotices();

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-800">
        <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-400" />
          <span>অফিসিয়াল নোটিশ বোর্ড (Official Notice Board)</span>
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200 mt-1">
          লাইব্রেরি কার্যক্রম, সময়সূচী পরিবর্তন ও গুরুত্বপূর্ণ ঘোষণা
        </p>
      </div>

      <div className="space-y-4">
        {notices.map(notice => (
          <div
            key={notice.id}
            className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border transition-all shadow-xs space-y-3 ${
              notice.pinned 
                ? 'border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20' 
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {notice.pinned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-md">
                    <Pin className="w-3 h-3 fill-current" />
                    <span>পিন করা</span>
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  {notice.category}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">{notice.date}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {notice.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {notice.content}
            </p>

            <div className="pt-2 flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <span>প্রকাশক: লাইব্রেরি প্রশাসন</span>
              <button className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                <span>প্রিন্ট/ডাউনলোড</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
