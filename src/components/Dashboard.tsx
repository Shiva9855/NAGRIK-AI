import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle,
  Clock,
  ThumbsUp,
  MessageSquare,
  Award,
  ChevronRight,
  Map
} from 'lucide-react';
import { Issue, IssueCategory, IssueStatus } from '../types';

interface DashboardProps {
  issues: Issue[];
  setActiveTab: (tab: string) => void;
  setSelectedIssueId: (id: string) => void;
  userPoints: number;
  userRank: number;
}

export default function Dashboard({ 
  issues, 
  setActiveTab, 
  setSelectedIssueId, 
  userPoints, 
  userRank 
}: DashboardProps) {
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('newest');

  const categories = ['All', 'Road Damage', 'Garbage', 'Water Leakage', 'Drainage', 'Streetlight', 'Electric Pole Damage', 'Others'];
  const statuses = ['All', 'Reported', 'AI Verified', 'Community Verified', 'In Progress', 'Resolved'];

  // Calculations
  const totalReported = issues.length;
  const activeIssues = issues.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
  const resolvedIssues = issues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
  const communityVerificationsCount = issues.reduce((acc, curr) => acc + curr.verifications.length, 0);

  // Filter and Sort execution
  const filteredIssues = issues.filter(i => {
    const matchesSearch = 
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || i.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || i.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (selectedSort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (selectedSort === 'severity') {
      const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    } else if (selectedSort === 'votes') {
      return b.upvotes - a.upvotes;
    }
    return 0;
  });

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-rose-500/15 text-rose-400 border border-rose-500/25';
      case 'High': return 'bg-amber-500/15 text-amber-400 border border-amber-500/25';
      case 'Medium': return 'bg-sky-500/15 text-sky-400 border border-sky-500/25';
      default: return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  const getStatusBadgeColor = (status: IssueStatus) => {
    switch (status) {
      case 'Resolved':
      case 'Closed':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';
      case 'In Progress':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/20';
      case 'Community Verified':
        return 'bg-purple-500/15 text-purple-400 border border-purple-500/20';
      case 'AI Verified':
        return 'bg-teal-500/15 text-teal-400 border border-teal-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="dashboard-root">
      
      {/* Welcome & Quick Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-800/60">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center">
            Hi, Amit Patel <Sparkles className="w-5 h-5 ml-2 text-yellow-400 fill-yellow-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Indiranagar Ward Helper • Active contribution streak: 6 Days
          </p>
        </div>

        {/* Rapid Actions */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setActiveTab('report')}
            className="flex items-center px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all duration-200 shadow-lg shadow-emerald-500/10"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Report Civic Issue
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className="flex items-center px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-all"
          >
            <Map className="w-4 h-4 mr-1.5 text-rose-500" />
            Browse Map View
          </button>
        </div>
      </div>

      {/* Gamification mini visual widget */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        
        {/* Helper stats */}
        <div className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Citizen Level Points</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{userPoints} XP</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Top 3% this month</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-lg">
            🏆
          </div>
        </div>

        {/* Global Leaderboard rank */}
        <div className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Ward Leaderboard Rank</span>
            <h3 className="text-2xl font-black text-purple-400 mt-1">#{userRank}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Ranked in Indiranagar Ward</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-lg">
            👑
          </div>
        </div>

        {/* Active open complaints count */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Ward Reports</span>
            <h3 className="text-2xl font-black text-white mt-1">{activeIssues} Open</h3>
            <p className="text-[10px] text-amber-400 mt-0.5">⚠️ Needs volunteer verifications</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* Resolved complaints count */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Solved Civic Reports</span>
            <h3 className="text-2xl font-black text-white mt-1">{resolvedIssues} Done</h3>
            <p className="text-[10px] text-emerald-400 mt-0.5">⚡ Verified by municipal board</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

      </div>

      {/* Main Grid: Feed & Filters on Left, Predictions & Heatmap on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Issues feeds and Filtering (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 pb-4 border-b border-slate-800/40">
            <h2 className="text-xl font-bold text-white flex items-center">
              Active Civic Complaints
              <span className="ml-2.5 text-xs bg-slate-800 text-slate-400 font-semibold px-2 py-0.5 rounded-full">
                {filteredIssues.length} found
              </span>
            </h2>

            {/* Quick Sort dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">Sort by:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg text-xs text-white px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="newest">Newest first</option>
                <option value="severity">Highest severity</option>
                <option value="votes">Most supported</option>
              </select>
            </div>
          </div>

          {/* Search bar and horizontal filtering pill tags */}
          <div className="space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by keywords, street address or ward..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category selection scroll bar */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10' 
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Issues List Container */}
          <div className="space-y-4">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <div 
                  key={issue.id}
                  onClick={() => {
                    setSelectedIssueId(issue.id);
                    setActiveTab('feed'); // Route to feed which has details drawer
                  }}
                  className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col md:flex-row gap-5"
                >
                  
                  {/* Image wrapper */}
                  {issue.imageUrl && (
                    <div className="w-full md:w-44 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-slate-950">
                      <img 
                        src={issue.imageUrl} 
                        alt="civic defect" 
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Text details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      {/* Top row */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                          {issue.category}
                        </span>
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${getSeverityBadgeColor(issue.severity)}`}>
                            {issue.severity}
                          </span>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${getStatusBadgeColor(issue.status)}`}>
                            {issue.status}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-white truncate hover:text-emerald-400 transition-colors">
                        {issue.title}
                      </h3>

                      {/* Description truncate */}
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>

                    {/* Bottom Metadata row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/40 mt-3 text-[11px] text-slate-500">
                      
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{issue.location.address}</span>
                      </div>

                      <div className="flex items-center space-x-3 font-semibold text-slate-400">
                        <div className="flex items-center space-x-1 hover:text-emerald-400">
                          <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{issue.upvotes} supports</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                          <span>{issue.verifications.length} verifications</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                          <span>{issue.comments.length} comments</span>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              ))
            ) : (
              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto text-slate-500 mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-200">No complaints match filters</h4>
                <p className="text-xs text-slate-500 mt-1">Try clearing filters or looking in other wards.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Smart Analytics overview & Ward info (1/3 width) */}
        <div className="space-y-6">
          
          {/* AI Predictive Insight Card */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center text-xs">
                🧠
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">NagrikAI Forecaster</h4>
                <p className="text-[10px] text-emerald-300 font-medium">Real-time local prediction log</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-emerald-800/10">
              🚨 <strong>High Risk Notice:</strong> post-monsoon asphalt erosion is expected to increase pothole risk on <strong>Indiranagar Metro Road</strong> by <strong>18%</strong> over next 14 days. SWM crews are recommended to clear commercial trash piles before afternoon rains.
            </p>

            <button
              onClick={() => setActiveTab('help')}
              className="mt-4 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-end w-full group"
            >
              Learn about AI model
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Leaderboard snippet */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Top Ward Helpers</h3>
              <button 
                onClick={() => setActiveTab('leaderboard')}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: "Rajesh Kumar", points: "740 XP", rank: "Rank 1", medal: "🥇" },
                { name: "Amit Patel (You)", points: "580 XP", rank: "Rank 2", medal: "🥈" },
                { name: "Ananya Rao", points: "410 XP", rank: "Rank 3", medal: "🥉" }
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/40 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">{h.medal}</span>
                    <div>
                      <span className="font-bold text-slate-200">{h.name}</span>
                      <p className="text-[10px] text-slate-500">{h.rank}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-400">{h.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick FAQ info panel */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">How Platform Works</h4>
            <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <p>📍 <strong>Image Geotagging:</strong> AI checks image similarity to detect duplicate reports within 120m.</p>
              <p>🛡️ <strong>Verification:</strong> Get 3 local citizens to verify your complaint to push it straight to ward commissioner log.</p>
              <p>🎁 <strong>Civic Rewards:</strong> Earn 50 XP for filing, 20 XP for verifying. Redeem badges for tax benefits.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
