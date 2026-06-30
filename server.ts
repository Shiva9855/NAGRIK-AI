import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { Issue, IssueCategory, Comment, UserProfile, PredictionAnalytics } from './src/types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini AI client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('WARNING: GEMINI_API_KEY is not configured or has default placeholder. Falling back to offline simulator.');
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Hyperlocal In-Memory Data Store (Predefined rich datasets for immediate hackathon display)
let issues: Issue[] = [
  {
    id: 'issue-1',
    title: 'Hazardous Pothole Chain on Main Ring Road',
    description: 'A series of deep potholes have developed right after the flyover exit. Two-wheelers are swerving dangerously to avoid them. Needs immediate repair before an accident occurs.',
    category: 'Road Damage',
    imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: '100 Feet Rd, Indiranagar, opposite Metro Pillar 124',
      ward: 'Ward 80 - Indiranagar',
    },
    status: 'In Progress',
    severity: 'Critical',
    priority: 'Immediate',
    estimatedCost: 28000,
    estimatedTime: '3 Days',
    confidenceScore: 98,
    upvotes: 42,
    upvotedBy: ['user-2', 'user-3', 'user-4'],
    verifications: [
      { userId: 'user-2', userName: 'Rajesh Kumar', verifiedAt: '2026-06-28T10:00:00Z' },
      { userId: 'user-3', userName: 'Ananya Rao', verifiedAt: '2026-06-28T12:30:00Z' },
      { userId: 'user-4', userName: 'Vikram Singh', verifiedAt: '2026-06-28T14:15:00Z' }
    ],
    comments: [
      { id: 'c-1', authorName: 'Rajesh Kumar', authorRole: 'citizen', text: 'Passed by this yesterday. It is extremely deep, nearly took out my wheel.', createdAt: '2026-06-28T10:02:00Z' },
      { id: 'c-2', authorName: 'PWD Officer Roy', authorRole: 'official', text: 'Assigned to the local asphalt crew. Scheduled for filling tomorrow evening.', createdAt: '2026-06-29T09:15:00Z' }
    ],
    assignedDepartment: 'Public Works Department (Roads)',
    expectedCompletionDate: '2026-07-02',
    reporterName: 'Amit Patel',
    reporterId: 'user-1',
    createdAt: '2026-06-27T15:20:00Z',
    updatedAt: '2026-06-29T09:15:00Z'
  },
  {
    id: 'issue-2',
    title: 'Overflowing Commercial Garbage Pile',
    description: 'Garbage from nearby commercial shops is being dumped openly on the corner footpath. Stray animals are spreading it everywhere, causing severe foul smell and health hazard.',
    category: 'Garbage',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600',
    location: {
      lat: 12.9352,
      lng: 77.6245,
      address: '8th Main Rd, Koramangala 4th Block, near Post Office',
      ward: 'Ward 151 - Koramangala',
    },
    status: 'AI Verified',
    severity: 'High',
    priority: 'High',
    estimatedCost: 4500,
    estimatedTime: '1 Day',
    confidenceScore: 95,
    upvotes: 18,
    upvotedBy: ['user-1', 'user-4'],
    verifications: [
      { userId: 'user-1', userName: 'Amit Patel', verifiedAt: '2026-06-29T11:00:00Z' }
    ],
    comments: [
      { id: 'c-3', authorName: 'Priya Sharma', authorRole: 'volunteer', text: 'This spot needs a permanent waste bin. Commercial shops dump plastic bags daily.', createdAt: '2026-06-29T18:30:00Z' }
    ],
    assignedDepartment: 'Solid Waste Management (SWM)',
    reporterName: 'Sanjay Dutt',
    reporterId: 'user-5',
    createdAt: '2026-06-29T08:10:00Z',
    updatedAt: '2026-06-29T11:00:00Z'
  },
  {
    id: 'issue-3',
    title: 'Drinking Water Pipe Leakage on Sidewalk',
    description: 'Clean drinking water is spraying continuously from a cracked underground pipe. Hundreds of liters are being wasted. Flooding the sidewalk and adjacent pedestrian walkway.',
    category: 'Water Leakage',
    imageUrl: 'https://images.unsplash.com/photo-1542013936693-8848e5740a7a?auto=format&fit=crop&q=80&w=600',
    location: {
      lat: 12.9591,
      lng: 77.6407,
      address: '12th Cross, HAL 2nd Stage',
      ward: 'Ward 80 - Indiranagar',
    },
    status: 'Community Verified',
    severity: 'High',
    priority: 'High',
    estimatedCost: 12000,
    estimatedTime: '1 Day',
    confidenceScore: 97,
    upvotes: 25,
    upvotedBy: ['user-1', 'user-2', 'user-5'],
    verifications: [
      { userId: 'user-1', userName: 'Amit Patel', verifiedAt: '2026-06-28T09:00:00Z' },
      { userId: 'user-2', userName: 'Rajesh Kumar', verifiedAt: '2026-06-28T10:15:00Z' },
      { userId: 'user-5', userName: 'Sanjay Dutt', verifiedAt: '2026-06-28T11:45:00Z' }
    ],
    comments: [
      { id: 'c-4', authorName: 'Amit Patel', authorRole: 'citizen', text: 'Water has been leaking for over 48 hours. Please fix ASAP, we have shortages in the ward.', createdAt: '2026-06-28T09:05:00Z' }
    ],
    assignedDepartment: 'Water Supply & Sewerage Board',
    expectedCompletionDate: '2026-07-01',
    reporterName: 'Ananya Rao',
    reporterId: 'user-3',
    createdAt: '2026-06-28T07:30:00Z',
    updatedAt: '2026-06-28T11:45:00Z'
  },
  {
    id: 'issue-4',
    title: 'Damaged Electric Pole Leaning Dangerously',
    description: 'A cement utility pole has cracked at the base and is leaning over the main street. Heavy wires are hanging low. Massive hazard during winds or rains.',
    category: 'Electric Pole Damage',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600',
    location: {
      lat: 12.9124,
      lng: 77.6382,
      address: '24th Main, HSR Layout Sector 1',
      ward: 'Ward 174 - HSR Layout',
    },
    status: 'Reported',
    severity: 'Critical',
    priority: 'Immediate',
    estimatedCost: 35000,
    estimatedTime: '2 Days',
    confidenceScore: 99,
    upvotes: 8,
    upvotedBy: ['user-3'],
    verifications: [],
    comments: [],
    assignedDepartment: 'Electricity Distribution Corporation (BESCOM)',
    reporterName: 'Vikram Singh',
    reporterId: 'user-4',
    createdAt: '2026-06-30T01:15:00Z',
    updatedAt: '2026-06-30T01:15:00Z'
  },
  {
    id: 'issue-5',
    title: 'Defunct Streetlights making Alley Unsafe',
    description: 'A row of four consecutive streetlights on this residential street have been dead for two weeks. The lane is pitch dark at night, causing high risk for ladies and seniors returning late.',
    category: 'Streetlight',
    imageUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=600',
    location: {
      lat: 12.9784,
      lng: 77.6012,
      address: 'Residency Road Lane 3, near Sacred Heart School',
      ward: 'Ward 111 - Shantala Nagar',
    },
    status: 'Resolved',
    severity: 'Medium',
    priority: 'Medium',
    estimatedCost: 3000,
    estimatedTime: '2 Days',
    confidenceScore: 94,
    upvotes: 31,
    upvotedBy: ['user-1', 'user-2', 'user-4', 'user-5'],
    verifications: [
      { userId: 'user-2', userName: 'Rajesh Kumar', verifiedAt: '2026-06-25T20:00:00Z' },
      { userId: 'user-5', userName: 'Sanjay Dutt', verifiedAt: '2026-06-26T10:00:00Z' }
    ],
    comments: [
      { id: 'c-5', authorName: 'Community Volunteer Priya', authorRole: 'volunteer', text: 'Officials replaced the bulbs and upgraded them to LED lights today. Outstanding speed!', createdAt: '2026-06-27T18:30:00Z' }
    ],
    assignedDepartment: 'Municipal Electrical Dept',
    reporterName: 'Priya Sharma',
    reporterId: 'user-2',
    createdAt: '2026-06-25T11:10:00Z',
    updatedAt: '2026-06-27T18:30:00Z'
  }
];

