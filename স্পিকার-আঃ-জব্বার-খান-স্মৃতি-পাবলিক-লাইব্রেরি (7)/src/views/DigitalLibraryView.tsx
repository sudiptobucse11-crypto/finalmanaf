import React, { useState } from 'react';
import { DigitalBook, BookCategory } from '../types';
import { storage } from '../lib/storage';
import { Search, Download, BookOpen, Eye, X, ZoomIn, ZoomOut, Bookmark, FileText, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { useToast } from '../components/common/Toast';

export const DigitalLibraryView: React.FC = () => {
  const { showToast } = useToast();
  const digitalBooks = storage.getDigitalBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [readingBook, setReadingBook] = useState<DigitalBook | null>(null);

  // PDF Viewer Modal Controls
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [readerDark, setReaderDark] = useState(false);

  const filtered = digitalBooks.filter(b => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const handleStartRead = (book: DigitalBook) => {
    setReadingBook(book);
    setCurrentPage(1);
    setZoomLevel(100);

    // Update read count
    const updated = storage.getDigitalBooks().map(d => d.id === book.id ? { ...d, readCount: d.readCount + 1 } : d);
    storage.saveDigitalBooks(updated);
  };

  const handleDownload = (book: DigitalBook) => {
    const pdf = book.pdfUrl || book.fileUrl;
    if (!pdf) {
      showToast(`"${book.title}" বইটির পিডিএফ ফাইল এখনও লাইব্রেরিতে আপলোড করা হয়নি। বইটি লাইব্রেরি ক্যাটালগে সংরক্ষিত রয়েছে।`, 'info');
      return;
    }
    // Update download count
    const updated = storage.getDigitalBooks().map(d => d.id === book.id ? { ...d, downloadCount: d.downloadCount + 1 } : d);
    storage.saveDigitalBooks(updated);

    if (pdf.startsWith('data:') || pdf.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = pdf;
      a.download = `${book.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.open(pdf, '_blank');
    }
    showToast(`"${book.title}" ই-বুকটি ডাউনলোড শুরু হয়েছে`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-700">
        <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-300" />
          <span>ডিজিটাল ই-বুক লাইব্রেরি (E-Books & PDFs)</span>
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200 mt-1">
          অনলাইনে বিনামূল্যে ই-বুক পড়ুন ও ডাউনলোড করুন। স্পিকার আঃ জব্বার খান স্মৃতি লাইব্রেরির ডিজিটাল আর্কাইভ।
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ই-বুকের নাম বা লেখক দিয়ে খুঁজুন..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shrink-0"
        >
          <option value="All">সকল ক্যাটাগরি</option>
          <option value="Technology">প্রযুক্তি</option>
          <option value="Agriculture">কৃষি</option>
          <option value="Programming">প্রোগ্রামিং</option>
          <option value="Science">বিজ্ঞান</option>
        </select>
      </div>

      {/* Digital Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(book => (
          <div
            key={book.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex gap-4">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-20 h-28 object-cover rounded-xl shadow-xs border shrink-0"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {book.category}
                  </span>
                  {!book.pdfUrl && !book.fileUrl && (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      ক্যাটালগে সংরক্ষিত
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{book.author}</p>
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  সাইজ: {book.fileUrl || book.pdfUrl ? book.fileSize : 'ক্যাটালগ সংরক্ষিত'} • {book.pageCount} পৃষ্ঠা
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
              {book.description}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleStartRead(book)}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{!book.pdfUrl && !book.fileUrl ? 'বিবরণ ও সারাংশ পড়ুন' : 'অনলাইনে পড়ুন'}</span>
              </button>

              <button
                onClick={() => handleDownload(book)}
                className={`p-2 rounded-xl transition-colors ${
                  !book.pdfUrl && !book.fileUrl
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                }`}
                title={!book.pdfUrl && !book.fileUrl ? 'পিডিএফ এখনও সংযুক্ত নেই (ক্যাটালগে সংরক্ষিত)' : 'পিডিএফ ডাউনলোড করুন'}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ONLINE PDF READER MODAL */}
      {readingBook && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col p-2 sm:p-6 overflow-hidden">
          {/* Top Control Bar */}
          <div className="bg-slate-900 text-white p-3 rounded-2xl flex items-center justify-between gap-3 shadow-xl mb-3 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-xs">
                PDF
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                  {readingBook.title}
                </h3>
                <p className="text-[10px] text-emerald-300">লেখক: {readingBook.author}</p>
              </div>
            </div>

            {/* Reader Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReaderDark(!readerDark)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                title="ডার্ক মোড টগল"
              >
                {readerDark ? 'Light' : 'Dark'}
              </button>

              <button
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-300 hidden sm:inline">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDownload(readingBook)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 ml-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ডাউনলোড</span>
              </button>

              <button
                onClick={() => setReadingBook(null)}
                className="p-1.5 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Reader Document Content Area */}
          <div className="flex-1 overflow-y-auto flex justify-center p-4">
            <div 
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className={`max-w-2xl w-full p-8 rounded-2xl shadow-2xl transition-all border ${
                readerDark 
                  ? 'bg-slate-900 text-slate-100 border-slate-800' 
                  : 'bg-white text-slate-900 border-slate-200'
              }`}
            >
              <div className="border-b pb-4 mb-6 flex justify-between items-center text-xs font-mono text-slate-400">
                <span>স্পিকার আঃ জব্বার খান পাবলিক লাইব্রেরি ই-আর্কাইভ</span>
                <span>পৃষ্ঠা: {currentPage} / {readingBook.pageCount}</span>
              </div>

              <h2 className="text-xl font-bold mb-1">{readingBook.title}</h2>
              <p className="text-xs text-emerald-600 font-semibold mb-4">লেখক: {readingBook.author}</p>

              {!readingBook.pdfUrl && !readingBook.fileUrl && (
                <div className="mb-6 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
                  <span className="font-bold">ক্যাটালগ নোট: </span>
                  <span>বইটি লাইব্রেরির ডিজিটাল ক্যাটালগে সংরক্ষিত রয়েছে। সরাসরি পূর্ণাঙ্গ পিডিএফ ফাইল শীঘ্রই লাইব্রেরিয়ান কর্তৃক আপলোড করা হবে।</span>
                </div>
              )}

              {readingBook.description && (
                <div className="mb-4 text-xs italic text-slate-600 dark:text-slate-400 border-l-2 border-emerald-500 pl-3 py-1">
                  {readingBook.description}
                </div>
              )}

              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line text-xs sm:text-sm leading-relaxed font-serif">
                {readingBook.sampleContentText || 'বইটির বিস্তারিত তথ্য ও ক্যাটালগ লাইব্রেরিতে সংরক্ষিত রয়েছে। পূর্ণাঙ্গ পড়ার জন্য লাইব্রেরি শাখায় যোগাযোগ করুন।'}
              </div>

              <div className="mt-12 pt-6 border-t flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-lg disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>পূর্ববর্তী পৃষ্ঠা</span>
                </button>

                <span className="text-xs font-mono">পৃষ্ঠা {currentPage}</span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(readingBook.pageCount, prev + 1))}
                  disabled={currentPage === readingBook.pageCount}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-lg disabled:opacity-40 flex items-center gap-1"
                >
                  <span>পরবর্তী পৃষ্ঠা</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
