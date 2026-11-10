import React from 'react';
import { PlusCircle } from 'lucide-react';
import { ScreenMode } from '../types';

interface NavbarProps {
  currentScreen: ScreenMode;
  onNavigate: (screen: ScreenMode) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onNewChat,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-purple-200/50 dark:border-purple-800/40 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-18">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('assistant')}
          className="text-2xl font-black tracking-tight solva-gradient-text whitespace-nowrap shrink-0 cursor-pointer"
        >
          SOLVA
        </button>

        {/* Zone 2: 4 concise single-line text links */}
        <nav className="flex items-center gap-7 text-base font-semibold text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => onNavigate('assistant')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-600 dark:hover:text-purple-400 py-1 ${
              currentScreen === 'assistant'
                ? 'text-purple-600 dark:text-purple-400 underline underline-offset-8 decoration-2 decoration-purple-600 font-bold'
                : ''
            }`}
          >
            Assistant
          </button>

          <button
            type="button"
            onClick={() => onNavigate('history')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-600 dark:hover:text-purple-400 py-1 ${
              currentScreen === 'history'
                ? 'text-purple-600 dark:text-purple-400 underline underline-offset-8 decoration-2 decoration-purple-600 font-bold'
                : ''
            }`}
          >
            History
          </button>

          <button
            type="button"
            onClick={() => onNavigate('welcome')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-600 dark:hover:text-purple-400 py-1 ${
              currentScreen === 'welcome'
                ? 'text-purple-600 dark:text-purple-400 underline underline-offset-8 decoration-2 decoration-purple-600 font-bold'
                : ''
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-purple-600 dark:hover:text-purple-400 py-1"
          >
            Settings
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onNewChat}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-sky-500 hover:opacity-95 rounded-2xl shadow-md shadow-purple-500/25 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
