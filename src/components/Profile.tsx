import React from 'react';
import { 
  User, 
  Award, 
  CheckCircle, 
  ShieldCheck, 
  Calendar, 
  Sparkles, 
  MapPin, 
  TrendingUp,
  Heart,
  Mail,
  Zap,
  Activity,
  ChevronRight
} from 'lucide-react';
import { UserProfile, Issue } from '../types';

interface ProfileProps {
  userProfile: UserProfile | null;
  issues: Issue[];
  setActiveTab: (tab: string) => void;
  setSelectedIssueId: (id: string) => void;
}

export default function Profile({ userProfile, issues, setActiveTab, setSelectedIssueId }: ProfileProps) {
  if (!userProfile) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-6" id="profile-guest-cta">
        <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Join the Citizen Network</h3>
          <p className="text-slate-400 text-sm">Create an account or sign in to view your profile, earn XP, track reported issues, and claim badges!</p>
        </div>
        <button
          onClick={() => setActiveTab('auth')}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-all text-sm w-full cursor-pointer"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  // Filter personal reports submitted by current user (Amit Patel - user-1)
  const myReports = issues.filter(i => i.reporterId === 'user-1' || i.reporterId === userProfile.id);

  // Generate a mock contribution grid of the last 30 days to build a beautiful Git-like panel
  const getContributionColor = (weight: number) => {
    if (weight === 0) return 'bg-slate-900 border border-slate-850';
    if (weight <= 1) return 'bg-emerald-950 border border-emerald-900';
    if (weight <= 3) return 'bg-emerald-800';
    return 'bg-emerald-400 text-slate-950 font-bold';
  };

  // Generate 28 boxes represents 4 weeks contribution grid
  const mockGridDays = Array.from({ length: 28 }, (_, i) => {
    const dayOffset = 27 - i;
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    const dateString = date.toISOString().split('T')[0];
    const weight = userProfile.contributionGraph[dateString] || 0;
    return { date: dateString, weight };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8" id="profile-root">
      
      {/* Profile Overview Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Left segment */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            {userProfile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-extrabold text-white">{userProfile.name}</h2>
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.5 rounded">CIVIC EXPERT</span>
            </div>
            
            <div className="flex items-center space-x-1.5 text-slate-500 text-xs mt-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{userProfile.email}</span>
              <span className="text-slate-700">•</span>
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Indiranagar Ward 80</span>
            </div>
          </div>
        </div>

        {/* Right Segment: Score & Rank */}
        <div className="flex items-center space-x-6 text-right font-mono border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 pl-0 md:pl-6">
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Citizen Score</span>
            <span className="text-2xl font-black text-emerald-400">{userProfile.points} XP</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Ward Rank</span>
            <span className="text-2xl font-black text-purple-400">#{userProfile.rank}</span>
          </div>
        </div>

      </div>

      {/* Grid: Stats counters and Contribution Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left segment stats */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1">Engagement Metrics</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-center">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Complaints Reported</span>
              <span className="block text-2xl font-black text-white mt-1">{userProfile.reportsCount}</span>
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-center">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Verifications Made</span>
              <span className="block text-2xl font-black text-white mt-1">{userProfile.verificationsCount}</span>
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-center col-span-2">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Successful Resolutions</span>
              <span className="block text-xl font-extrabold text-emerald-400 mt-1">🎉 {userProfile.resolutionsCount} local sectors cleaned</span>
            </div>
          </div>
        </div>

        {/* Right segment: Git-style contribution grid (2/3 span) */}
        <div className="lg:col-span-2 p-5 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
              <Activity className="w-4 h-4 mr-1.5 text-emerald-400" />
              Community Contribution Grid
            </h4>
            <span className="text-[10px] text-slate-500">Last 28 days</span>
          </div>

          {/* Grid display */}
          <div className="grid grid-cols-7 gap-2">
            {mockGridDays.map((day, idx) => (
              <div 
                key={idx}
                title={`Date: ${day.date} • weight: ${day.weight} contributions`}
                className={`aspect-square rounded-md flex items-center justify-center text-[9px] transition-transform hover:scale-110 cursor-pointer ${getContributionColor(day.weight)}`}
              >
                {day.weight > 0 && day.weight}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end space-x-1.5 text-[10px] text-slate-500">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-800"></span>
            <span className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-900"></span>
            <span className="w-2.5 h-2.5 rounded bg-emerald-800"></span>
            <span className="w-2.5 h-2.5 rounded bg-emerald-400"></span>
            <span>More</span>
          </div>
        </div>

      </div>

      {/* Badges unlocked section */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1">Unlocked Digital Badges</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userProfile.badges.map((b, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 flex items-center justify-center text-xl shadow-inner border border-emerald-800/10">
                {b.name.includes('Hero') ? '🏆' : b.name.includes('Guardian') ? '🛡️' : b.name.includes('Volunteer') ? '❤️' : '⭐'}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-200 text-sm">{b.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{b.description}</p>
                <span className="inline-block text-[8px] uppercase tracking-wider font-extrabold bg-emerald-500/15 text-emerald-400 px-2 py-0.2 rounded-full mt-2">
                  Active Badge
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal reports stream list */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1">My Reported Grievances ({myReports.length})</h3>
        
        <div className="space-y-3">
          {myReports.length > 0 ? (
            myReports.map((report) => (
              <div 
                key={report.id}
                onClick={() => {
                  setSelectedIssueId(report.id);
                  setActiveTab('feed');
                }}
                className="p-4 bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800 rounded-xl cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  {report.imageUrl && (
                    <img 
                      src={report.imageUrl} 
                      alt="defect evidence thumbnail" 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-200 truncate">{report.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{report.location.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-850 px-2 py-0.5 rounded-full uppercase">
                    {report.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 bg-slate-900/10 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
              No reported grievances registered yet. Use the **Report Issue** tab to begin!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
