import React, { useState } from 'react';
import { storage } from '../lib/storage';
import { GalleryItem } from '../types';
import { SafeImage } from '../components/common/SafeImage';
import { Image, X } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const gallery = storage.getGallery();
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Library', 'Events', 'Inauguration', 'Guests', 'Books'];

  const filtered = gallery.filter(g => selectedCat === 'All' || g.category === selectedCat);

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-800">
        <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
          <Image className="w-6 h-6 text-emerald-400" />
          <span>ফটোগ্যালারি (Photo Gallery)</span>
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200 mt-1">
          স্পিকার আঃ জব্বার খান স্মৃতি লাইব্রেরির ঐতিহাসিক মুহূর্ত, মেলা ও স্মৃতি চিত্র
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCat === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border'
            }`}
          >
            {cat === 'All' ? 'সবগুলো' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group relative aspect-4/3 rounded-xl overflow-hidden bg-slate-200 cursor-pointer shadow-xs border border-slate-200 dark:border-slate-800"
          >
            <SafeImage
              src={item.imageUrl}
              alt={item.title}
              category="gallery"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-3 flex flex-col justify-end">
              <span className="text-[10px] text-emerald-300 font-mono">{item.date}</span>
              <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-4 relative shadow-2xl space-y-3">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            <SafeImage
              src={activeItem.imageUrl}
              alt={activeItem.title}
              category="gallery"
              className="w-full h-80 object-cover rounded-xl"
            />
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{activeItem.category} • {activeItem.date}</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{activeItem.title}</h3>
              {activeItem.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{activeItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
