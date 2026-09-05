import React, { useState } from 'react';
import { storage } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { MilestoneItem } from '../types';
import { Clock, Plus, Edit, Trash2, X, Save } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user && (user.role === 'SUPER_ADMIN' || user.role === 'LIBRARY_ADMIN' || user.role === 'LIBRARIAN');

  const [milestones, setMilestones] = useState<MilestoneItem[]>(() => storage.getMilestones());
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MilestoneItem | null>(null);

  // Form
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const resetForm = () => {
    setEditingItem(null);
    setYear('');
    setTitle('');
    setDesc('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (m: MilestoneItem) => {
    setEditingItem(m);
    setYear(m.year);
    setTitle(m.title);
    setDesc(m.desc);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !title) {
      showToast('সাল ও শিরোনাম প্রদান করুন', 'error');
      return;
    }

    if (editingItem) {
      const updated: MilestoneItem = {
        ...editingItem,
        year,
        title,
        desc
      };
      storage.updateMilestone(updated);
      showToast('ইতিহাসের মাইলফলক আপডেট করা হয়েছে', 'success');
    } else {
      const newItem: MilestoneItem = {
        id: `ms_${Date.now()}`,
        year,
        title,
        desc
      };
      storage.addMilestone(newItem);
      showToast('নতুন মাইলফলক যুক্ত করা হয়েছে', 'success');
    }

    setMilestones(storage.getMilestones());
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই ইতিহাসের তথ্যটি মুছে ফেলতে চান?')) {
      storage.deleteMilestone(id);
      setMilestones(storage.getMilestones());
      showToast('তথ্য মুছে ফেলা হয়েছে', 'info');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
            <Clock className="w-7 h-7 text-emerald-400" />
            <span>লাইব্রেরির ইতিহাস (Library History)</span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">
            ২০০১ সাল থেকে ২০২৬ — পথচলা ও অগ্রযাত্রার গৌরবময় দিনলিপি
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন মাইলফলক যোগ করুন</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative">
        <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-emerald-200 dark:bg-emerald-800 hidden sm:block"></div>

        <div className="space-y-8">
          {milestones.map((m, idx) => (
            <div key={m.id} className="relative flex flex-col sm:flex-row gap-4 sm:gap-8 items-start group">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-md sm:ml-4">
                {idx + 1}
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2 relative">
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="p-1 text-slate-500 hover:text-emerald-600"
                      title="সম্পাদনা"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {m.year}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white pr-12">
                  {m.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD / EDIT MILESTONE MODAL */}
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
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>{editingItem ? 'ইতিহাসের তথ্য সম্পাদনা' : 'নতুন ইতিহাস মাইলফলক সংযোজন'}</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  বছর / সময়কাল *
                </label>
                <input
                  type="text"
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="যেমন: ০১ জানুয়ারি ২০০১"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ঘটনার বিষয় / শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: লাইব্রেরির শুভ সুচনা"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  বিস্তারিত বিবরণ
                </label>
                <textarea
                  rows={4}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="ইতিহাসের বিস্তারিত সংক্ষিপ্ত বিবরণ লিখুন..."
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
