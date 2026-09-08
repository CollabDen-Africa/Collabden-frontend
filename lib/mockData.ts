//Temporary data until integration

import { 
  FiGlobe, FiLinkedin, FiInstagram, FiTwitter, FiYoutube, 
  FiUsers, FiCheckCircle, FiAward, FiUser, 
  FiLink, 
  FiCreditCard, 
  FiBell, 
  FiShield, 
  FiLock, 
  FiActivity, 
  FiHelpCircle 
} from "react-icons/fi";
import { FaDribbble } from "react-icons/fa";


// --- USER PROFILE ---
export const MOCK_USER = {
  firstName: "Emmanuel",
  lastName: "O.",
  role: "Producer",
  avatarUrl: null, 
};

// --- TOP STATS ---
export const MOCK_TOP_STATS = [
  { 
    title: "Active Projects", 
    count: "06", 
    subtitle: "2 updated recently", 
    orbClass: "bg-gradient-to-r from-primary-blue/20 to-transparent" 
  },
  { 
    title: "Tasks in Progress", 
    count: "18", 
    subtitle: "5 due today", 
    orbClass: "bg-gradient-to-l from-primary-green/20 to-[#365920]/20" 
  },
  { 
    title: "Collaborators", 
    count: "12", 
    subtitle: "+3 this week", 
    orbClass: "bg-gradient-to-l from-[#7C3AED]/20 to-[#472187]/20" 
  }
];

// --- ACTIVE PROJECTS ---
export const MOCK_ACTIVE_PROJECTS = [
  { 
    id: 1, 
    title: "Urban Beats Vol.2", 
    genre: "Hip-Hop", 
    tracks: "6 tracks in progress", 
    collaborators: [
      { name: "Tayo Oni", avatarUrl: "/mock-profiles/small5.png" }, 
      { name: "Lizz Torres", avatarUrl: "/mock-profiles/small4.png" }, 
      { name: "Emma Wilson", avatarUrl: "/avatar.svg" }, 
      { name: "John Ike", avatarUrl: "/mock-profiles/small2.png" }
    ], 
    progress: 90, 
    updated: "2 hours ago",
    status: "Active"
  },
  { 
    id: 2, 
    title: "Acoustic Sessions", 
    genre: "Hip-Hop", 
    tracks: "4 tracks in progress", 
    collaborators: [
      { name: "Chris Morgan", avatarUrl: "/mock-profiles/small4.png" }, 
      { name: "Sam Martin", avatarUrl: "/mock-profiles/small2.png" }
    ], 
    progress: 40, 
    updated: "5 hours ago",
    status: "Review"
  },
];

// --- RECENT COLLABORATOR ACTIVITY ---
export const MOCK_RECENT_ACTIVITY = [
  { id: 1, user: "Michael Awe", action: "Uploaded new track", time: "2h", avatarUrl: "/mock-profiles/Matt.png" },
  { id: 2, user: "Tayo Oni", action: "Completed mastering", time: "4h", avatarUrl: "/mock-profiles/Tayo.png" },
  { id: 3, user: "Sam Martin", action: "Added vocals", time: "6h", avatarUrl: "/mock-profiles/Sam.png" },
  { id: 4, user: "Chris Morgan", action: "Shared feedback", time: "6h", avatarUrl: "/mock-profiles/Chris.png" },
];

// --- SUGGESTED PROJECTS ---
export const MOCK_SUGGESTED_PROJECTS = [
  { 
    id: 1, 
    title: "Jazz Fusion Album", 
    needs: "Looking for bass player", 
    members: 3, 
    tags: ["Jazz", "Fusion"] 
  },
  { 
    id: 2, 
    title: "Lo-Fi Beats Collection", 
    needs: "Need mixing engineer", 
    members: 5, 
    tags: ["Lo-fi", "Chill"] 
  },
];

// --- SUGGESTED COLLABORATORS ---
export const MOCK_SUGGESTED_COLLABORATORS = [
  { id: 1, name: "David Chen", role: "Mixing Engineer", members: 15, rating: "5.0", avatarUrl: "/mock-profiles/David.png" },
  { id: 2, name: "Emma Wilson", role: "Vocalist", members: 10, rating: "4.8", avatarUrl: "/mock-profiles/Tayo.png" },
  { id: 3, name: "Lizz Torres", role: "Producer", members: 8, rating: "4.8", avatarUrl: "/mock-profiles/Tayo.png" },
];

