import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ShieldCheck, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Send, 
  Award, 
  Sparkles, 
  CheckCircle,
  Building,
  User,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Issue, Comment, IssueStatus } from '../types';

interface FeedProps {
  issues: Issue[];
  onUpvoteIssue: (id: string) => void;
  onVerifyIssue: (id: string) => void;
  onAddComment: (issueId: string, commentText: string) => void;
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;
}

export default function Feed({
  issues,
  onUpvoteIssue,
  onVerifyIssue,
  onAddComment,
  selectedIssueId,
  setSelectedIssueId
}: FeedProps) {
  
  const [commentText, setCommentText] = useState('');
  const activeIssue = issues.find(i => i.id === selectedIssueId) || issues[0];

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeIssue) return;
    onAddComment(activeIssue.id, commentText);
    setCommentText('');
  };

  const getStatusStepIndex = (status: IssueStatus) => {
    const steps: IssueStatus[] = [
      'Reported',
      'AI Verified',
      'Community Verified',
      'Assigned',
      'In Progress',
      'Resolved',
      'Closed'
    ];
    return steps.indexOf(status);
  };

  const timelineSteps: IssueStatus[] = [
    'Reported',
    'AI Verified',
    'Community Verified',
    'Assigned',
    'In Progress',
    'Resolved'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="community-feed-root">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white flex items-center">
          Community Feed <Sparkles className="w-5 h-5 ml-2 text-emerald-400" />
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review complaints filed in your neighborhood. Support, verify, or discuss repairs in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Side: List of issues (2/5 span) */}
        <div className="lg:col-span-2 space-y-4 max-h-[750px] overflow-y-auto pr-2 scrollbar-thin">
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1">Hyperlocal Grievance Stream</h3>
          
          {issues.map((issue) => {
            const isSelected = activeIssue?.id === issue.id;
            return (
              <div
                key={issue.id}
                onClick={() => setSelectedIssueId(issue.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-500/5' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700/80'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{issue.category}</span>
                  <span className="text-[9px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded-full border border-slate-850">{issue.status}</span>
                </div>

                <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                  {issue.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{issue.description}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 pt-2.5 border-t border-slate-800/50">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 text-rose-500 mr-1" />
                    {issue.location.ward.split(' - ')[1]}
                  </span>
                  <span className="font-semibold text-slate-400">👍 {issue.upvotes} Supports</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: High Fidelity Detail Dialogue & Timeline (3/5 span) */}
        <div className="lg:col-span-3">
          {activeIssue ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
              
              {/* Category, Reporter & Severity Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm font-bold">
                    {activeIssue.category[0]}
                  </div>
                  <div>
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">{activeIssue.category}</span>
                    <span className="text-[10px] text-slate-500 font-medium">By {activeIssue.reporterName} • {new Date(activeIssue.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {activeIssue.severity}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    AI Verified ({activeIssue.confidenceScore}%)
                  </span>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">{activeIssue.title}</h2>
                <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{activeIssue.location.address}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                  {activeIssue.description}
                </p>
              </div>

              {/* Photo Display */}
              {activeIssue.imageUrl && (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img 
                    src={activeIssue.imageUrl} 
                    alt="reported damage visual" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Interactive Timeline progress tracking */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Resolution Pipeline Timeline</h4>
                
                {/* Visual Horizontal Timeline Line */}
                <div className="relative flex items-center justify-between pt-6 pb-2 px-1">
                  <div className="absolute top-8 left-0 right-0 h-0.5 bg-slate-800"></div>
                  
                  {/* Highlighted completed progress bar */}
                  <div 
                    className="absolute top-8 left-0 h-0.5 bg-emerald-500 transition-all duration-500"
                    style={{ 
                      width: `${(getStatusStepIndex(activeIssue.status) / (timelineSteps.length - 1)) * 100}%` 
                    }}
                  ></div>

                  {timelineSteps.map((step, idx) => {
                    const isCompleted = getStatusStepIndex(activeIssue.status) >= idx;
                    const isCurrent = activeIssue.status === step;
                    
                    return (
                      <div key={idx} className="relative flex flex-col items-center z-10 text-center">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                          isCompleted 
                            ? 'bg-emerald-500 border-slate-950 ring-4 ring-emerald-500/15' 
                            : 'bg-slate-950 border-slate-800'
                        }`}>
                          {isCurrent && (
                            <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-slate-950 ring-2 ring-emerald-400"></span>
                          )}
                        </div>
                        <span className={`text-[9px] font-mono mt-2 absolute top-4 whitespace-nowrap -translate-x-1/2 left-1/2 ${
                          isCompleted ? 'text-slate-300 font-semibold' : 'text-slate-600'
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timeline Info Box details */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 text-xs text-slate-400 space-y-2 font-mono">
                <div className="flex items-center justify-between">
                  <span>Assigned Board:</span>
                  <span className="text-slate-200 font-bold">{activeIssue.assignedDepartment || 'Municipal Council Triage Division'}</span>
                </div>
                {activeIssue.expectedCompletionDate && (
                  <div className="flex items-center justify-between">
                    <span>Expected Dispatch Work Date:</span>
                    <span className="text-emerald-400 font-bold">{new Date(activeIssue.expectedCompletionDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Physical Verifications:</span>
                  <span className="text-purple-400 font-bold">{activeIssue.verifications.length} Nearby citizens confirmed</span>
                </div>
              </div>

              {/* Citizen Actions: Support / Verify */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => onUpvoteIssue(activeIssue.id)}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4 text-emerald-400" />
                  <span>Support / Upvote ({activeIssue.upvotes})</span>
                </button>

                <button
                  onClick={() => onVerifyIssue(activeIssue.id)}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-colors shadow-lg shadow-emerald-500/10"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Nearby Location (+20 XP)</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="border-t border-slate-800/80 pt-5 space-y-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Public Discussions ({activeIssue.comments.length})</h4>
                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {activeIssue.comments.length > 0 ? (
                    activeIssue.comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-extrabold text-slate-300">{comment.authorName}</span>
                            <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded ${
                              comment.authorRole === 'official' 
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' 
                                : 'bg-slate-800 text-slate-500'
                            }`}>
                              {comment.authorRole}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-600">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-600 text-center py-4">No citizen commentary yet. Add yours below.</p>
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handlePostComment} className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Contribute constructive info or landmark details..."
                    className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-0 px-3.5 py-2"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-40 transition-opacity"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>

            </div>
          ) : (
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-16 text-center">
              <MessageSquare className="w-10 h-10 text-slate-700 mx-auto mb-3 animate-pulse" />
              <h4 className="font-bold text-slate-400">Select reported problem to display detailed discussion feed.</h4>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
