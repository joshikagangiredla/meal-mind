import Logo from './Logo';

/** Smiley logo + page title, matching the Figma header row. */
export default function PageHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <Logo />
      <h1 className="text-[22px] font-bold text-ink">{title}</h1>
    </div>
  );
}
