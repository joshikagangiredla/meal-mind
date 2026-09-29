/**
 * Phone status bar. The app renders one pinned copy at the top of the frame
 * (see App.tsx); screens use <StatusBarSpacer /> to leave room for it.
 */
export default function StatusBar({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  const col = dark ? 'text-white' : 'text-[#1E1E1E]';
  const fill = dark ? 'white' : '#1E1E1E';
  return (
    <div className={`flex justify-between items-center px-6 pt-3 pb-1 text-[13px] font-semibold transition-colors duration-200 ${col} ${className}`}>
      <span>9:46</span>
      <div className="flex gap-1.5 items-center">
        <svg width="16" height="11" viewBox="0 0 16 11" fill={fill}>
          <rect x="0" y="7" width="2.5" height="4" rx="0.5" /><rect x="3.5" y="5" width="2.5" height="6" rx="0.5" />
          <rect x="7" y="2.5" width="2.5" height="8.5" rx="0.5" /><rect x="10.5" y="0" width="2.5" height="11" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill={fill}>
          <path d="M8 3C5.2 3 2.7 4.1 0.8 6l1.4 1.4C3.5 5.9 5.6 5 8 5s4.5.9 5.8 2.4L15.2 6C13.3 4.1 10.8 3 8 3z" opacity="0.4" />
          <path d="M8 6c-1.9 0-3.6.8-4.8 2l1.4 1.4C5.4 8.5 6.6 8 8 8s2.6.5 3.4 1.4L12.8 8C11.6 6.8 9.9 6 8 6z" opacity="0.7" />
          <path d="M8 9c-.9 0-1.7.4-2.3 1l2.3 2 2.3-2C9.7 9.4 8.9 9 8 9z" />
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke={fill} />
          <rect x="1.5" y="1.5" width="15" height="9" rx="2" fill={fill} />
          <path d="M22 4v4a2 2 0 0 1 0-4z" fill={fill} opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

/** Invisible copy that takes up exactly the status bar's height. */
export function StatusBarSpacer() {
  return <div aria-hidden className="invisible"><StatusBar /></div>;
}
