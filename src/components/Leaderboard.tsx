import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  Sparkles, 
  Users, 
  Zap, 
  ShieldCheck, 
  Gift, 
  ChevronRight, 
  Crown,
  TrendingUp,
  Heart
} from 'lucide-react';
import { UserProfile } from '../types';

interface LeaderboardProps {
  leaderboardData: UserProfile[];
}

export default function Leaderboard({ leaderboardData }: LeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeaders = leaderboardData.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const redeemableOffers = [
    { title: "5% Property Tax Discount", cost: "500 XP", desc: "Redeem against annual municipal house tax assessments.", agency: "BBMP Ward Board" },
    { title: "Free Monthly Metro Pass", cost: "350 XP", desc: "Access all local urban transit services entirely free for 30 days.", agency: "Metro Rail Corp" },
    { title: "SWM Compost Bag Dispatch", cost: "150 XP", desc: "Get free organic municipal solid waste compost delivered for home gardening.", agency: "Solid Waste Division" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="leaderboard-root">
      
      {/* Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800/60">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center">
            Citizen Leaderboard <Crown className="w-6 h-6 ml-2 text-yellow-400 fill-yellow-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Celebrating community heroes improving local municipal sectors daily.
          </p>
        </div>

        {/* Dynamic active indicators */}
        <div className="flex items-center space-x-4 mt-4 md:mt-0 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">420+ Helpers active</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="font-bold text-white">35,200 XP distributed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Global ranks listing (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Header search bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white">Hyperlocal Ranks</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search helper name..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Leaders Listing Grid */}
          <div className="space-y-2.5">
            {filteredLeaders.map((user) => {
              const isCurrentUser = user.id === 'user-1'; // Amit Patel
              return (
                <div 
                  key={user.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                    isCurrentUser 
                      ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-emerald-500/30' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-750'
                  }`}
                >
                  {/* Left segment */}
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-mono font-bold text-slate-400 w-8 text-center">
                      {getRankMedal(user.rank)}
                    </span>

                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-sm ${
                      isCurrentUser ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-200'
                    }`}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-100">{user.name}</span>
                        {isCurrentUser && (
                          <span className="text-[9px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">YOU</span>
                        )}
                      </div>
                      
                      {/* Achievements count mini tags */}
                      <div className="flex items-center space-x-2.5 text-[10px] text-slate-500 mt-1">
                        <span>📝 {user.reportsCount} reported</span>
                        <span>•</span>
                        <span>🛡️ {user.verificationsCount} verified</span>
                        <span>•</span>
                        <span>✅ {user.resolutionsCount} resolved</span>
                      </div>
                    </div>
                  </div>

                  {/* Right segment: Badges & total XP points */}
                  <div className="flex items-center space-x-5 mt-3 sm:mt-0 justify-end">
                    
                    {/* Badge icons list */}
                    <div className="flex -space-x-1 overflow-hidden">
                      {user.badges.slice(0, 3).map((b, idx) => (
                        <div 
                          key={idx} 
                          title={`${b.name}: ${b.description}`}
                          className="w-6 h-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs cursor-pointer hover:-translate-y-1 transition-transform"
                        >
                          {b.name.includes('Hero') ? '🏆' : b.name.includes('Guardian') ? '🛡️' : b.name.includes('Volunteer') ? '❤️' : '⭐'}
                        </div>
                      ))}
                    </div>

                    {/* Score */}
                    <span className="font-black text-emerald-400 text-sm w-20 text-right">{user.points} XP</span>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Right Side: Redemptions / Tax coupons (1/3 width) */}
        <div className="space-y-6">
          
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            
            <div className="flex items-center space-x-2 text-yellow-400 font-bold text-sm">
              <Gift className="w-4.5 h-4.5" />
              <span>Redeem Citizen Rewards</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Reward points are powered by Municipal Civic-Credits. Convert your verified helper XP into valuable municipal offsets.
            </p>

            <div className="space-y-3 pt-2">
              {redeemableOffers.map((offer, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-850/60 text-xs">
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-slate-200">{offer.title}</span>
                    <span className="text-emerald-400 text-[11px]">{offer.cost}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{offer.desc}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-900">
                    <span className="text-[8px] uppercase tracking-wider text-slate-600 font-bold">Via {offer.agency}</span>
                    <button className="text-[10px] font-bold text-emerald-400 hover:underline">Claim</button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Guidelines on earning points */}
          <div className="p-5 bg-gradient-to-br from-emerald-950/10 to-teal-950/10 border border-emerald-500/10 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">How to earn points?</h4>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>📌 <strong>File unique report:</strong> Earn <strong>+50 XP</strong> once verified by AI scanner.</p>
              <p>🛡️ <strong>Verify nearby issue:</strong> Earn <strong>+20 XP</strong> for physically visiting and upvoting.</p>
              <p>🎉 <strong>Successful repair:</strong> Get <strong>+100 XP</strong> if a report you flagged gets marked resolved.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
