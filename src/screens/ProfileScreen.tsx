import StatusBar from '../components/StatusBar';
import PageHeader from '../components/PageHeader';
import { ChevronRIco } from '../components/icons';

export default function ProfileScreen({ savedCount, mealsPlanned }: { savedCount: number; mealsPlanned: number }) {
  const settings = [
    { label: 'Dietary preferences', value: 'No restrictions' },
    { label: 'Allergies', value: 'None set' },
    { label: 'Household size', value: '2 people' },
    { label: 'Notifications', value: 'Enabled' },
    { label: 'About', value: 'v1.4.2' },
  ];

  return (
    <div className="bg-[#FBF8F3] min-h-full">
      <StatusBar />
      <div className="pb-32">
        {/* Profile header */}
        <div className="px-6 pt-3 pb-6">
          <PageHeader title="Profile" />
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#4A5D3F] flex items-center justify-center text-white text-[24px] font-bold shadow-md">
              S
            </div>
            <div>
              <p className="text-[18px] font-bold text-[#1E1E1E]">Sarah Kim</p>
              <p className="text-[13px] text-[#6B6B6B]">sarah.kim@email.com</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 mt-5">
            {[
              { label: 'Recipes Saved', value: String(savedCount) },
              { label: 'Meals Planned', value: String(mealsPlanned) },
              { label: 'Weeks Planned', value: '12' },
            ].map(stat => (
              <div key={stat.label} className="flex-1 bg-white rounded-2xl px-3 py-3.5 text-center border border-[#F0ECE5] shadow-sm">
                <p className="text-[20px] font-bold text-[#4A5D3F]">{stat.value}</p>
                <p className="text-[10px] text-[#6B6B6B] mt-0.5 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="px-6">
          <p className="text-[13px] font-semibold text-[#6B6B6B] mb-3 uppercase tracking-wide">Settings</p>
          <div className="bg-white rounded-2xl border border-[#F0ECE5] overflow-hidden shadow-sm">
            {settings.map((s, i) => (
              <div key={s.label} className={`flex items-center justify-between px-4 py-3.5 ${i < settings.length - 1 ? 'border-b border-[#F4F1EC]' : ''}`}>
                <span className="text-[14px] text-[#1E1E1E] font-medium">{s.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#6B6B6B]">{s.value}</span>
                  <ChevronRIco />
                </div>
              </div>
            ))}
          </div>

          <button className="mt-5 w-full border border-red-200 text-red-500 text-[14px] font-semibold py-3.5 rounded-full">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
