import React, { useState } from 'react';
import { Award, Quote, Edit, X, Save, Sparkles } from 'lucide-react';
import { storage } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { ImageInputPicker } from '../components/common/ImageInputPicker';
import { SafeImage } from '../components/common/SafeImage';
import { FounderInfo } from '../types';

export const FounderView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user && (user.role === 'SUPER_ADMIN' || user.role === 'LIBRARY_ADMIN' || user.role === 'LIBRARIAN');

  const [siteInfo, setSiteInfo] = useState(() => storage.getSiteInfo());
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states for Founder
  const [founderData, setFounderData] = useState<FounderInfo>(siteInfo.founder);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...siteInfo,
      founder: founderData
    };
    storage.saveSiteInfo(updated);
    setSiteInfo(updated);
    setShowEditModal(false);
    showToast('প্রতিষ্ঠাতার তথ্য ও ছবি সফলভাবে আপডেট করা হয়েছে', 'success');
  };

  const { founder } = siteInfo;

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
            <Award className="w-7 h-7 text-emerald-400" />
            <span>প্রতিষ্ঠাতা জীবনী ও বাণী (Founder Profile)</span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">
            {founder.name} — সমাজসেবক, শিক্ষানুরাগী ও লাইব্রেরির স্বপ্নদ্রষ্টা
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setFounderData(siteInfo.founder);
              setShowEditModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>তথ্য ও ছবি সম্পাদনা</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 text-center">
            <SafeImage
              src={founder.photoUrl || 'img_founder_01'}
              alt={founder.name}
              category="founder"
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover border-4 border-emerald-600 shadow-xl mx-auto"
            />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-4">
              {founder.name}
            </h2>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {founder.designation}
            </p>
            <p className="text-xs text-slate-500 font-mono mt-1">
              {founder.address}
            </p>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 italic leading-relaxed space-y-2">
              <Quote className="w-5 h-5 text-emerald-600 mb-1" />
              <p>
                "{founder.quote}"
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                জীবনসংগ্রাম ও সমাজসেবামূলক অবদান:
              </h3>
              <p>{founder.bio1}</p>
              <p>{founder.bio2}</p>
            </div>
          </div>
        </div>

      </div>

      {/* EDIT FOUNDER MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 border-b pb-2 flex items-center gap-2">
              <Edit className="w-5 h-5 text-emerald-600" />
              <span>প্রতিষ্ঠাতার তথ্য ও ছবি পরিবর্তন</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              {/* Dual Mode Image Picker */}
              <ImageInputPicker
                value={founderData.photoUrl}
                onChange={(url) => setFounderData({ ...founderData, photoUrl: url })}
                label="প্রতিষ্ঠাতার ছবি (Photo Upload / URL)"
                helpText="সরাসরি ডিভাইস থেকে ছবি ফাইল আপলোড করুন অথবা ছবি লিংক পেস্ট করুন"
                aspectRatio="square"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    প্রতিষ্ঠাতার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={founderData.name}
                    onChange={(e) => setFounderData({ ...founderData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    পদবি *
                  </label>
                  <input
                    type="text"
                    required
                    value={founderData.designation}
                    onChange={(e) => setFounderData({ ...founderData, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ঠিকানা
                </label>
                <input
                  type="text"
                  value={founderData.address}
                  onChange={(e) => setFounderData({ ...founderData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  প্রতিষ্ঠাতার বাণী / উদ্ধৃতি (Quote)
                </label>
                <textarea
                  rows={3}
                  value={founderData.quote}
                  onChange={(e) => setFounderData({ ...founderData, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  জীবনী (অনুচ্ছেদ ১)
                </label>
                <textarea
                  rows={3}
                  value={founderData.bio1}
                  onChange={(e) => setFounderData({ ...founderData, bio1: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  অবদান (অনুচ্ছেদ ২)
                </label>
                <textarea
                  rows={3}
                  value={founderData.bio2}
                  onChange={(e) => setFounderData({ ...founderData, bio2: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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
