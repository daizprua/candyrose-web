'use client';

import React from 'react';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 py-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2">
        <Building2 className="w-7 h-7 text-primary" />
        <span className="font-black text-2xl tracking-tighter uppercase">
          Hotel <span className="text-primary italic">Candy Rose</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