// --- NOTIFICATIONS ---
export const MOCK_NOTIFICATIONS = [
  { id: 1, user: "John Ike", action: "commented on", target: "“Summer Vibes Ep”", time: "15 minutes ago", type: "message" },
  { id: 2, user: "Tobi Alao", action: "approved your mix", target: "", time: "1 hour ago", type: "check" },
  { id: 3, user: "Isa Ali", action: "joined your project", target: "", time: "3 hours ago", type: "userPlus" },
  { id: 4, action: "Agreement has been signed for", target: "“Urban Beats”", time: "5 hours ago", type: "handshake" },
];

// --- NEW PROJECTS MOCK DATA ---
export const PROJECT_GENRES = [
  "Afrobeats", 
  "Hip-Hop", 
  "R&B", 
  "Pop", 
  "Jazz", 
  "Electronic"
];

export const MOCK_COLLABORATORS = [
  { name: "Olivia Rhye", role: "Producer", image: "/mock-profiles/small.png" },
  { name: "Orlando Diggs", role: "Sound Engineer", image: "/mock-profiles/small.png" },
  { name: "Andi Lane", role: "Vocalist", image: "/mock-profiles/small.png" },
];

// --- PROJECTS ---
export const PROJECTS_DATA = [
  {
    id: 1,
    title: "Urban Beats Vol.2",
    subtitle: "Hip-Hop",
    tracksProgress: "6 tracks in progress",
    status: "Active", // "Active" | "Review" | "Completed"
    statusColor: "text-[#11EA9B]",
    statusBg: "bg-[#11EA9B]/10",
    progressPercent: 90,
    progressColor: "bg-primary-green", 
    lastUpdated: "2 hours ago",
    collaborators: [
      "/mock-profiles/small.png",
      "/mock-profiles/small.png",
      "/mock-profiles/small.png",
    ],
    totalCollab: 4,
    iconPath: "/icons/audio-lines.svg"
  },
  {
    id: 2,
    title: "Acoustic Sessions",
    subtitle: "Hip-Hop",
    tracksProgress: "4 tracks in progress",
    status: "Review",
    statusColor: "text-[#E2C806]",
    statusBg: "bg-[#E2C806]/10",
    progressPercent: 40,
    progressColor: "bg-[#204F99]",
    lastUpdated: "5 hours ago",
    collaborators: [
      "/mock-profiles/small.png",
      "/mock-profiles/small.png",
    ],
    totalCollab: 2,
    iconPath: "/icons/audio-lines.svg"
  },
];

// Mock data for messages
export const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "Maya Johnson",
    time: "2:30 PM",
    text: "Just uploaded the new beat, check it out!",
    isMe: false,
    avatar: "/mock-profiles/small.png"
  },
  {
    id: 2,
    sender: "You",
    time: "2:35 PM",
    text: "Fire! I'll lay some vocals over it tonight 🔥",
    isMe: true,
    avatar: "/avatar.svg"
  },
  {
    id: 3,
    sender: "Alex Rivera",
    time: "2:48 PM",
    text: "Love the direction. I can add some bass lines tomorrow.",
    isMe: false,
    avatar: "/mock-profiles/small3.png"
  },
  {
    id: 4,
    sender: "You",
    time: "2:52 PM",
    text: "Perfect, let's aim to have the rough mix by Friday",
    isMe: true,
    avatar: "/avatar.svg"
  }
];

// --- WORKSPACE ACTIVITY PANEL ---
export type ActivitySegmentType = 'name' | 'progress' | 'task' | 'update' | 'comment' | 'regular';

export interface ActivitySegment {
  text: string;
  type: ActivitySegmentType;
}

export interface WorkspaceActivity {
  id: number;
  time: string;
  segments: ActivitySegment[];
}

