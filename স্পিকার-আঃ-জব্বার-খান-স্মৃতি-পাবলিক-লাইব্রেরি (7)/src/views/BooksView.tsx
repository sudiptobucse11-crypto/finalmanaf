import React, { useState, useMemo } from 'react';
import { Book, BookCategory, ViewName } from '../types';
import { storage } from '../lib/storage';
import { BookCard } from '../components/common/BookCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { Search, Filter, RefreshCw, LayoutGrid, List, Check, BookOpen } from 'lucide-react';

interface BooksViewProps {
  onSelectBook: (book: Book) => void;
  onNavigate: (view: ViewName) => void;
}

const CATEGORIES: { id: BookCategory | 'All'; labelBn: string; labelEn: string }[] = [
  { id: 'All', labelBn: 'সকল ক্যাটাগরি', labelEn: 'All Categories' },
  { id: 'Novel', labelBn: 'উপন্যাস', labelEn: 'Novel' },
  { id: 'Story', labelBn: 'গল্প', labelEn: 'Story' },
  { id: 'Science', labelBn: 'বিজ্ঞান', labelEn: 'Science' },
  { id: 'Technology', labelBn: 'প্রযুক্তি', labelEn: 'Technology' },
  { id: 'History', labelBn: 'ইতিহাস', labelEn: 'History' },
  { id: 'Liberation War', labelBn: 'মুক্তিযুদ্ধ', labelEn: 'Liberation War' },
  { id: 'Religion', labelBn: 'ধর্মীয়', labelEn: 'Religion' },
  { id: 'Children', labelBn: 'শিশু-কিশোর', labelEn: 'Children' },
  { id: 'Literature', labelBn: 'সাহিত্য', labelEn: 'Literature' },
  { id: 'Poetry', labelBn: 'কবিতা', labelEn: 'Poetry' },
  { id: 'Reference', labelBn: 'রেফারেন্স', labelEn: 'Reference' },
  { id: 'Biography', labelBn: 'জীবনী', labelEn: 'Biography' },
  { id: 'Education', labelBn: 'শিক্ষা', labelEn: 'Education' },
  { id: 'Health', labelBn: 'স্বাস্থ্য', labelEn: 'Health' },
  { id: 'Agriculture', labelBn: 'কৃষি', labelEn: 'Agriculture' },
  { id: 'Computer Science', labelBn: 'কম্পিউটার সায়েন্স', labelEn: 'Computer Science' },
  { id: 'Programming', labelBn: 'প্রোগ্রামিং', labelEn: 'Programming' },
  { id: 'AI', labelBn: 'কৃত্রিম বুদ্ধিমত্তা', labelEn: 'AI' }
];

export const BooksView: React.FC<BooksViewProps> = ({ onSelectBook, onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'All'>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedPublisher, setSelectedPublisher] = useState<string>('All');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');

  const [favorites, setFavorites] = useState<string[]>(() => 
    user ? storage.getFavorites(user.id) : []
  );

  const books = storage.getBooks();

  // Extract unique publishers for publisher filter
  const publishers = useMemo(() => {
    const set = new Set<string>();
    books.forEach(b => set.add(b.publisher));
    return Array.from(set);
  }, [books]);

  const handleToggleFavorite = (bookId: string) => {
    if (!user) {
      showToast('পছন্দের তালিকায় রাখতে লগইন করুন', 'info');
      return;
    }
    const updated = storage.toggleFavorite(user.id, bookId);
    setFavorites(updated);
    showToast('পছন্দের তালিকা আপডেট হয়েছে', 'success');
  };

  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      // Query search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        b.title.toLowerCase().includes(q) ||
        (b.titleEn && b.titleEn.toLowerCase().includes(q)) ||
        b.author.toLowerCase().includes(q) ||
        b.publisher.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.shelfNumber.toLowerCase().includes(q);

      // Category filter
      const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;

      // Language filter
      const matchesLanguage = selectedLanguage === 'All' || b.language === selectedLanguage;

      // Publisher filter
      const matchesPublisher = selectedPublisher === 'All' || b.publisher === selectedPublisher;

      // Availability filter
      const matchesAvailability = !availabilityOnly || b.availableCopies > 0;

      return matchesSearch && matchesCategory && matchesLanguage && matchesPublisher && matchesAvailability;
    });
  }, [books, searchQuery, selectedCategory, selectedLanguage, selectedPublisher, availabilityOnly]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLanguage('All');
    setSelectedPublisher('All');
    setAvailabilityOnly(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <span>বইয়ের তালিকা ও ক্যাটালগ</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1">
              স্পিকার আঃ জব্বার খান স্মৃতি পাবলিক লাইব্রেরির সকল বিষয়ভিত্তিক সংগৃহীত বইসমূহ
            </p>
          </div>
          <span className="bg-emerald-800 text-emerald-100 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-600">
            মোট বই: {books.length} টি
          </span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="বইয়ের নাম, লেখক, আইএসবিএন বা বিষয় দিয়ে খুঁজুন..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Language Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="All">সকল ভাষা (All Languages)</option>
              <option value="Bangla">বাংলা (Bangla)</option>
              <option value="English">ইংরেজি (English)</option>
            </select>
          </div>

          {/* Publisher Selector */}
          <div className="md:col-span-4">
            <select
              value={selectedPublisher}
              onChange={(e) => setSelectedPublisher(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="All">সকল প্রকাশক (All Publishers)</option>
              {publishers.map(pub => (
                <option key={pub} value={pub}>{pub}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Categories Pills Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 border-t border-slate-100 dark:border-slate-800 pt-3">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.labelBn}
              </button>
            );
          })}
        </div>

        {/* Secondary Bar Options */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={availabilityOnly}
              onChange={(e) => setAvailabilityOnly(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span>কেবলমাত্র প্রাপ্য (Available Copies Only)</span>
          </label>

          <div className="flex items-center gap-3">
            <button
              onClick={resetFilters}
              className="text-slate-500 hover:text-emerald-600 font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ফিল্টার রিসেট</span>
            </button>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setDisplayMode('grid')}
                className={`p-1 rounded-md ${displayMode === 'grid' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xs' : 'text-slate-400'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDisplayMode('list')}
                className={`p-1 rounded-md ${displayMode === 'list' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xs' : 'text-slate-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Books Display */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            কোনো বই পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-500">
            আপনার অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন বই পাওয়া যায়নি। ফিল্টার রিসেট করে আবার চেষ্টা করুন।
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      ) : displayMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={onSelectBook}
              isFavorite={favorites.includes(book.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
          {filteredBooks.map(book => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="p-4 hover:bg-emerald-50/50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-12 h-16 object-cover rounded-md border shrink-0"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {book.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    লেখক: {book.author} | ক্যাটাগরি: {book.category}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    প্রকাশক: {book.publisher} | সেলফ: {book.shelfNumber} | ISBN: {book.isbn}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-xs font-bold ${book.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {book.availableCopies > 0 ? `প্রাপ্য: ${book.availableCopies} কপি` : 'স্টক নেই'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
