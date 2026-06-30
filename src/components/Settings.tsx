import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Languages, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  FileText, 
  Mic
} from 'lucide-react';

export default function Settings() {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState('English');
  const [notifyOnStatus, setNotifyOnStatus] = useState(true);
  const [notifyOnUpvotes, setNotifyOnUpvotes] = useState(true);
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8" id="settings-root">
      
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white flex items-center">
          Platform Settings <SettingsIcon className="w-6 h-6 ml-2 text-emerald-400" />
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure notification alerts, language localization preferences, and review development details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Navigation / Category list (1/3 width) */}
        <div className="space-y-2.5">
          <button className="w-full text-left p-3 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-xs flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>General Preferences</span>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-slate-900 text-slate-400 font-medium text-xs flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Alert Controls</span>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-slate-900 text-slate-400 font-medium text-xs flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4" />
            <span>API & Integrations</span>
          </button>
        </div>

        {/* Right Side: Configuration forms (2/3 width) */}
        <div className="md:col-span-2 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6">
          <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3">General Configuration</h3>
          
          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 rounded-lg flex items-center">
              <Check className="w-4 h-4 mr-2" /> Settings updated successfully.
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-5">
            
            {/* Language Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">Default Multilingual Mode</label>
              <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-xl border border-slate-850">
                <Languages className="w-4 h-4 text-emerald-400 mr-1.5" />
                <select
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                  className="bg-transparent border-none text-xs text-white focus:outline-none focus:ring-0 flex-1 py-1.5"
                >
                  <option value="English">English (Default)</option>
                  <option value="Hindi">Hindi / हिन्दी</option>
                  <option value="Marathi">Marathi / मराठी</option>
                  <option value="Kannada">Kannada / ಕನ್ನಡ</option>
                  <option value="Tamil">Tamil / தமிழ்</option>
                </select>
              </div>
            </div>

            {/* Notification triggers */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-400">Notification Alerts Triggers</label>
              
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
                <div>
                  <span className="text-xs text-slate-200 block font-bold">Status Pipeline Change</span>
                  <span className="text-[10px] text-slate-500">Alert me when my filed complaint is dispatched or resolved.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyOnStatus} 
                  onChange={(e) => setNotifyOnStatus(e.target.checked)}
                  className="w-4.5 h-4.5 bg-slate-900 border-slate-800 rounded text-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
                <div>
                  <span className="text-xs text-slate-200 block font-bold">Community Support Votes</span>
                  <span className="text-[10px] text-slate-500">Alert me when neighbors verify or upvote my reported issue.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyOnUpvotes} 
                  onChange={(e) => setNotifyOnUpvotes(e.target.checked)}
                  className="w-4.5 h-4.5 bg-slate-900 border-slate-800 rounded text-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-colors"
            >
              Save Configuration Preferences
            </button>

          </form>

          {/* Hackathon Pitch Materials segment */}
          <div className="pt-6 border-t border-slate-800/80 space-y-4">
            <div className="flex items-center space-x-1.5 text-yellow-400 font-bold text-xs">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>NagrikAI Hackathon Pitch Guide</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 text-xs text-slate-400 leading-relaxed font-mono">
              <p className="font-extrabold text-white mb-1.5">📢 Pitch Highlight Sequence:</p>
              <p>1. <strong>Problem Statement:</strong> 82% of traditional municipal portals fail due to spam, redundant duplicates, and poor classification.</p>
              <p>2. <strong>The AI Innovation:</strong> NagrikAI parses pictures, matches duplicates within 120m, estimates repair schedules, and prompts crowdsourced verifications.</p>
              <p>3. <strong>Gamification:</strong> Converting digital XP into property tax deductions or metro pass rewards.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
