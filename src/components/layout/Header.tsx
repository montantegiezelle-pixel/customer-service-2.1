import React from 'react';
import { Scissors, Plus, RotateCcw, Download, Upload } from 'lucide-react';

export type ActiveNavTab = 'dashboard' | 'orders' | 'customers' | 'studio' | 'calendar';

interface HeaderProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenNewOrder: () => void;
  onOpenNewCustomer: () => void;
  onResetData: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewOrder,
  onOpenNewCustomer,
  onResetData,
  onExportBackup,
  onImportBackup
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) onImportBackup(content);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs shrink-0">
              <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 transform -rotate-45" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                AtelierTrack
              </span>
              <span className="hidden sm:inline text-[10px] text-slate-500 uppercase tracking-widest font-medium">
                Bespoke & Haute Couture
              </span>
            </div>
          </div>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => onSelectTab('dashboard')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-slate-900 font-semibold border-slate-900'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('orders')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'text-slate-900 font-semibold border-slate-900'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Orders Pipeline
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('customers')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'customers'
                  ? 'text-slate-900 font-semibold border-slate-900'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Clients & Measurements
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('studio')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'studio'
                  ? 'text-slate-900 font-semibold border-slate-900'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Measurement Studio
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('calendar')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'calendar'
                  ? 'text-slate-900 font-semibold border-slate-900'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Fittings Schedule
            </button>
          </nav>

          {/* Zone 3: Primary action + utility tools */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick secondary buttons */}
            <button
              type="button"
              onClick={onOpenNewCustomer}
              className="hidden lg:inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              title="Add a new customer and measure sheet"
            >
              + Client
            </button>

            <button
              type="button"
              onClick={onOpenNewOrder}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Order</span>
            </button>

            {/* Overflow / Data options */}
            <div className="relative group">
              <button
                type="button"
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Backup and Data Management"
                title="Data Tools"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="hidden group-hover:block absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-xs text-slate-700 z-50">
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export JSON Backup</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Import JSON Backup</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset to original demo orders and measurement profiles?')) {
                      onResetData();
                    }
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-700 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-between overflow-x-auto py-2.5 border-t border-slate-100 gap-4 text-xs font-medium text-slate-600 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap ${activeTab === 'dashboard' ? 'text-slate-900 font-bold' : ''}`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('orders')}
            className={`whitespace-nowrap ${activeTab === 'orders' ? 'text-slate-900 font-bold' : ''}`}
          >
            Orders
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('customers')}
            className={`whitespace-nowrap ${activeTab === 'customers' ? 'text-slate-900 font-bold' : ''}`}
          >
            Clients & Measures
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('studio')}
            className={`whitespace-nowrap ${activeTab === 'studio' ? 'text-slate-900 font-bold' : ''}`}
          >
            Studio
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('calendar')}
            className={`whitespace-nowrap ${activeTab === 'calendar' ? 'text-slate-900 font-bold' : ''}`}
          >
            Fittings
          </button>
        </div>
      </div>
    </header>
  );
};
