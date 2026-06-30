import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Trash2,
  Hourglass
} from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: {
    id: string;
    title: string;
    text: string;
    type: 'status' | 'verification' | 'system';
    time: string;
    read: boolean;
  }[];
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
}

export default function NotificationsDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearNotifications
}: NotificationsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="notifications-drawer-root">
      
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Drawer Container */}
      <div className="relative w-96 max-w-full h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between z-10 animate-slide-left">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-2">
            <Bell className="w-4.5 h-4.5 text-emerald-400" />
            <span className="font-bold text-white text-sm">Citizen Alerts</span>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of alerts */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-3 rounded-xl border text-xs relative ${
                  n.read 
                    ? 'bg-slate-900/40 border-slate-850/60' 
                    : 'bg-emerald-500/5 border-emerald-500/20 shadow shadow-emerald-500/5'
                }`}
              >
                {/* Visual marker dot */}
                {!n.read && (
                  <span className="absolute top-3.5 right-3 h-2 w-2 rounded-full bg-emerald-400"></span>
                )}

                <div className="flex items-start space-x-3 pr-4">
                  <div className="mt-0.5">
                    {n.type === 'status' ? (
                      <Hourglass className="w-4 h-4 text-sky-400" />
                    ) : n.type === 'verification' ? (
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-200">{n.title}</h5>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">{n.text}</p>
                    <span className="text-[10px] text-slate-500 block mt-2">{n.time}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-slate-500 py-20">
              <Bell className="w-8 h-8 text-slate-700 mb-2 animate-pulse" />
              <p className="text-xs">No notifications yet. You will receive notifications when issues status updates.</p>
            </div>
          )}
        </div>

        {/* Bottom footer buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3 text-xs font-semibold">
          <button 
            onClick={onMarkAllRead}
            disabled={notifications.length === 0}
            className="flex-1 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition-colors disabled:opacity-40"
          >
            Mark all read
          </button>
          <button 
            onClick={onClearNotifications}
            disabled={notifications.length === 0}
            className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-rose-400 transition-colors disabled:opacity-40"
            title="Clear All"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