// Leaderboard and User Profiles
let userProfiles: UserProfile[] = [
  {
    id: 'user-2',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@gmail.com',
    points: 740,
    rank: 1,
    badges: [
      { name: 'Community Hero', icon: 'Award', description: 'Verified over 15 civic issues', color: 'from-amber-500 to-yellow-600' },
      { name: 'Guardian', icon: 'Shield', description: 'Assisted in solving 5 critical issues', color: 'from-blue-500 to-indigo-600' },
      { name: 'Top Contributor', icon: 'Sparkles', description: 'In the top 1% of municipal ward helpers', color: 'from-purple-500 to-pink-600' }
    ],
    reportsCount: 14,
    verificationsCount: 22,
    resolutionsCount: 8,
    contributionGraph: {
      '2026-06-25': 3,
      '2026-06-26': 1,
      '2026-06-27': 0,
      '2026-06-28': 5,
      '2026-06-29': 2,
      '2026-06-30': 1,
    }
  },
  {
    id: 'user-1',
    name: 'Amit Patel',
    email: 'amit.patel@gmail.com',
    points: 580,
    rank: 2,
    badges: [
      { name: 'Volunteer', icon: 'Heart', description: 'Registered community volunteer', color: 'from-emerald-500 to-green-600' },
      { name: 'Problem Solver', icon: 'CheckCircle', description: 'Reported 5 successfully resolved issues', color: 'from-teal-500 to-cyan-600' }
    ],
    reportsCount: 9,
    verificationsCount: 15,
    resolutionsCount: 5,
    contributionGraph: {
      '2026-06-24': 1,
      '2026-06-25': 0,
      '2026-06-26': 4,
      '2026-06-27': 2,
      '2026-06-28': 1,
      '2026-06-29': 3,
      '2026-06-30': 2,
    }
  },
  {
    id: 'user-3',
    name: 'Ananya Rao',
    email: 'ananya.r@outlook.com',
    points: 410,
    rank: 3,
    badges: [
      { name: 'Guardian', icon: 'Shield', description: 'Verified 8 civic issues', color: 'from-blue-500 to-indigo-600' },
      { name: 'Gold Citizen', icon: 'Crown', description: 'Achieved 400+ helper points', color: 'from-amber-400 to-orange-500' }
    ],
    reportsCount: 6,
    verificationsCount: 11,
    resolutionsCount: 3,
    contributionGraph: {
      '2026-06-26': 2,
      '2026-06-27': 0,
      '2026-06-28': 4,
      '2026-06-29': 1,
      '2026-06-30': 0,
    }
  },
  {
    id: 'user-4',
    name: 'Vikram Singh',
    email: 'vikram.s@yahoo.com',
    points: 320,
    rank: 4,
    badges: [
      { name: 'Problem Solver', icon: 'CheckCircle', description: 'Reported 3 resolved issues', color: 'from-teal-500 to-cyan-600' }
    ],
    reportsCount: 5,
    verificationsCount: 8,
    resolutionsCount: 2,
    contributionGraph: {
      '2026-06-27': 1,
      '2026-06-28': 2,
      '2026-06-29': 0,
      '2026-06-30': 3,
    }
  },
  {
    id: 'user-5',
    name: 'Sanjay Dutt',
    email: 'sanjay.dutt@gmail.com',
    points: 290,
    rank: 5,
    badges: [
      { name: 'Volunteer', icon: 'Heart', description: 'Active community helper', color: 'from-emerald-500 to-green-600' }
    ],
    reportsCount: 4,
    verificationsCount: 7,
    resolutionsCount: 1,
    contributionGraph: {
      '2026-06-28': 1,
      '2026-06-29': 2,
      '2026-06-30': 1,
    }
  }
];

