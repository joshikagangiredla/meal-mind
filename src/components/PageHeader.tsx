import type { ReactNode } from 'react';
import Logo from './Logo';

/** Smiley logo + page title, matching the Figma header row, with an optional right-side action. */
export default function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <Logo />
      <h1 className="text-[22px] font-bold text-ink flex-1 min-w-0 truncate">{title}</h1>
      {action}
    </div>
  );
}
