import React, { useState } from 'react';
import { storage } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { ImageInputPicker } from '../components/common/ImageInputPicker';
import { SafeImage } from '../components/common/SafeImage';
import { DonorMember } from '../types';
import { Award, Heart, Plus, Edit, Trash2, X, Save } from 'lucide-react';

export const DonorsView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user && (user.role === 'SUPER_ADMIN' || user.role === 'LIBRARY_ADMIN' || user.role === 'LIBRARIAN');

  const [donors, setDonors] = useState<DonorMember[]>(() => storage.getDonors());
  const [showModal, setShowModal] = useState(false);
  const [editingDonor, setEditingDonor] = useState<DonorMember | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [donorCategory, setDonorCategory] = useState<DonorMember['donorCategory']>('Donor Member');
  const [contribution, setContribution] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [joinDate, setJoinDate] = useState('২০২৬');

  const resetForm = () => {
    setEditingDonor(null);
    setName('');
    setDesignation('');
    setDonorCategory('Donor Member');
    setContribution('');
    setPhotoUrl('');
    setJoinDate('২০২৬');
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (donor: DonorMember) => {
    setEditingDonor(donor);
    setName(donor.name);
    setDesignation(donor.designation);
    setDonorCategory(donor.donorCategory);
    setContribution(donor.contribution);
    setPhotoUrl(donor.photoUrl);
    setJoinDate(donor.joinDate);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !designation) {
      showToast('দাতা সদস্যের নাম ও পদবি প্রদান করুন', 'error');
      return;
    }

    const defaultPhoto = photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300';

    if (editingDonor) {
      const updated: DonorMember = {
        ...editingDonor,
        name,
        designation,
        donorCategory,
        contribution,
        photoUrl: defaultPhoto,
        joinDate
      };
      storage.updateDonor(updated);
      showToast('দাতা সদস্যের তথ্য আপডেট করা হয়েছে', 'success');
    } else {
      const newDonor: DonorMember = {
        id: `dn_${Date.now()}`,
        name,
        designation,
        donorCategory,
        contribution,
        photoUrl: defaultPhoto,
        joinDate
      };
      storage.addDonor(newDonor);
      showToast('নতুন দাতা সদস্য যুক্ত করা হয়েছে', 'success');
    }

    setDonors(storage.getDonors());
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই দাতা সদস্যের তথ্য মুছে ফেলতে চান?')) {
      storage.deleteDonor(id);
      setDonors(storage.getDonors());
      showToast('দাতা সদস্য মুছে ফেলা হয়েছে', 'info');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
            <Award className="w-7 h-7 text-amber-400" />
            <span>দাতা সদস্যবৃন্দ (Honorable Donor Members)</span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">
            যাঁদের উদার আর্থিক, জমি ও বই অনুদানে সমৃদ্ধ হয়েছে আমাদের এই পাঠাগার
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন দাতা সদস্য যোগ করুন</span>
          </button>
        )}
      </div>

      {/* Donors Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donors.map(donor => (
          <div
            key={donor.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all text-center space-y-3 relative group"
          >
            {isAdmin && (
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-slate-800/80 p-1 rounded-xl shadow-xs">
                <button
                  onClick={() => handleOpenEdit(donor)}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                  title="সম্পাদনা"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(donor.id)}
                  className="p-1.5 text-rose-600 hover:text-rose-700"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <SafeImage
              src={donor.photoUrl}
              alt={donor.name}
              category="member"
              className="w-24 h-24 rounded-full object-cover border-4 border-emerald-600 mx-auto shadow-md"
            />
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {donor.donorCategory}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {donor.name}
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {donor.designation}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <p className="font-semibold text-slate-800 dark:text-slate-200">বিশেষ অবদান:</p>
              <p>{donor.contribution}</p>
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              যোগদানের তারিখ: {donor.joinDate}
            </p>
          </div>
        ))}
      </div>

      {/* Become a Donor Info Card */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 text-center space-y-4 border border-emerald-700 shadow-lg">
        <Heart className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold">আপনিও লাইব্রেরির দাতা সদস্য হতে চান?</h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
          বই দান, আলমারি, কম্পিউটার বা লাইব্রেরি ফান্ডে সহায়তা দিয়ে আমাদের জ্ঞান প্রসারের অগ্রযাত্রায় শরিক হন।
        </p>
        <p className="text-xs font-mono text-emerald-300 bg-emerald-950/80 inline-block px-4 py-2 rounded-xl">
          ইমেইল: sajkspla@gmail.com | মোবাইল: +৮৮০ ১৭১১-০০০০০১
        </p>
      </div>

      {/* ADD / EDIT DONOR MODAL */}
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
              <Award className="w-5 h-5 text-amber-500" />
              <span>{editingDonor ? 'দাতা সদস্যের তথ্য সম্পাদনা' : 'নতুন দাতা সদস্য সংযোজন'}</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              {/* Image Picker */}
              <ImageInputPicker
                value={photoUrl}
                onChange={setPhotoUrl}
                label="দাতা সদস্যের ছবি (Photo Upload / URL)"
                helpText="ডিভাইস থেকে সরাসরি ফটো আপলোড করুন অথবা ছবি লিংক পেস্ট করুন"
                aspectRatio="avatar"
              />

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: জনাব আলহাজ্ব মোঃ মোস্তফা"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  পদবি / পরিচিতি *
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="যেমন: বিশিষ্ট সমাজসেবক ও শিক্ষানুরাগী"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    দাতা ক্যাটাগরি *
                  </label>
                  <select
                    value={donorCategory}
                    onChange={(e) => setDonorCategory(e.target.value as DonorMember['donorCategory'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Chief Sponsor">প্রধান পৃষ্ঠপোষক (Chief Sponsor)</option>
                    <option value="Patron">পৃষ্ঠপোষক (Patron)</option>
                    <option value="Life Member">আজীবন সদস্য (Life Member)</option>
                    <option value="Donor Member">দাতা সদস্য (Donor Member)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    যোগদানের বছর / তারিখ
                  </label>
                  <input
                    type="text"
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                    placeholder="যেমন: ১৫ মার্চ ২০১০"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  বিশেষ অবদান / অনুদান বিবরণ
                </label>
                <textarea
                  rows={3}
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  placeholder="যেমন: ভবন নির্মাণে আর্থিক সহায়তা ও ৫০টি নতুন বই অনুদান"
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
