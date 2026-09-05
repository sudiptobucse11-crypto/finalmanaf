import React, { useState } from 'react';
import { ViewName, SiteInfo } from '../types';
import { storage } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { BookOpen, Award, CheckCircle2, Sparkles, Edit, X, Save } from 'lucide-react';

export const AboutView: React.FC<{ onNavigate: (view: ViewName) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user && (user.role === 'SUPER_ADMIN' || user.role === 'LIBRARY_ADMIN' || user.role === 'LIBRARIAN');

  const [siteInfo, setSiteInfo] = useState<SiteInfo>(() => storage.getSiteInfo());
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [aboutIntro, setAboutIntro] = useState(siteInfo.aboutIntro);
  const [mission, setMission] = useState(siteInfo.mission);
  const [vision, setVision] = useState(siteInfo.vision);
  const [facilitiesStr, setFacilitiesStr] = useState(siteInfo.facilities.join('\n'));

  const handleOpenEdit = () => {
    setAboutIntro(siteInfo.aboutIntro);
    setMission(siteInfo.mission);
    setVision(siteInfo.vision);
    setFacilitiesStr(siteInfo.facilities.join('\n'));
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFacilities = facilitiesStr.split('\n').map(s => s.trim()).filter(Boolean);
    const updated: SiteInfo = {
      ...siteInfo,
      aboutIntro,
      mission,
      vision,
      facilities: updatedFacilities
    };
    storage.saveSiteInfo(updated);
    setSiteInfo(updated);
    setShowModal(false);
    showToast('আমাদের সম্পর্কে তথ্য সফলভাবে আপডেট করা হয়েছে', 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-emerald-400" />
            <span>আমাদের সম্পর্কে (About Our Library)</span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">
            {siteInfo.libraryName}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenEdit}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>তথ্য সম্পাদনা করুন</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            লাইব্রেরির সংক্ষিপ্ত পরিচিতি
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {siteInfo.aboutIntro}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>আমাদের লক্ষ্য (Our Mission)</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {siteInfo.mission}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>আমাদের ভিশন (Our Vision)</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {siteInfo.vision}
            </p>
          </div>
        </div>

        {/* Key Facilities */}
        <div className="pt-4 space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            লাইব্রেরির প্রধান সুবিধাসমূহ:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-700 dark:text-slate-300">
            {siteInfo.facilities.map((fac, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{fac}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* EDIT ABOUT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 border-b pb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>আমাদের সম্পর্কে তথ্য পরিবর্তন</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  লাইব্রেরির সংক্ষিপ্ত বিবরণ (About Intro)
                </label>
                <textarea
                  rows={4}
                  value={aboutIntro}
                  onChange={(e) => setAboutIntro(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  আমাদের লক্ষ্য (Our Mission)
                </label>
                <textarea
                  rows={3}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  আমাদের ভিশন (Our Vision)
                </label>
                <textarea
                  rows={3}
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  প্রধান সুবিধাসমূহ (প্রতি লাইনে একটি করে সুবিধা লিখুন)
                </label>
                <textarea
                  rows={4}
                  value={facilitiesStr}
                  onChange={(e) => setFacilitiesStr(e.target.value)}
                  placeholder="১০,০০০+ বৈচিত্র্যময় সাহিত্যের ক্যাটালগ&#10;সম্পূর্ণ শীতাতপ নিয়ন্ত্রিত আধুনিক পাঠ কক্ষ"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 font-semibold rounded-xl text-slate-700 dark:text-slate-300"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