// Active user (defaults to Amit Patel for demo purpose, can be dynamically switched)
let currentUserId: string | null = 'user-1';
const getActiveUserId = () => currentUserId || 'user-1';

// API: Get List of Issues
app.get('/api/issues', (req, res) => {
  const { sort, category, status, ward, search } = req.query;
  let filtered = [...issues];

  if (category) {
    filtered = filtered.filter(i => i.category.toLowerCase() === (category as string).toLowerCase());
  }
  if (status) {
    filtered = filtered.filter(i => i.status.toLowerCase() === (status as string).toLowerCase());
  }
  if (ward) {
    filtered = filtered.filter(i => i.location.ward.toLowerCase().includes((ward as string).toLowerCase()));
  }
  if (search) {
    const s = (search as string).toLowerCase();
    filtered = filtered.filter(
      i =>
        i.title.toLowerCase().includes(s) ||
        i.description.toLowerCase().includes(s) ||
        i.location.address.toLowerCase().includes(s) ||
        i.category.toLowerCase().includes(s)
    );
  }

  // Sorting
  if (sort === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'severity') {
    const severityWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    filtered.sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity]);
  } else if (sort === 'supported') {
    filtered.sort((a, b) => b.upvotes - a.upvotes);
  } else {
    // Default: Sort by newest
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(filtered);
});

