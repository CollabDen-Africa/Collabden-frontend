//Temporary data until integration

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