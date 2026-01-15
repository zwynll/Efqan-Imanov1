export type UserRole = 
  | "COURSE_1_ADMIN" 
  | "COURSE_2_ADMIN" 
  | "COURSE_3_ADMIN" 
  | "COURSE_4_ADMIN" 
  | "MAIN_ADMIN_READ" 
  | "MAIN_ADMIN_FULL";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  course?: number;
}

export interface Course {
  id: number;
  name: string;
  teamCount: number;
}

export interface Team {
  id: string;
  name: string;
  courseId: number;
  commander?: string;
  commanderRank?: string;
  commanderContact?: string;
  subCommander1?: string;
  subCommander1Rank?: string;
  subCommander1Contact?: string;
  subCommander2?: string;
  subCommander2Rank?: string;
  subCommander2Contact?: string;
  subCommander3?: string;
  subCommander3Rank?: string;
  subCommander3Contact?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  courseId: number;
  teamId: string;
  photo?: string;
  currentScore: number;
  birthDate: string;
  birthPlace?: string;
  registeredAddress?: string;
  currentAddress?: string;
  workNumber?: string;
  originLocation?: string;
  serviceStartYear?: number;
  position?: string;
  rank?: string;
  awards?: string;
  foreignLanguages?: string;
  sportsAchievements?: string;
  idCardNumber?: string;
  serviceCardNumber?: string;
  email: string;
  phone: string;
  phoneHome?: string;
  address?: string;
  emergencyContact?: string;
  militaryService?: boolean;
  height?: number;
  weight?: number;
  photoUrl?: string;
}

export interface FamilyMember {
  id: string;
  studentId: string;
  relation: 'Ata' | 'Ana' | 'Qardaş' | 'Bacı' | 'Qohum';
  fullName: string;
  birthDate?: string;
  birthPlace?: string;
  address?: string;
  job?: string;
  phoneMobile?: string;
  phoneHome?: string;
}

export interface CourseLeadershipStaff {
  id: string;
  courseId: number;
  fullName: string;
  rank?: string;
  position?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
}

export interface CourseLeadership {
  id: string;
  courseId: number;
  fullName: string;
  rank?: string;
  position?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  additionalStaff?: CourseLeadershipStaff[];
}

export interface DisciplineRecord {
  id: string;
  studentId: string;
  date: string;
  year?: number;
  event: string;
  scoreChange: number;
  note?: string;
}