// API: Get single issue
app.get('/api/issues/:id', (req, res) => {
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  res.json(issue);
});

// API: Create new issue (With Duplicate Check integration)
app.post('/api/issues', (req, res) => {
  const { title, description, category, imageUrl, location, severity, priority, estimatedCost, estimatedTime, confidenceScore } = req.body;

  if (!title || !description || !category || !location) {
    return res.status(400).json({ error: 'Missing required issue properties' });
  }

  // Smart Duplicate Check
  // Compare physical distance to see if an issue in the same category is within 100 meters (0.001 coordinate degrees)
  const duplicate = issues.find(existing => {
    if (existing.category !== category || existing.status === 'Resolved' || existing.status === 'Closed') return false;
    const latDiff = Math.abs(existing.location.lat - location.lat);
    const lngDiff = Math.abs(existing.location.lng - location.lng);
    return latDiff < 0.0012 && lngDiff < 0.0012; // roughly 120-150 meters
  });

  if (duplicate) {
    return res.json({
      isDuplicate: true,
      duplicateIssue: duplicate,
      message: `This issue appears to be reported already at ${duplicate.location.address}. You can support the existing report to speed up action.`
    });
  }

  const reporter = userProfiles.find(u => u.id === getActiveUserId()) || userProfiles[1];

  const newIssue: Issue = {
    id: `issue-${Date.now()}`,
    title,
    description,
    category: category as IssueCategory,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1594913785162-e678531d7ec2?auto=format&fit=crop&q=80&w=600',
    location: {
      lat: Number(location.lat) || 12.9716,
      lng: Number(location.lng) || 77.5946,
      address: location.address || 'Bengaluru, India',
      ward: location.ward || 'Ward 80 - Indiranagar',
    },
    status: 'AI Verified', // Automatically verified by our smart camera AI model!
    severity: severity || 'Medium',
    priority: priority || 'Medium',
    estimatedCost: Number(estimatedCost) || 8000,
    estimatedTime: estimatedTime || '2 Days',
    confidenceScore: Number(confidenceScore) || 92,
    upvotes: 1,
    upvotedBy: [getActiveUserId()],
    verifications: [],
    comments: [],
    reporterName: reporter.name,
    reporterId: reporter.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Assign typical departments based on category
  const departmentMapping: Record<IssueCategory, string> = {
    'Road Damage': 'Public Works Department (PWD)',
    'Garbage': 'Solid Waste Management (SWM)',
    'Water Leakage': 'Water Supply & Sewerage Board',
    'Drainage': 'Stormwater Drain & Sewer Division',
    'Streetlight': 'Municipal Electrical Department',
    'Broken Footpath': 'Pedestrian Infrastructure Division',
    'Illegal Dumping': 'SWM & Pollution Control',
    'Traffic Signal Damage': 'Traffic Police & Infrastructure Dept',
    'Electric Pole Damage': 'Electricity Distribution Board',
    'Public Toilet Issues': 'Sanitation & Public Health Dept',
    'Graffiti': 'Ward Beautification Department',
    'Others': 'Ward General Grievance Cell'
  };

  newIssue.assignedDepartment = departmentMapping[newIssue.category];

  issues.unshift(newIssue);

  // Update user contribution profile
  reporter.points += 50; // 50 points for reporting
  reporter.reportsCount += 1;
  const todayStr = new Date().toISOString().split('T')[0];
  reporter.contributionGraph[todayStr] = (reporter.contributionGraph[todayStr] || 0) + 1;

  // Recalculate ranks
  userProfiles.sort((a, b) => b.points - a.points);
  userProfiles.forEach((user, index) => {
    user.rank = index + 1;
  });

  res.status(201).json({ isDuplicate: false, issue: newIssue });
});

// API: Support/Upvote Issue
app.post('/api/issues/:id/upvote', (req, res) => {
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  const activeUserId = getActiveUserId();
  if (issue.upvotedBy.includes(activeUserId)) {
    // Unlike/Remove upvote
    issue.upvotedBy = issue.upvotedBy.filter(id => id !== activeUserId);
    issue.upvotes = Math.max(0, issue.upvotes - 1);
    return res.json({ upvoted: false, upvotes: issue.upvotes });
  } else {
    // Upvote
    issue.upvotedBy.push(activeUserId);
    issue.upvotes += 1;
    return res.json({ upvoted: true, upvotes: issue.upvotes });
  }
});

// API: Community Verification
app.post('/api/issues/:id/verify', (req, res) => {
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  const activeUserId = getActiveUserId();
  // Check if already verified by this user
  const alreadyVerified = issue.verifications.some(v => v.userId === activeUserId);
  if (alreadyVerified) {
    return res.status(400).json({ error: 'You have already verified this reported issue' });
  }

  const verifier = userProfiles.find(u => u.id === activeUserId) || userProfiles[1];

  // Add verification record
  issue.verifications.push({
    userId: activeUserId,
    userName: verifier.name,
    verifiedAt: new Date().toISOString()
  });

  // Verification increments citizen score
  verifier.points += 20; // 20 points for verification
  verifier.verificationsCount += 1;
  const todayStr = new Date().toISOString().split('T')[0];
  verifier.contributionGraph[todayStr] = (verifier.contributionGraph[todayStr] || 0) + 1;

  // Real-Time Status Lifecycle Progression
  // If verifications >= 3, automatically progress from "AI Verified" to "Community Verified" to "Assigned"
  if (issue.status === 'Reported' || issue.status === 'AI Verified') {
    if (issue.verifications.length >= 3) {
      issue.status = 'Community Verified';
      issue.updatedAt = new Date().toISOString();

      // Advanced simulation: Automatically assign it after 2 seconds to make the timeline look live and active!
      setTimeout(() => {
        const targetIssue = issues.find(i => i.id === issue.id);
        if (targetIssue && targetIssue.status === 'Community Verified') {
          targetIssue.status = 'Assigned';
          targetIssue.expectedCompletionDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          targetIssue.updatedAt = new Date().toISOString();
        }
      }, 3000);
    }
  }

  // Recalculate ranks
  userProfiles.sort((a, b) => b.points - a.points);
  userProfiles.forEach((user, index) => {
    user.rank = index + 1;
  });

  res.json({ success: true, verificationsCount: issue.verifications.length, status: issue.status });
});

// API: Add Comment
app.post('/api/issues/:id/comment', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Comment text cannot be empty' });

  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  const activeUserId = getActiveUserId();
  const commentator = userProfiles.find(u => u.id === activeUserId) || userProfiles[1];

  const newComment: Comment = {
    id: `c-${Date.now()}`,
    authorName: commentator.name,
    authorRole: 'citizen',
    text,
    createdAt: new Date().toISOString()
  };

  issue.comments.push(newComment);
  res.status(201).json(newComment);
});

