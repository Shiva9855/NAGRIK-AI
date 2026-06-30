import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  BarChart2, 
  CheckCircle, 
  ChevronRight, 
  MapPin, 
  Search, 
  Briefcase,
  Users,
  ShieldCheck,
  Zap,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Issue, PredictionAnalytics, IssueStatus } from '../types';

interface AuthorityDashboardProps {
  issues: Issue[];
  onUpdateStatus: (issueId: string, newStatus: IssueStatus) => void;
  setActiveTab: (tab: string) => void;
  setSelectedIssueId: (id: string) => void;
}

export default function AuthorityDashboard({ 
  issues, 
  onUpdateStatus,
  setActiveTab,
  setSelectedIssueId
}: AuthorityDashboardProps) {
  
  const [analytics, setAnalytics] = useState<PredictionAnalytics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Load analytical forecast on mount
  useEffect(() => {
    fetch('/api/predictions')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error("Forecast failed", err));
  }, [issues]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f43f5e'];

  const filteredIssues = issues.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusActionLabel = (status: IssueStatus) => {
    switch (status) {
      case 'Reported':
      case 'AI Verified':
        return 'Approve & Assign Crew';
      case 'Community Verified':
        return 'Assign to Dept Representative';
      case 'Assigned':
        return 'Flag as "In Progress"';
      case 'In Progress':
        return 'Mark Resolved & Dispatch Notification';
      default:
        return 'Archive / Close';
    }
  };

  const getNextStatus = (current: IssueStatus): IssueStatus => {
    switch (current) {
      case 'Reported':
      case 'AI Verified':
        return 'Assigned';
      case 'Community Verified':
        return 'Assigned';
      case 'Assigned':
        return 'In Progress';
      case 'In Progress':
        return 'Resolved';
      default:
        return 'Closed';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="authority-dashboard-root">
      
      {/* Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800/60">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-rose-500/10 text-rose-400 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Official console
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Indiranagar Sector Central Command</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center">
            Municipal Operations Dashboard <Building className="w-6 h-6 ml-2 text-emerald-400" />
          </h1>
        </div>

        {/* Dynamic status ticker */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0 text-xs text-slate-400">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold">Dispatch Crew Online: 14/14 Units</span>
        </div>
      </div>

      {/* Grid: Metrics, charts and dispatchers */}
      <div className="space-y-8">
        
        {/* Row 1: High level counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pending Action Log</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-white">{issues.filter(i => i.status !== 'Resolved').length}</span>
              <span className="text-xs text-slate-400">Complaints active</span>
            </div>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Critical Risk Alerts</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-rose-400">{issues.filter(i => i.severity === 'Critical').length}</span>
              <span className="text-xs text-rose-500">Immediate hazard index</span>
            </div>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Avg Municipal Resolution Speed</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-emerald-400">2.7 Days</span>
              <span className="text-xs text-emerald-500">-12% vs last month</span>
            </div>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Citizen Engagement Index</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-purple-400">92% Verified</span>
              <span className="text-xs text-slate-400">Verifications rating</span>
            </div>
          </div>
        </div>

        {/* Row 2: Prediction Analytics charts powered by Recharts */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Categories breakdown (Pie) */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center">
                <Layers className="w-4 h-4 mr-1.5 text-emerald-400" />
                Defects Distribution
              </h3>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryDistribution.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {analytics.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends list */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-900">
                {analytics.categoryDistribution.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded mr-1.5" style={{ backgroundColor: COLORS[idx] }}></span>
                    <span className="truncate">{item.category} ({item.count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Time resolution Trends (Area Line) */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center">
                <TrendingUp className="w-4 h-4 mr-1.5 text-emerald-400" />
                Resolution Lead-Time (Days)
              </h3>
              <div className="h-44 w-full text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.resolutionTimeTrend}>
                    <XAxis dataKey="month" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Area type="monotone" dataKey="avgDays" stroke="#10b981" fillOpacity={0.1} fill="#10b981" />
                    <Line type="monotone" dataKey="targetDays" stroke="#ef4444" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-500 text-center">Avg days taken to resolve complaints monthly vs Target (3.5 Days)</p>
            </div>

            {/* Chart 3: Peak Complaint Hours (Bar) */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-emerald-400" />
                Incoming Peak Complaint Hours
              </h3>
              <div className="h-44 w-full text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.peakHours}>
                    <XAxis dataKey="hour" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-500 text-center">Triage load surges noticeably during midday commute.</p>
            </div>

          </div>
        )}

        {/* Row 3: Dispatch management console */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Dispatch List (2/5 span) */}
          <div className="lg:col-span-2 space-y-4 border border-slate-800 bg-slate-950/60 p-5 rounded-2xl h-[550px] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-widest">Grievance Backlog</h3>
              <div className="relative w-40">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search address..."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 pl-7 py-1 text-[11px] text-white"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredIssues.map((issue) => {
                const isSelected = selectedIssue?.id === issue.id;
                return (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-slate-900 border-emerald-500/50' 
                        : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-emerald-400 font-bold">{issue.category}</span>
                      <span className="text-slate-500">{issue.severity}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-200 line-clamp-1">{issue.title}</h4>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{issue.location.address}</p>
                    
                    <div className="flex items-center justify-between mt-3 text-[9px] pt-2 border-t border-slate-900 text-slate-400">
                      <span>👤 {issue.reporterName}</span>
                      <span className="font-bold text-emerald-400 uppercase">{issue.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dispatch Actions Center (3/5 span) */}
          <div className="lg:col-span-3">
            {selectedIssue ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 h-[550px] flex flex-col justify-between overflow-y-auto scrollbar-thin">
                
                <div className="space-y-4">
                  
                  {/* Category and Severity HUD */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-slate-950 text-emerald-400 border border-slate-800 font-bold px-2.5 py-1 rounded">
                      {selectedIssue.category}
                    </span>
                    <span className="text-xs text-slate-500">ID: {selectedIssue.id}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{selectedIssue.title}</h3>

                  <div className="flex items-center space-x-1 text-slate-400 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{selectedIssue.location.address}</span>
                  </div>

                  {/* Photo Preview inside officials detail drawer */}
                  {selectedIssue.imageUrl && (
                    <div className="aspect-video w-full max-h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-850">
                      <img 
                        src={selectedIssue.imageUrl} 
                        alt="reported photo evidence" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-850">
                    {selectedIssue.description}
                  </p>

                  {/* Triage metadata statistics */}
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 bg-slate-950/40 rounded border border-slate-850">
                      <span className="text-slate-500 block text-[9px]">CONFIDENCE SCORE</span>
                      <span className="text-white font-bold">{selectedIssue.confidenceScore || 95}% Acc</span>
                    </div>
                    <div className="p-2.5 bg-slate-950/40 rounded border border-slate-850">
                      <span className="text-slate-500 block text-[9px]">SEVERITY</span>
                      <span className="text-rose-400 font-bold">{selectedIssue.severity}</span>
                    </div>
                  </div>

                  {/* Current Dispatch info */}
                  <div className="p-3 bg-emerald-950/10 rounded-xl border border-emerald-800/20 text-xs text-slate-300">
                    ⚡ <strong>Assigned department representative:</strong> {selectedIssue.assignedDepartment || 'Solid Waste Division'}. Expected dispatch to begin shortly.
                  </div>

                </div>

                {/* Dispatch operations status update action */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Current Status:</span>
                    <span className="font-extrabold text-emerald-400 uppercase">{selectedIssue.status}</span>
                  </div>

                  {/* Operational flow action button */}
                  {selectedIssue.status !== 'Resolved' && selectedIssue.status !== 'Closed' ? (
                    <button
                      onClick={() => {
                        const next = getNextStatus(selectedIssue.status);
                        onUpdateStatus(selectedIssue.id, next);
                        setSelectedIssue(prev => prev ? { ...prev, status: next } : null);
                      }}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center"
                    >
                      <span>Update Status: <strong>{getNextStatus(selectedIssue.status)}</strong></span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </button>
                  ) : (
                    <div className="text-center py-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-xs font-bold flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-1.5" /> Complaint successfully resolved & closed.
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl h-[550px] flex flex-col items-center justify-center text-center text-slate-500 py-12">
                <Briefcase className="w-10 h-10 text-slate-700 mx-auto mb-2 animate-pulse" />
                <p className="text-xs max-w-xs">Select any incoming reported defect from the backlog stream to begin official triage and coordinate resolution dispatches.</p>
              </div>
            )}
          </div>

        </div>

        {/* Prediction risk heatmap details summary row */}
        {analytics && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-500" />
              AI Hyperlocal Infrastructure Risk Heatmap
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.riskHeatmap.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-850/60 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-slate-200">{item.area}</span>
                    <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                      item.riskScore > 80 ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      Risk: {item.riskScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
