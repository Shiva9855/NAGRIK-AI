export type IssueCategory =
  | 'Road Damage'
  | 'Garbage'
  | 'Water Leakage'
  | 'Drainage'
  | 'Streetlight'
  | 'Broken Footpath'
  | 'Illegal Dumping'
  | 'Traffic Signal Damage'
  | 'Electric Pole Damage'
  | 'Public Toilet Issues'
  | 'Graffiti'
  | 'Others';

export type IssueStatus =
  | 'Reported'
  | 'AI Verified'
  | 'Community Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export interface Comment {
  id: string;
  authorName: string;
  authorRole: 'citizen' | 'official' | 'volunteer';
  text: string;
  createdAt: string;
}

export interface Verification {
  userId: string;
  userName: string;
  verifiedAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  imageUrl?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    ward: string;
  };
  status: IssueStatus;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  priority: 'Low' | 'Medium' | 'High' | 'Immediate';
  estimatedCost: number; // in INR
  estimatedTime: string; // e.g., '2 Days'
  confidenceScore: number; // e.g., 96
  upvotes: number;
  upvotedBy: string[]; // user IDs who upvoted
  verifications: Verification[];
  comments: Comment[];
  assignedDepartment?: string;
  expectedCompletionDate?: string;
  reporterName: string;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  points: number;
  rank: number;
  badges: {
    name: string;
    icon: string; // Lucide icon name
    description: string;
    color: string;
  }[];
  reportsCount: number;
  verificationsCount: number;
  resolutionsCount: number;
  contributionGraph: { [date: string]: number }; // date (YYYY-MM-DD) -> contribution weight
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface PredictionAnalytics {
  riskHeatmap: {
    area: string;
    riskScore: number; // 0-100
    category: IssueCategory;
    reason: string;
  }[];
  categoryDistribution: {
    category: IssueCategory;
    count: number;
    resolved: number;
  }[];
  resolutionTimeTrend: {
    month: string;
    avgDays: number;
    targetDays: number;
  }[];
  departmentEfficiency: {
    department: string;
    efficiency: number; // percentage
    load: number; // number of open cases
  }[];
  peakHours: {
    hour: string;
    count: number;
  }[];
}