// API: Get Leaderboard
app.get('/api/leaderboard', (req, res) => {
  res.json(userProfiles);
});

// API: Get Current User profile
app.get('/api/profile', (req, res) => {
  if (!currentUserId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const profile = userProfiles.find(u => u.id === currentUserId);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.json(profile);
});

// API: Authentication - Login
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Find user by email
  const user = userProfiles.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password. Please sign up first!' });
  }

  currentUserId = user.id;
  res.json({ success: true, user, role });
});

// API: Authentication - Signup
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role, extraInfo } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required signup fields' });
  }

  const existing = userProfiles.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newId = `user-${Date.now()}`;
  
  // Set up badges based on role
  const badges = role === 'official' 
    ? [{ name: 'Gov Official', icon: 'Shield', description: `Verified staff of ${extraInfo || 'Municipal Board'}`, color: 'from-amber-600 to-rose-600' }]
    : [{ name: 'Novice Citizen', icon: 'Heart', description: 'Just joined NagrikAI', color: 'from-emerald-500 to-green-600' }];

  const newProfile: UserProfile = {
    id: newId,
    name,
    email,
    points: role === 'official' ? 1000 : 100,
    rank: userProfiles.length + 1,
    badges,
    reportsCount: 0,
    verificationsCount: 0,
    resolutionsCount: 0,
    contributionGraph: {}
  };

  userProfiles.push(newProfile);
  currentUserId = newId;

  res.status(201).json({ success: true, user: newProfile, role });
});

