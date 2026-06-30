import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Sparkles, 
  Compass, 
  ThumbsUp, 
  ShieldCheck, 
  X, 
  ExternalLink,
  DollarSign,
  Clock,
  Filter,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Building,
  Calendar
} from 'lucide-react';
import { Issue, IssueCategory, IssueStatus } from '../types';

interface MapViewProps {
  issues: Issue[];
  onUpvoteIssue: (id: string) => void;
  onVerifyIssue: (id: string) => void;
  setActiveTab: (tab: string) => void;
  setSelectedIssueId: (id: string) => void;
}

export default function MapView({ 
  issues, 
  onUpvoteIssue, 
  onVerifyIssue,
  setActiveTab,
  setSelectedIssueId
}: MapViewProps) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Focus initially on first issue on mount if available
  useEffect(() => {
    if (issues.length > 0 && !selectedIssue) {
      setSelectedIssue(issues[0]);
    }
  }, [issues]);

  const categories = ['All', 'Road Damage', 'Garbage', 'Water Leakage', 'Drainage', 'Streetlight', 'Electric Pole Damage', 'Others'];

  // Boundaries coordinates centered around Bengaluru Indiranagar Ward
  const mapCenter = { lat: 12.9716, lng: 77.5946 };
  
  const filteredIssues = issues.filter(i => {
    const matchesSearch = 
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || i.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getMarkerColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-rose-500 shadow-rose-500/50';
      case 'High': return 'bg-amber-500 shadow-amber-500/50';
      case 'Medium': return 'bg-sky-400 shadow-sky-400/50';
      default: return 'bg-emerald-400 shadow-emerald-400/50';
    }
  };

  const getSeverityLabelColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
      case 'High': return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
      case 'Medium': return 'text-sky-400 border-sky-500/20 bg-sky-500/10';
      default: return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    }
  };

  // Convert coordinate latitude/longitude relative to the viewport SVG (Indiranagar/Koramangala coordinate mapping)
  const getSvgCoordinates = (lat: number, lng: number) => {
    // Map latitude 12.90 to 12.99 -> SVG Y-axis (10% to 90%)
    // Map longitude 77.55 to 77.66 -> SVG X-axis (10% to 90%)
    const minLat = 12.89;
    const maxLat = 12.99;
    const minLng = 77.55;
    const maxLng = 77.66;

    const percentX = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Y coordinate is inverted in SVG
    const percentY = 100 - (((lat - minLat) / (maxLat - minLat)) * 100);

    return { 
      x: Math.min(Math.max(percentX, 5), 95), 
      y: Math.min(Math.max(percentY, 5), 95) 
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="map-view-root">
      
      {/* Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center">
            Interactive Hyperlocal Map <Sparkles className="w-5 h-5 ml-2 text-rose-500" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time coordinate plotting of infrastructure faults in Indiranagar & Koramangala sectors.
          </p>
        </div>

        {/* Categories toggler */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin mt-3 sm:mt-0">
          <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat 
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' 
                  : 'bg-slate-900 text-slate-400 border border-slate-850 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map Plotter on Left, Selected Issue details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        
        {/* Left Side: SVG Coordinate Mapping Plotter (2/3 width) */}
        <div className="lg:col-span-2 relative h-full bg-slate-900 overflow-hidden flex flex-col justify-between">
          
          {/* Map Grid background simulation */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-40"></div>
          
          {/* Custom vector styling for city zones */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Simulated main roads */}
            <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#10b981" strokeWidth="8" strokeDasharray="5,5" />
            <line x1="80%" y1="10%" x2="20%" y2="90%" stroke="#10b981" strokeWidth="6" />
            <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#38bdf8" strokeWidth="4" />
            {/* Ward Zones */}
            <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="10,5" />
            <text x="35%" y="45%" fill="#ffffff" fontSize="12" fontWeight="bold">Ward 80 Zone Boundary</text>
            <text x="65%" y="65%" fill="#ffffff" fontSize="12" fontWeight="bold">Ward 151 South</text>
          </svg>

          {/* Quick instructions HUD */}
          <div className="absolute top-4 left-4 z-10 max-w-xs bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            <span className="font-extrabold text-white block mb-1">🗺️ Hyperlocal HUD</span>
            Click on any color-coded marker to view reported photos, real-time status timelines, and dispatch departments. Double click anywhere to select coordinate points.
          </div>

          {/* Markers overlay */}
          <div className="absolute inset-0 z-20">
            {filteredIssues.map((issue) => {
              const { x, y } = getSvgCoordinates(issue.location.lat, issue.location.lng);
              const isSelected = selectedIssue?.id === issue.id;

              return (
                <button
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-125 focus:outline-none"
                  title={issue.title}
                >
                  <div className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'bg-rose-500 text-white scale-110 border-white ring-4 ring-rose-500/20' 
                      : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-white'
                  }`}>
                    {/* Tiny representation of category */}
                    <span className="text-[10px]">📍</span>

                    {/* Ping ripple effect for critical ones */}
                    {issue.severity === 'Critical' && (
                      <span className="absolute inset-0 flex h-full w-full rounded-full animate-ping bg-rose-500/40 opacity-75"></span>
                    )}

                    {/* Mini HUD popover hover details */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-slate-950 text-slate-300 px-2 py-1 rounded border border-slate-800 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 font-semibold shadow-xl">
                      <span className="text-white font-bold block truncate">{issue.title}</span>
                      <span className="text-emerald-400 block mt-0.5">{issue.category}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Simulated Compass Widget */}
          <div className="absolute bottom-4 right-4 z-10 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span>N 12.9716° • E 77.5946°</span>
          </div>

        </div>

        {/* Right Side: Detailed Profile of Selected Marker (1/3 width) */}
        <div className="h-full border-l border-slate-800 overflow-y-auto p-5 space-y-5 bg-slate-950/90 scrollbar-thin">
          {selectedIssue ? (
            <div className="space-y-4">
              
              {/* Header category and close */}
              <div className="flex items-center justify-between">
                <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedIssue.category}
                </span>
                
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getSeverityLabelColor(selectedIssue.severity)}`}>
                  {selectedIssue.severity} Severity
                </span>
              </div>

              {/* Title & Location address */}
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {selectedIssue.title}
                </h3>
                <div className="flex items-center space-x-1 text-slate-400 text-xs mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span className="truncate">{selectedIssue.location.address}</span>
                </div>
              </div>

              {/* Photo */}
              {selectedIssue.imageUrl && (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img 
                    src={selectedIssue.imageUrl} 
                    alt="reported fault" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                {selectedIssue.description}
              </p>

              {/* Status and expected repair parameters */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block text-[9px] mb-0.5">CURRENT STATUS</span>
                  <span className="text-emerald-400 font-bold">{selectedIssue.status}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block text-[9px] mb-0.5">EST. REPAIR COST</span>
                  <span className="text-white font-bold">₹{selectedIssue.estimatedCost.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block text-[9px] mb-0.5">ASSIGNED DEPARTMENT</span>
                  <span className="text-white text-[10px] block truncate" title={selectedIssue.assignedDepartment}>
                    {selectedIssue.assignedDepartment || 'Triage In Progress'}
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block text-[9px] mb-0.5">ESTIMATED TIMELINE</span>
                  <span className="text-white font-bold">{selectedIssue.estimatedTime}</span>
                </div>
              </div>

              {/* Community Actions inside Map */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => onUpvoteIssue(selectedIssue.id)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Support ({selectedIssue.upvotes})</span>
                </button>

                <button
                  onClick={() => onVerifyIssue(selectedIssue.id)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify ({selectedIssue.verifications.length})</span>
                </button>
              </div>

              {/* View full details route link */}
              <button
                onClick={() => {
                  setSelectedIssueId(selectedIssue.id);
                  setActiveTab('feed');
                }}
                className="w-full py-2.5 rounded-lg border border-dashed border-slate-800 text-xs text-slate-400 hover:text-white flex items-center justify-center mt-2 hover:border-slate-600 transition-colors"
              >
                Open detailed dialogue & timeline <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </button>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <Compass className="w-10 h-10 mb-2 animate-pulse text-slate-700" />
              <p className="text-sm">Select an active municipal fault to display localized metadata details.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