export const MOCK_WORKSPACE_ACTIVITIES: WorkspaceActivity[] = [
  { 
    id: 1, 
    time: "Apr 20 at 9:50pm",
    segments: [
      { text: "Oyinda O.", type: "name" },
      { text: " created task ", type: "regular" },
      { text: "“Finalize Artist Lineup”", type: "task" },
    ]
  },
  { 
    id: 2, 
    time: "Apr 21 at 5:12Am",
    segments: [
      { text: "Tobi A.", type: "name" },
      { text: " commented on ", type: "regular" },
      { text: "“Finalize Artist Lineup”", type: "task" },
      { text: " ", type: "regular" },
      { text: "“Let’s confirm the headline act before friday”", type: "comment" },
    ]
  },
  { 
    id: 3, 
    time: "Apr 21 at 7:01am",
    segments: [
      { text: "Amaka J.", type: "name" },
      { text: " moved ", type: "regular" },
      { text: "“Finalize Artist Lineup”", type: "task" },
      { text: " from ", type: "regular" },
      { text: "In Review -> Done", type: "progress" },
    ]
  },
  { 
    id: 4, 
    time: "Apr 21 at 11:19am",
    segments: [
      { text: "David K.", type: "name" },
      { text: " uploaded file ", type: "regular" },
      { text: "“UrbanBeats_Flyer_v2.png”", type: "task" }, 
    ]
  },
  { 
    id: 5, 
    time: "Apr 24 at 3:44pm",
    segments: [
      { text: "Oyinda O.", type: "name" },
      { text: " updated deadline for ", type: "regular" },
      { text: "“Finalize Artist Lineup”", type: "task" },
      { text: " to May 15", type: "update" },
    ]
  },
  { 
    id: 6, 
    time: "Apr 24 at 6:32pm",
    segments: [
      { text: "System", type: "name" },
      { text: " synced kanban board updates ", type: "regular" },
      { text: "“3 tasks moved to In Progress”", type: "update" },
    ]
  }
];

// --- Mock Data for Updates ---
export const MOCK_UPDATES = [
  {
    id: 1,
    text: "Kabiru Musa added you to the project Urban Beats Vol. 2",
    time: "2 mins ago",
    type: "view",
    isUnread: true,
    user: "Kabiru Musa",
    avatarUrl: ""
  },
  {
    id: 2,
    text: "Chinedu Okafor sent a message request",
    time: "15 mins ago",
    type: "request",
    isUnread: true,
    user: "Chinedu Okafor",
    avatarUrl: ""
  },
  {
    id: 3,
    text: "System Deadline approaching",
    time: "3 hours ago",
    type: "system-warning",
    isUnread: false,
    systemColor: "text-[#F9A620]", 
    systemBg: "bg-accent-yellow/20"
  },
  {
    id: 4,
    text: "Obinna Okeke assigned you a new task",
    time: "5 hours ago",
    type: "view",
    isUnread: false,
    user: "Obinna Okeke",
    avatarUrl: ""
  },
  {
    id: 5,
    text: "Aisha Bello sent you a new message",
    time: "Yesterday",
    type: "message",
    isUnread: false,
    user: "Aisha Bello",
    avatarUrl: ""
  },
  {
    id: 6,
    text: "System You missed a deadline",
    time: "Yesterday",
    type: "system-alert",
    isUnread: false,
    systemColor: "text-accent-red-alt", 
    systemBg: "bg-accent-red-alt/20"
  }
];

//Mock tasks data
export type Priority = "High" | "Medium" | "Low";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  date: string;
  tag: string;
  assignees: string[];
}

export interface Column {
  id: string;
  title: string;
  subtitle: string;
  indicatorColor: string;
  tasks: Task[];
}

