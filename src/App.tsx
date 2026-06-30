import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ReportIssue from './components/ReportIssue';
import MapView from './components/MapView';
import Leaderboard from './components/Leaderboard';
import Feed from './components/Feed';
import AuthorityDashboard from './components/AuthorityDashboard';
import Profile from './components/Profile';
import HelpCenter from './components/HelpCenter';
import Settings from './components/Settings';
import ChatBot from './components/ChatBot';
import NotificationsDrawer from './components/NotificationsDrawer';
import AuthPage from './components/AuthPage';
import { Issue, UserProfile, Comment, IssueStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [userRole, setUserRole] = useState<'citizen' | 'official'>('citizen');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Notification lists state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: '⚡ AI Verification Success',
      text: 'Our Vision scanner classified the indiranagar pothole with 98.2% confidence. Dispatched to PWD.',
      type: 'system' as const,
      time: '1 hour ago',
      read: false
    },
    {
      id: 'n-2',
      title: '🎉 Issue Resolved!',
      text: 'BBMP electrical department replaced all 4 streetlights near residency road alley. Streak bonus +100 XP!',
      type: 'status' as const,
      time: '1 day ago',
      read: true
    }
  ]);

  // Load initial dataset from Express API
  const fetchIssuesData = async () => {
    try {
      const response = await fetch('/api/issues');
      if (response.ok) {
        const data = await response.json();
        setIssues(data);
      }
    } catch (e) {
      console.error("Failed fetching issues", e);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (e) {
      console.error("Failed fetching profile", e);
    }
  };

  useEffect(() => {
    fetchIssuesData();
    fetchUserProfile();
  }, []);

  // Update lists upon new reported issue
  const handleNewIssueReported = (newIssue: Issue) => {
    setIssues(prev => [newIssue, ...prev]);
    // Create notification alert
    const newAlert = {
      id: `alert-${Date.now()}`,
      title: '📁 New Report Registered',
      text: `Your complaint "${newIssue.title}" has been verified by computer vision and assigned to ${newIssue.assignedDepartment || 'Municipal board'}.`,
      type: 'system' as const,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newAlert, ...prev]);
    fetchUserProfile(); // update points
  };

  // Upvote/Support issue action
  const handleUpvoteIssue = async (id: string) => {
    try {
      const res = await fetch(`/api/issues/${id}/upvote`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setIssues(prev => prev.map(issue => {
          if (issue.id === id) {
            const upvotedByList = issue.upvotedBy.includes('user-1')
              ? issue.upvotedBy.filter(uid => uid !== 'user-1')
              : [...issue.upvotedBy, 'user-1'];
            return {
              ...issue,
              upvotes: data.upvotes,
              upvotedBy: upvotedByList
            };
          }
          return issue;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Community Physical verification
  const handleVerifyIssue = async (id: string) => {
    try {
      const res = await fetch(`/api/issues/${id}/verify`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        
        // Success notification trigger
        const alert = {
          id: `verify-${Date.now()}`,
          title: '🛡️ Verification Registered!',
          text: `You verified a hyperlocal report. Earning streak updated (+20 XP)`,
          type: 'verification' as const,
          time: 'Just now',
          read: false
        };
        setNotifications(prev => [alert, ...prev]);

        // Reload lists to synchronize timeline
        fetchIssuesData();
        fetchUserProfile();
      } else {
        const errData = await res.json();
        alert(errData.error || "You have already verified this report.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit constructive comment
  const handleAddComment = async (issueId: string, commentText: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText })
      });

      if (res.ok) {
        const newComment = await res.json();
        setIssues(prev => prev.map(issue => {
          if (issue.id === issueId) {
            return {
              ...issue,
              comments: [...issue.comments, newComment]
            };
          }
          return issue;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Official operation status change
  const handleUpdateStatus = async (issueId: string, newStatus: IssueStatus) => {
    try {
      // Modify client state
      setIssues(prev => prev.map(issue => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status: newStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return issue;
      }));

      // Alert
      const alert = {
        id: `status-${Date.now()}`,
        title: '💼 Status Progression alert',
        text: `Officer changed complaint status to "${newStatus}" for Indiranagar sector.`,
        type: 'status' as const,
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [alert, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleAuthSuccess = (user: UserProfile, role: 'citizen' | 'official') => {
    setUserProfile(user);
    setUserRole(role);
    if (role === 'citizen') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('authority');
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUserProfile(null);
        setActiveTab('landing');
      }
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-900" id="app-viewport">
      
      {/* Navigation header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        notificationsCount={unreadCount}
        setNotificationsOpen={setNotificationsOpen}
        points={userProfile?.points || 580}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* Main viewport render handler based on activeTab */}
      <main className="flex-1" id="main-content-window">
        {activeTab === 'landing' && (
          <LandingPage 
            onGetStarted={() => {
              if (userRole === 'citizen') {
                setActiveTab('dashboard');
              } else {
                setActiveTab('authority');
              }
            }}
            onExploreMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard 
            issues={issues}
            setActiveTab={setActiveTab}
            setSelectedIssueId={setSelectedIssueId}
            userPoints={userProfile?.points || 580}
            userRank={userProfile?.rank || 2}
          />
        )}

        {activeTab === 'report' && (
          <ReportIssue 
            onIssueReported={handleNewIssueReported}
            setActiveTab={setActiveTab}
            setSelectedIssueId={setSelectedIssueId}
          />
        )}

        {activeTab === 'map' && (
          <MapView 
            issues={issues}
            onUpvoteIssue={handleUpvoteIssue}
            onVerifyIssue={handleVerifyIssue}
            setActiveTab={setActiveTab}
            setSelectedIssueId={setSelectedIssueId}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard leaderboardData={userProfile ? [userProfile, ...issues.map((i, idx) => ({
            id: `usr-${idx}`,
            name: i.reporterName,
            email: `${i.reporterName.toLowerCase().replace(/\s/g, '')}@gmail.com`,
            points: 250 + idx * 80,
            rank: 4 + idx,
            badges: [{ name: 'Volunteer', icon: 'Heart', description: 'Assisted community', color: 'from-emerald-500 to-green-600' }],
            reportsCount: idx + 1,
            verificationsCount: idx * 2 + 1,
            resolutionsCount: Math.max(0, idx - 1),
            contributionGraph: {}
          }))].sort((a,b) => b.points - a.points).map((item, idx) => ({ ...item, rank: idx + 1 })) : []} />
        )}

        {activeTab === 'feed' && (
          <Feed 
            issues={issues}
            onUpvoteIssue={handleUpvoteIssue}
            onVerifyIssue={handleVerifyIssue}
            onAddComment={handleAddComment}
            selectedIssueId={selectedIssueId}
            setSelectedIssueId={setSelectedIssueId}
          />
        )}

        {activeTab === 'authority' && (
          <AuthorityDashboard 
            issues={issues}
            onUpdateStatus={handleUpdateStatus}
            setActiveTab={setActiveTab}
            setSelectedIssueId={setSelectedIssueId}
          />
        )}

        {activeTab === 'profile' && (
          <Profile 
            userProfile={userProfile}
            issues={issues}
            setActiveTab={setActiveTab}
            setSelectedIssueId={setSelectedIssueId}
          />
        )}

        {activeTab === 'help' && (
          <HelpCenter />
        )}

        {activeTab === 'settings' && (
          <Settings />
        )}

        {activeTab === 'auth' && (
          <AuthPage 
            onAuthSuccess={handleAuthSuccess} 
            initialRole={userRole} 
          />
        )}
      </main>

      {/* Floating Smart Multilingual AI chat bot */}
      <ChatBot />

      {/* Slide Drawer Notifications alerts panel */}
      <NotificationsDrawer 
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onClearNotifications={handleClearNotifications}
      />

    </div>
  );
}
