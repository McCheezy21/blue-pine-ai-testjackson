import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTenantInfo } from '@/utils/tenantAuth';
import { ChatInterface } from '@/components/dashboard/ChatInterface';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { DashboardView } from '@/pages/Dashboard';
import { Sparkles } from 'lucide-react';

const exampleActions = [
  { label: 'Blue Pine AI', onClick: () => {} },
  { label: 'Playbooks', onClick: () => {} },
  { label: 'Documentation', onClick: () => {} },
];

const TenantWelcome = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const [tenantName, setTenantName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>('home');

  useEffect(() => {
    if (!tenantId) return;
    setLoading(true);
    getTenantInfo(tenantId)
      .then((tenant) => {
        setTenantName(tenant?.name || tenantId);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load tenant info');
        setLoading(false);
      });
  }, [tenantId]);

  const userToken = localStorage.getItem('idToken') || localStorage.getItem('accessToken') || '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EAEFF2]">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EAEFF2]">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAEFF2] font-['Inter',system-ui,sans-serif]">
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />
      <div className={`transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-16'}`}> 
        <Header onSettingsClick={() => {}} />
        <main className="p-6 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center mt-10 mb-6">
            <span className="rounded-full bg-[#EAEFF2] p-3 mb-4">
              <Sparkles className="w-8 h-8 text-[#004466]" />
            </span>
            <h1 className="text-4xl font-bold text-[#004466] mb-2">Hi, {tenantName}!</h1>
          </div>
          {/* Chat Card */}
          <div className="w-full max-w-2xl flex flex-col items-center justify-center">
            <div className="w-full bg-white rounded-3xl shadow-2xl border border-[#CCCCCC] p-0 min-h-[420px] flex flex-col justify-between transition-all duration-300">
              <div className="flex-1 flex flex-col justify-end">
                <ChatInterface tenantId={tenantId!} userToken={userToken} embeddedMode={true} />
              </div>
            </div>
            {/* Example action buttons below the chat card */}
            <div className="flex flex-row gap-4 justify-center mt-10">
              {exampleActions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="px-8 py-4 rounded-2xl bg-white shadow border border-[#CCCCCC] text-lg font-semibold text-[#004466] hover:bg-[#EAEFF2] hover:border-[#005580] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#004466]"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TenantWelcome; 