export const MOCK_BOARD: Column[] = [
  {
    id: "todo",
    title: "To Do",
    subtitle: "Backlog & Ideas",
    indicatorColor: "bg-primary-blue",
    tasks: [] // Empty to show the empty state
  },
  {
    id: "in-progress",
    title: "In Progress",
    subtitle: "Currently shipping",
    indicatorColor: "bg-accent-yellow",
    tasks: [] 
  },
  {
    id: "in-review",
    title: "In Review",
    subtitle: "Awaiting feedback",
    indicatorColor: "bg-[#6F2DFF]",
    tasks: [
      {
        id: "t5",
        title: "Press release draft",
        description: "Short-form for blogs, long-form for trade. Include quote from producer",
        priority: "High",
        date: "May 14",
        tag: "Public Relations",
        assignees: ["", ""]
      },
      {
        id: "t6",
        title: "Music Video - color grade",
        description: "Apply final LUT, fix skin tones in scene 4, export ProRes",
        priority: "Medium",
        date: "May 9",
        tag: "Video",
        assignees: [""]
      }
    ]
  },
  {
    id: "done",
    title: "Done",
    subtitle: "Released",
    indicatorColor: "bg-primary-green",
    tasks: [
      {
        id: "t7",
        title: "Distribution Upload - DistroKid",
        description: "Schedule release for May 24, 00:00 GMT. Add ISRC codes.",
        priority: "High",
        date: "May 11",
        tag: "Release",
        assignees: ["", ""]
      },
      {
        id: "t8",
        title: "Master single- ‘Midnight Frequency’",
        description: "Final mastering pass with reference to last release. Send WAV + MP3 stems",
        priority: "Medium",
        date: "Jun 3",
        tag: "Audio",
        assignees: ["", ""]
      }
    ]
  }
];

export const MOCK_DASHBOARD_CONVERSATIONS = [
  { id: "c1", name: "Maya Johnson", lastMessage: "Just uploaded the new beat", time: "now", unread: 0, avatar: "/mock-profiles/small.png", isOnline: true, isTyping: true, category: "test" },
  { id: "c2", name: "Nkechi Obi", lastMessage: "You: Love the baseline", time: "now", unread: 0, avatar: "/mock-profiles/small2.png", isOnline: true, isTyping: false, category: "test-2" },
  { id: "c3", name: "Kabiru Musa", lastMessage: "What do you think?", time: "12:51", unread: 2, avatar: "/mock-profiles/Tayo.png", isOnline: false, isTyping: false },
  { id: "c4", name: "Brooklyn Simmons", lastMessage: "You: Let’s go over it again", time: "12:31", unread: 0, avatar: "/mock-profiles/Sam.png", isOnline: false, isTyping: false },
  { id: "c5", name: "Dianne Russell", lastMessage: "You: This is great!", time: "12:11", unread: 0, avatar: "/mock-profiles/small3.png", isOnline: false, isTyping: false },
  { id: "c6", name: "Robert Fox", lastMessage: "Recording it right away", time: "11:51", unread: 1, avatar: "/mock-profiles/David.png", isOnline: true, isTyping: false },
  { id: "c7", name: "Leslie Alexander", lastMessage: "That will do", time: "11:41", unread: 0, avatar: "/mock-profiles/small.png", isOnline: false, isTyping: false },
  { id: "c8", name: "Cody Fisher", lastMessage: "You: Exactly!", time: "11:01", unread: 0, avatar: "/mock-profiles/small2.png", isOnline: false, isTyping: false },
];

export const MOCK_DASHBOARD_MESSAGES = [
  { id: 1, sender: "Maya Johnson", text: "Hey Emmanuel! I just listened to the new stems you sent over.", time: "10:30 AM", isMe: false, avatar: "/mock-profiles/small.png" },
  { id: 2, sender: "You", text: "Awesome! What do you think of the transition at the 2-minute mark?", time: "10:35 AM", isMe: true, avatar: "/mock-profiles/user-emmanuel.png" },
  { id: 3, sender: "Maya Johnson", text: "It's super smooth. I might add a tiny bit of reverb to the snare just to give it more depth, but structurally it's perfect.", time: "10:42 AM", isMe: false, avatar: "/mock-profiles/small.png" }
];

//Mock data for profile page
export const PRIMARY_ROLES = ["Record Producer", "Sound Designer", "Music Producer", "Composer", "Songwriter"];
export const SPECIALIZATIONS = ["Sampling", "Live Recording", "Audio Editing", "Podcast Production", "Mixing & Mastering"];

