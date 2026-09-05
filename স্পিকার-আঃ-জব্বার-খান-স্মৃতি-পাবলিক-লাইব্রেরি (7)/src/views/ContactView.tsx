import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle2, Edit, X, Save } from 'lucide-react';
import { storage } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { SiteInfo } from '../types';

export const ContactView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user && (user.role === 'SUPER_ADMIN' || user.role === 'LIBRARY_ADMIN' || user.role === 'LIBRARIAN');

  const [siteInfo, setSiteInfo] = useState<SiteInfo>(() => storage.getSiteInfo());
  const [showModal, setShowModal] = useState(false);

  // Contact Form States
  const [name, setName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Admin Edit Form States
  const [address, setAddress] = useState(siteInfo.address);
  const [email, setEmail] = useState(siteInfo.email);
  const [phone, setPhone] = useState(siteInfo.phone);
  const [hours, setHours] = useState(siteInfo.hours);
  const [mapInfo, setMapInfo] = useState(siteInfo.mapInfo);

  const handleOpenEdit = () => {
    setAddress(siteInfo.address);
    setEmail(siteInfo.email);
    setPhone(siteInfo.phone);
    setHours(siteInfo.hours);
    setMapInfo(siteInfo.mapInfo);
    setShowModal(true);
  };

  const handleSaveSiteInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteInfo = {
      ...siteInfo,
      address,
      email,
      phone,
      hours,
      mapInfo
    };
    storage.saveSiteInfo(updated);
    setSiteInfo(updated);
    setShowModal(false);
    showToast('যোগাযোগের তথ্য আপডেট করা হয়েছে', 'success');
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('আপনার বার্তা সফলভাবে পাঠানো হয়েছে। ধন্যবাদ!', 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-400" />
            <span>যোগাযোগ (Contact & Location)</span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">
            লাইব্রেরি সংক্রান্ত যেকোনো পরামর্শ, প্রশ্ন বা বই অনুদানের বিষয়ে যোগাযোগ করুন
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenEdit}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>যোগাযোগ তথ্য সম্পাদনা</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Information Column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            অফিসিয়াল যোগাযোগের তথ্য
          </h2>

          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white mb-0.5">লাইব্রেরি ঠিকানা:</strong>
                <span>{siteInfo.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white mb-0.5">অফিসিয়াল ইমেইল:</strong>
                <a href={`mailto:${siteInfo.email}`} className="text-emerald-600 dark:text-emerald-400 font-semibold underline">
                  {siteInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white mb-0.5">জরুরি হটলাইন:</strong>
                <span>{siteInfo.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-[11px]">
                <strong className="block text-slate-900 dark:text-white">খোলা থাকার সময়সূচী:</strong>
                <p>{siteInfo.hours}</p>
              </div>
            </div>
          </div>

          {/* Map Location Card */}
          <div className="p-4 bg-emerald-950 text-white rounded-xl space-y-2 border border-emerald-800">
            <h4 className="text-xs font-bold flex items-center gap-1.5 text-emerald-300">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>অবস্থান ও গুগল ম্যাপস (Google Maps)</span>
            </h4>
            <p className="text-[11px] text-emerald-200">
              {siteInfo.mapInfo}
            </p>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            আমাদের বার্তা পাঠান (Feedback & Inquiry)
          </h2>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                আপনার বার্তাটি সফলভাবে বার্তা বাক্সে পাঠানো হয়েছে!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                আমাদের লাইব্রেরি কর্তৃপক্ষ অতিসত্বর আপনার ইমেইলে উত্তর প্রদান করবে।
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
              >
                আরেকটি বার্তা পাঠান
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার পূর্ণ নাম"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ইমেইল ঠিকানা *
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  বিষয় (Subject) *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="যেমন: বই দান বা বই রিজার্ভেশন তথ্য"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  আপনার বার্তা / মতামত *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="বিস্তারিত বার্তা এখানে লিখুন..."
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>বার্তা পাঠান (Send Message)</span>
              </button>
            </form>
          )}

        </div>

      </div>

      {/* EDIT CONTACT MODAL FOR ADMINS */}
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
              <Edit className="w-5 h-5 text-emerald-600" />
              <span>যোগাযোগ তথ্য পরিবর্তন</span>
            </h2>

            <form onSubmit={handleSaveSiteInfo} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  লাইব্রেরি পূর্ণ ঠিকানা *
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    অফিসিয়াল ইমেইল *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    হটলাইন / মোবাইল নম্বর *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  খোলা থাকার সময়সূচী *
                </label>
                <input
                  type="text"
                  required
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ম্যাপ ও যাতায়াত তথ্য
                </label>
                <textarea
                  rows={2}
                  value={mapInfo}
                  onChange={(e) => setMapInfo(e.target.value)}
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
