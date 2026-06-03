// Mock Certificate Data
export const mockCertificateData = {
  certificateId: "cert_2026_005_123",
  
  // Student Information
  studentName: "Divya Sharma",
  studentId: "student_123",
  studentEmail: "divya.sharma@example.com",
  
  // Quiz/Course Information
  quizTitle: "Advanced JavaScript Concepts",
  quizId: "quiz_001",
  category: "Web Development",
  description: "A comprehensive course covering advanced JavaScript ES6+, async programming, and design patterns",
  
  // Performance Details
  finalScore: 850,
  maxScore: 1000,
  scorePercentage: 85,
  grade: "A+",
  
  // Completion Details
  completionDate: "2026-05-06",
  issueDate: "2026-05-06",
  expiryDate: "2027-05-06", // 1 year validity
  validityPeriod: "1 year",
  
  // Instructor Information
  instructorName: "Dr. Jane Doe",
  instructorTitle: "Senior JavaScript Instructor",
  institution: "Tech Academy Online",
  
  // Badge/Achievement
  badge: "Expert JavaScript Developer",
  badgeColor: "#1e40af", // Indigo
  
  // Verification
  verificationCode: "JS-CERT-2026-045892",
  certificateURL: "https://academy.example.com/verify/cert_2026_005_123",
  
  // Additional Achievements
  achievements: [
    "Perfect score in ES6+ Basics",
    "Top 3% in class",
    "Completed all bonus challenges",
  ],
  
  // Issuing Organization
  organization: "Tech Academy",
  logoUrl: null, // Can be added later
  signatory: {
    name: "Dr. Sarah Johnson",
    title: "Director of Certification",
    signature: null,
  },
};

// Alternative certificate templates available
export const certificateTemplates = [
  { id: "modern", name: "Modern Blue", color: "#1e40af", style: "modern" },
  { id: "classic", name: "Classic Gold", color: "#b8860b", style: "classic" },
  { id: "minimal", name: "Minimal Gray", color: "#4b5563", style: "minimal" },
  { id: "vibrant", name: "Vibrant Gradient", color: "gradient", style: "vibrant" },
];

export default mockCertificateData;