// API: Authentication - Google Sign In
app.post('/api/auth/google', (req, res) => {
  const { name, email, role } = req.body;
  if (!email || !name || !role) {
    return res.status(400).json({ error: 'Missing Google Auth details' });
  }

  let user = userProfiles.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    const newId = `user-${Date.now()}`;
    const badges = role === 'official'
      ? [{ name: 'Gov Official', icon: 'Shield', description: 'Google Verified Government Staff', color: 'from-amber-600 to-rose-600' }]
      : [{ name: 'Google Pioneer', icon: 'Sparkles', description: 'Signed up via Google Security', color: 'from-blue-500 to-indigo-600' }];

    user = {
      id: newId,
      name,
      email,
      points: role === 'official' ? 1000 : 150,
      rank: userProfiles.length + 1,
      badges,
      reportsCount: 0,
      verificationsCount: 0,
      resolutionsCount: 0,
      contributionGraph: {}
    };

    userProfiles.push(user);
  }

  currentUserId = user.id;
  res.json({ success: true, user, role });
});

// API: Authentication - Logout
app.post('/api/auth/logout', (req, res) => {
  currentUserId = null;
  res.json({ success: true });
});

// API: AI Image Analysis using Gemini API
app.post('/api/analyze-image', async (req, res) => {
  const { imageBase64, categoryHint, descriptionHint } = req.body;

  const aiClient = getGeminiClient();

  if (!aiClient) {
    // Fallback Offline Smart Simulator
    console.log('Using simulated smart classification.');
    const guessedCategory: IssueCategory = (categoryHint as IssueCategory) || 'Road Damage';
    const desc = descriptionHint || `Detailed report regarding a ${guessedCategory.toLowerCase()} issue found on the street. Needs immediate attention of authorities to clear and restore access.`;

    const mockAnalysis = {
      detectedIssue: guessedCategory === 'Others' ? 'Street Blockage / Obstruction' : guessedCategory,
      category: guessedCategory,
      title: `Reported ${guessedCategory} Issue`,
      description: desc,
      severity: guessedCategory === 'Road Damage' || guessedCategory === 'Water Leakage' ? 'High' : 'Medium',
      priority: guessedCategory === 'Road Damage' || guessedCategory === 'Electric Pole Damage' ? 'Immediate' : 'High',
      estimatedCost: guessedCategory === 'Road Damage' ? 18000 : guessedCategory === 'Streetlight' ? 3000 : 7500,
      estimatedTime: guessedCategory === 'Road Damage' ? '3 Days' : '1 Day',
      confidenceScore: 96,
      suggestedDepartment: guessedCategory === 'Road Damage' ? 'Public Works Department (PWD)' : 'Municipal Corporation'
    };
    return res.json(mockAnalysis);
  }

  try {
    let responseText = '';

    const systemPrompt = `You are the Computer Vision & Civil Engineering AI engine of NagrikAI.
    Your task is to analyze civic problems from images and descriptions and return structured JSON.
    Your output MUST be a valid JSON object matching the following TypeScript schema:
    {
      "detectedIssue": string, // Concrete issue name e.g. "Severe pothole chain"
      "category": string, // MUST be one of these exact categories: ["Road Damage", "Garbage", "Water Leakage", "Drainage", "Streetlight", "Broken Footpath", "Illegal Dumping", "Traffic Signal Damage", "Electric Pole Damage", "Public Toilet Issues", "Graffiti", "Others"]
      "title": string, // Actionable, elegant complaint title (no quotes)
      "description": string, // Rich, professionally drafted civic description (3-4 sentences detailing the issue, pedestrian/vehicle hazards, and urgency)
      "severity": "Low" | "Medium" | "High" | "Critical", // Objective safety risk assessment
      "priority": "Low" | "Medium" | "High" | "Immediate", // Action priority
      "estimatedCost": number, // Estimated repair/cleanup cost in Indian Rupees (INR), return integer e.g., 14000
      "estimatedTime": string, // Estimated standard repair timeline, e.g., "2 Days" or "1 Day" or "5 Hours"
      "confidenceScore": number, // Your confidence percentage, e.g., 94
      "suggestedDepartment": string // Municipal department to assign to
    }
    Ensure response is clean JSON only. Do not wrap in markdown \`\`\`json blocks. Return raw JSON.`;

    if (imageBase64) {
      // Analyze with image part
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      };

      const promptPart = {
        text: `Analyze this image. Category hint provided: ${categoryHint || 'None'}. User input description: ${descriptionHint || 'None'}. Extract key civic defect details.`
      };

      const result = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: { parts: [imagePart, promptPart] },
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      });
      responseText = result.text || '';
    } else {
      // Analyze with description hint only
      const result = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Analyze this described civic issue. Category: ${categoryHint || 'Unspecified'}. Description: ${descriptionHint || 'None'}.`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      });
      responseText = result.text || '';
    }

    const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini Image analysis error:', error);
    res.status(500).json({ error: 'AI Analysis failed', details: error.message });
  }
});

// API: Multilingual Smart Chatbot using Gemini API
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages list' });
  }

  const aiClient = getGeminiClient();

  // Incorporate local issues context to ground the bot!
  const issuesSummary = issues.map(i => `- [${i.category}] "${i.title}" at ${i.location.address}, Ward: ${i.location.ward}, Status: ${i.status}, Severity: ${i.severity}`).join('\n');

  const systemInstruction = `You are "NagrikAI Assistant", the helpful, intelligent, multi-lingual chatbot on NagrikAI (hyperlocal civic tech platform).
  Your objective is to:
  1. Assist citizens in reporting issues like potholes, open garbage, water leakage, streetlights, or electrical damage.
  2. Answer queries on how the platform works (such as points, verifications, leaderboards).
  3. Ground your knowledge in real-time nearby issues if asked. Here is the list of active reports in our database:
  ${issuesSummary}
  
  4. Communicate in the citizen's preferred language (English, Hindi, Marathi, Kannada, Tamil, etc.). If they greet or ask in a language, reply in the same.
  5. Keep answers highly helpful, visually structured (with clean bullet points if needed), warm, and brief (under 150 words). Encourage citizens to report and verify problems in their community to earn reward points!`;

  if (!aiClient) {
    // Mock Chat Assistant
    const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
    let reply = "Hello! I am your NagrikAI Civic Assistant. I can help you report issues or check on community reports. (Note: AI is currently offline, but I can guide you).";

    if (lastUserMsg.includes('garbage') || lastUserMsg.includes('trash')) {
      reply = "To report open garbage, just click **Report Issue** from the top menu, select 'Garbage', upload an image, and our AI will automatically estimate cleanup costs! You will earn **50 XP** once reported.";
    } else if (lastUserMsg.includes('status') || lastUserMsg.includes('track') || lastUserMsg.includes('pothole')) {
      reply = "Currently, we have an active report of a **Hazardous Pothole Chain** on Indiranagar Main Ring Road, which is marked **In Progress** by the PWD. You can see it on our Interactive Map!";
    } else if (lastUserMsg.includes('points') || lastUserMsg.includes('leaderboard') || lastUserMsg.includes('rank')) {
      reply = "You earn **50 points** for reporting an issue and **20 points** for verifying a nearby report. Earn enough points to unlock badges like 'Community Hero' or 'Guardian' and top our citizen leaderboard!";
    }

    return res.json({ text: reply });
  }

  try {
    // Prepare chat context
    const chat = aiClient.chats.create({
      model: 'gemini-3.5-flash',
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    let lastResponse;
    // Walk through messages history to catch conversation state
    for (const msg of messages) {
      if (msg.sender === 'user') {
        lastResponse = await chat.sendMessage({ message: msg.text });
      }
    }

    res.json({ text: lastResponse?.text || 'I am here to assist you with your civic concerns.' });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat processing failed', details: error.message });
  }
});

// API: AI Prediction Dashboard Calculations (Generates predictive analytics combining issues statistics and Gemini summary)
app.get('/api/predictions', async (req, res) => {
  // Pre-calculated analytics based on current in-memory issues
  const riskHeatmap = [
    { area: 'Indiranagar Metro Corridor', riskScore: 88, category: 'Road Damage' as IssueCategory, reason: 'Frequent heavy construction, post-monsoon asphalt erosion, and dense traffic signal delay.' },
    { area: 'Koramangala 4th Block Market Corner', riskScore: 82, category: 'Garbage' as IssueCategory, reason: 'Commercial shop waste accumulation peak and absence of high-capacity civic skip bins.' },
    { area: 'HAL 2nd Stage Junction', riskScore: 75, category: 'Water Leakage' as IssueCategory, reason: 'Ageing 30-year underground concrete piping under high water pump load.' },
    { area: 'HSR Layout Sector 1 Sector Outer', riskScore: 68, category: 'Electric Pole Damage' as IssueCategory, reason: 'Overhead high-tension cable load and historical storm wind exposure.' },
    { area: 'Whitefield Main Boulevard', riskScore: 60, category: 'Broken Footpath' as IssueCategory, reason: 'Encroachments by street vendors and missing concrete paving blocks.' }
  ];

  const categoryDistribution = [
    { category: 'Road Damage' as IssueCategory, count: 5, resolved: 2 },
    { category: 'Garbage' as IssueCategory, count: 4, resolved: 1 },
    { category: 'Water Leakage' as IssueCategory, count: 3, resolved: 1 },
    { category: 'Streetlight' as IssueCategory, count: 6, resolved: 5 },
    { category: 'Electric Pole Damage' as IssueCategory, count: 2, resolved: 1 },
    { category: 'Drainage' as IssueCategory, count: 2, resolved: 1 },
    { category: 'Broken Footpath' as IssueCategory, count: 1, resolved: 0 },
    { category: 'Illegal Dumping' as IssueCategory, count: 1, resolved: 0 }
  ];

  const resolutionTimeTrend = [
    { month: 'Jan', avgDays: 5.2, targetDays: 3.5 },
    { month: 'Feb', avgDays: 4.8, targetDays: 3.5 },
    { month: 'Mar', avgDays: 4.1, targetDays: 3.5 },
    { month: 'Apr', avgDays: 3.8, targetDays: 3.5 },
    { month: 'May', avgDays: 3.9, targetDays: 3.5 },
    { month: 'Jun', avgDays: 2.7, targetDays: 3.5 }
  ];

  const departmentEfficiency = [
    { department: 'Solid Waste Management (SWM)', efficiency: 94, load: 3 },
    { department: 'Municipal Electrical Department', efficiency: 89, load: 2 },
    { department: 'Water Supply Board', efficiency: 81, load: 4 },
    { department: 'Public Works Dept (Roads)', efficiency: 74, load: 8 },
    { department: 'Electricity Distribution Board', efficiency: 85, load: 1 }
  ];

  const peakHours = [
    { hour: '08:00 AM', count: 15 },
    { hour: '10:00 AM', count: 42 },
    { hour: '12:00 PM', count: 28 },
    { hour: '02:00 PM', count: 19 },
    { hour: '04:00 PM', count: 35 },
    { hour: '06:00 PM', count: 55 },
    { hour: '08:00 PM', count: 22 }
  ];

  const aiClient = getGeminiClient();
  let aiNarrative = 'NagrikAI forecast reports that pothole risk along Indiranagar flyover routes is elevated. Priority resource allocation is recommended for asphalt and solid waste management crews in Ward 80 and Ward 151.';

  if (aiClient) {
    try {
      const prompt = `Based on the following active civic issues, generate a high-level executive prediction summary (2-3 sentences max) outlining which areas have high infrastructure risk, what departments need warning, and the critical civic trend for the upcoming month:
      ${issues.map(i => `Category: ${i.category}, Ward: ${i.location.ward}, Severity: ${i.severity}, Cost: ₹${i.estimatedCost}`).join('\n')}`;

      const result = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are the Predictive Analytics forecaster of NagrikAI. Keep answers analytical, brief, and extremely polished. Do not include headers, just return 2-3 precise bullet points of forecast.'
        }
      });
      aiNarrative = result.text || aiNarrative;
    } catch (e) {
      console.error('Gemini Predictions narrative error:', e);
    }
  }

  res.json({
    riskHeatmap,
    categoryDistribution,
    resolutionTimeTrend,
    departmentEfficiency,
    peakHours,
    aiNarrative
  });
});

// Configure Vite middleware for development or Static serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NagrikAI full stack server booted successfully. Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
