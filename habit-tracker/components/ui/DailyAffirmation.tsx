'use client';
import React, { useState, useEffect } from 'react';

const DailyAffirmation = () => {
  const [quote, setQuote] = useState<string>('');

  useEffect(() => {
    const fetchAffirmation = async () => {
      try {
        const response = await fetch('/api/affirmation');
        const data = await response.json();
        setQuote(data.affirmation);
      } catch (error) {
        setQuote("Your potential is endless.");
      }
    };
    fetchAffirmation();
  }, []);

  if (!quote) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-10">
      <div className="relative overflow-hidden bg-white/40 backdrop-blur-md border border-white rounded-[2.5rem] p-8 text-center shadow-sm">
        {/* Subtle Decorative Background Blob */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />
        
        <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-4">
          Daily Insight
        </span>
        
        <p className="text-2xl md:text-3xl font-serif italic text-slate-700 leading-tight">
          "{quote}"
        </p>
        
        <div className="mt-4 flex justify-center gap-1">
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div className="w-8 h-1 rounded-full bg-slate-200"></div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
        </div>
      </div>
    </div>
  );
};

export default DailyAffirmation;