import React, { useState } from 'react';
import { INITIAL_FAQS } from '../data/initialData';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';

export const FAQView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>('faq_1');

  const filtered = INITIAL_FAQS.filter(faq => {
    const q = searchQuery.toLowerCase().trim();
    return !q || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-800 text-center">
        <HelpCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
        <h1 className="text-xl sm:text-2xl font-extrabold">
          সাধারণ জিজ্ঞাসাবলী (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200 mt-1">
          লাইব্রেরির সদস্যপদ, বই ধার নেওয়া, ই-বুক ও জরিমানা সংক্রান্ত কমন প্রশ্নের উত্তর
        </p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="প্রশ্ন বা বিষয় লিখে উত্তর খুঁজুন..."
          className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>

      <div className="space-y-3">
        {filtered.map(faq => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
              </button>

              {isOpen && (
                <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 leading-relaxed bg-slate-50/50 dark:bg-slate-800/20">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
