export const mockUser = {
  name: "John Doe",
  username: "john-doe",
  headline: "Computer Science Student • Developer • Builder",
  bio: "Computer Science student at University of Dhaka passionate about building web applications with modern JavaScript. Led 35-member robotics club and shipped 8+ projects.",
  location: "Dhaka, Bangladesh",
  education: "BSc in Computer Science, University of Dhaka",
  avatar: "https://api.dicebear.com/9.x/initials/svg?seed=John%20Doe",
  interests: ["Software Development", "AI", "Robotics", "Leadership"],
  socials: {
    github: "github.com/john-doe",
    linkedin: "linkedin.com/in/john-doe",
    email: "john@example.com",
  },
  completion: 72,
  stats: {
    projects: 8,
    certificates: 12,
    experiences: 3,
    eca: 5,
    views: 1248,
  },
};

export const mockProjects = [
  {
    id: "1",
    title: "AI Study Assistant",
    description: "An AI-powered study assistant that helps students organize notes, generate quizzes, and track progress.",
    longDescription: "Built with Next.js, TypeScript, OpenAI API and PostgreSQL. Supports document upload, spaced repetition, and insights dashboard.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format&fit=crop",
    tech: ["Next.js", "TypeScript", "OpenAI API", "PostgreSQL"],
    links: { github: "#", live: "#" },
    featured: true,
    year: "2026",
  },
  {
    id: "2",
    title: "Campus Event Hub",
    description: "Responsive registration platform for university clubs. Streamlined event registration for 1200+ students.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80&auto=format&fit=crop",
    tech: ["React", "Node.js", "MongoDB"],
    links: { github: "#", live: "#" },
    featured: true,
    year: "2025",
  },
  {
    id: "3",
    title: "Robotics Telemetry Dashboard",
    description: "Realtime telemetry visualization for national robotics competition bots.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80&auto=format&fit=crop",
    tech: ["Python", "WebSockets", "D3.js"],
    links: { github: "#" },
    featured: false,
    year: "2025",
  },
];

export const mockExperiences = [
  {
    id: "1",
    role: "Frontend Developer Intern",
    org: "ABC Technologies",
    location: "Dhaka, Remote",
    period: "Jan 2026 — Present",
    description: "Building accessible component library and optimizing Core Web Vitals from 62 to 94.",
    achievements: ["Shipped design system used by 4 teams", "Reduced bundle size by 28%"],
    current: true,
  },
  {
    id: "2",
    role: "President",
    org: "University Robotics Club",
    location: "University of Dhaka",
    period: "2025 — 2026",
    description: "Led 35-member organization, organized workshops and represented university nationally.",
    achievements: ["Organized 12 workshops", "Finalist — National Robotics Competition"],
    current: false,
  },
];

export const mockCertificates = [
  {
    id: "1",
    name: "Full Stack Web Development",
    org: "Programming Hero",
    date: "Aug 2026",
    skills: ["React", "Node.js", "Express", "MongoDB"],
    credential: "#",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Web Development Fundamentals",
    org: "ABC Academy",
    date: "Mar 2026",
    skills: ["HTML", "CSS", "JavaScript"],
    credential: "#",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c429?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "AI for Everyone",
    org: "Coursera • DeepLearning.AI",
    date: "Jan 2026",
    skills: ["AI Literacy", "Prompting"],
    credential: "#",
    image: "https://images.unsplash.com/photo-1501504905252-473cbee65f87?w=600&q=80&auto=format&fit=crop",
  },
];

export const mockECA = [
  {
    id: "1",
    name: "President — University Robotics Club",
    category: "Leadership",
    org: "University of Dhaka",
    period: "2025–2026",
    description: "Led 35-member student org, organized workshops, represented university in national competitions.",
    images: 3,
    skills: ["Leadership", "Public Speaking"],
  },
  {
    id: "2",
    name: "Debate — Inter-University Championship",
    category: "Debate",
    org: "Dhaka Debate Circle",
    period: "2024",
    description: "Reached semifinals among 48 teams. Coordinated research and case building.",
    images: 1,
    skills: ["Communication", "Critical Thinking"],
  },
  {
    id: "3",
    name: "Volunteer — Community Clean Drive",
    category: "Volunteering",
    org: "Local NGO",
    period: "2024",
    description: "Coordinated 60 volunteers for city-wide awareness campaign.",
    images: 2,
    skills: ["Community", "Organization"],
  },
];

export const mockAchievements = [
  { id: "1", icon: "🏆", title: "National Hackathon — 1st Place", org: "XYZ University", year: "2026", detail: "Awarded first place among 120 teams." },
  { id: "2", icon: "🎖", title: "Robotics Competition — Finalist", org: "National Robotics Fest", year: "2025", detail: "Top 8 nationally." },
  { id: "3", icon: "📜", title: "Research Poster — University Symposium", org: "University of Dhaka", year: "2025", detail: "Presented AI in education research." },
];

export const mockSkills = {
  technical: ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL"],
  tools: ["Git", "Docker", "Figma", "Vercel"],
  soft: ["Leadership", "Communication", "Teamwork", "Problem Solving"],
};

export const mockCourses = [
  { id: "1", name: "Full Stack Web Development", provider: "Programming Hero", instructor: "Jhankar Mahbub", date: "Aug 2026", skills: ["React", "Node.js", "Express", "MongoDB"] },
  { id: "2", name: "Data Structures & Algorithms", provider: "University", instructor: "Dept. CSE", date: "Dec 2025", skills: ["DSA", "C++"] },
];