export const PORTFOLIO_ITEMS = [
  { id: 1, title: "Urban Beats Vol. 2", role: "Producer · Mar 2024", status: "Completed", isCompleted: true, image: "/mock-profiles/UrbanBeatsVol.2.png" },
  { id: 2, title: "Harmony App Redesign", role: "Song Writer · Jan 2024", status: "Completed", isCompleted: true, image: "/mock-profiles/HarmonyAppRedesign.png" },
  { id: 3, title: "AfroTech Dashboard", role: "Producer · Nov 2023", status: "Completed", isCompleted: true, image: "/mock-profiles/AfroTechDashboard.png" },
  { id: 4, title: "CreatorOS Platform", role: "Creative Director · Sep 2023", status: "In Progress", isCompleted: false, image: "/mock-profiles/CreatorOSPlatform.png" },
];

export const ACHIEVEMENTS = [
  { id: 1, value: "48", label: "Projects Completed", icon: FiCheckCircle },
  { id: 2, value: "23", label: "Collaborators", icon: FiUsers },
  { id: 3, value: "23", label: "Endorsements", icon: FiAward },
];

export const INSIGHTS = [
  { id: 1, label: "Profile Views", value: "2.4k", change: "+18%" },
  { id: 2, label: "Portfolio Engagement", value: "87%", change: "+3%" },
  { id: 3, label: "Project Invitations", value: "12", change: "+5" },
  { id: 4, label: "Connection Requests", value: "34", change: "+8" },
  { id: 5, label: "Profile Saves", value: "12", change: "+5" },
  { id: 6, label: "Direct Messages", value: "8", change: "+2" },
];

export const SOCIAL_LINKS = [
  { id: 1, platform: "Portfolio", handle: "oyinda.design", icon: FiGlobe },
  { id: 2, platform: "LinkedIn", handle: "/in/oyinda", icon: FiLinkedin },
  { id: 3, platform: "Instagram", handle: "@oyinda.creates", icon: FiInstagram },
  { id: 4, platform: "X (Twitter)", handle: "@oyindadesigns", icon: FiTwitter },
  { id: 5, platform: "Dribbble", handle: "oyinda", icon: FaDribbble },
  { id: 6, platform: "YouTube", handle: "@oyindacraft", icon: FiYoutube },
];

export const TESTIMONIALS = [
  { id: 1, text: "Oyinda is one of the most thoughtful product designers I've ever collaborated with. Her attention to detail is unmatched.", name: "Chinedu Okafor", role: "Project Owner · Urban Beats Vol. 2 · Feb 2024", initials: "CO" },
  { id: 2, text: "Working with Oyinda was a transformative experience for our brand. She elevated our entire platform's aesthetic.", name: "Amara Nwosu", role: "Startup Founder · Harmony App · Jan 2024", initials: "AN" },
  { id: 3, text: "Oyinda brings a rare combination of creativity and strategic thinking. She consistently delivers excellence.", name: "David Mensah", role: "Creative Director · AfroTech Dashboard · Dec 2023", initials: "DM" },
];

//Profile Settings
export const SETTINGS_SIDEBAR_LINKS = [
  { id: "profile", label: "My Profile", icon: FiUser, isActive: true },
  { id: "linked-accounts", label: "Linked Accounts", icon: FiLink, isActive: false },
  { id: "subscriptions", label: "Subscriptions", icon: FiCreditCard, isActive: false },
  { id: "notifications", label: "Notifications", icon: FiBell, isActive: false },
  { id: "security", label: "Security", icon: FiShield, isActive: false },
  { id: "privacy", label: "Privacy & Controls", icon: FiLock, isActive: false },
  { id: "activity", label: "Activity", icon: FiActivity, isActive: false },
  { id: "support", label: "Support & Help", icon: FiHelpCircle, isActive: false },
];

export const PROFILE_FORM_FIELDS = [
  { id: "email", label: "Email Address", value: "oyinda@collabden.io" },
  { id: "phone", label: "Phone Number", value: "+234 801 234 5678" },
  { id: "legalName", label: "Legal Name", value: "Oyinda Babalola" },
  { id: "stageName", label: "Stage Name", value: "Oyinda" },
  { id: "username", label: "Username", value: "@oyinda" },
  { id: "bio", label: "Bio", value: "Product Designer & Analyst based in Lagos. Building intuitive digital workspaces." },
  { id: "language", label: "Language", value: "English (US)" },
  { id: "timezone", label: "Time Zone", value: "Africa/Lagos (WAT, UTC+1)" },
];