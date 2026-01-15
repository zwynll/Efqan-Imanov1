import { User, Course, Team, Student, DisciplineRecord } from "@/types";

export const USERS: User[] = [
  {
    id: "1",
    email: "rehimcabbarov@gmail.com",
    name: "Rəhim Cabbarov",
    role: "COURSE_1_ADMIN",
    course: 1,
  },
  {
    id: "2",
    email: "turalceferov@gmail.com",
    name: "Tural Cəfərov",
    role: "COURSE_2_ADMIN",
    course: 2,
  },
  {
    id: "3",
    email: "orxanmirzeyev@gmail.com",
    name: "Orxan Mirzəyev",
    role: "COURSE_3_ADMIN",
    course: 3,
  },
  {
    id: "4",
    email: "farizyusifov@gmail.com",
    name: "Fariz Yusifov",
    role: "COURSE_4_ADMIN",
    course: 4,
  },
  {
    id: "5",
    email: "efganimaov@gmail.com",
    name: "Əfqan İmaov",
    role: "MAIN_ADMIN_READ",
  },
  {
    id: "6",
    email: "aliramazan@gmail.com",
    name: "Ali Ramazan",
    role: "MAIN_ADMIN_FULL",
  },
];

export const PASSWORDS: Record<string, string> = {
  "rehimcabbarov@gmail.com": "19.01",
  "turalceferov@gmail.com": "19.02",
  "orxanmirzeyev@gmail.com": "19.03",
  "farizyusifov@gmail.com": "19.04",
  "efganimaov@gmail.com": "0021",
  "aliramazan@gmail.com": "199313",
};

export const COURSES: Course[] = [
  { id: 1, name: "I Kurs", teamCount: 23 },
  { id: 2, name: "II Kurs", teamCount: 20 },
  { id: 3, name: "III Kurs", teamCount: 12 },
  { id: 4, name: "IV Kurs", teamCount: 8 },
];

export const TEAMS: Team[] = [
  ...Array.from({ length: 23 }, (_, i) => ({
    id: `1-${i + 1}`,
    name: `Taqım ${i + 1}`,
    courseId: 1,
    commander: `Komandir ${i + 1}`,
    commanderRank: "Mayor",
    commanderContact: `+994 50 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
    subCommander1: `Manga Komandiri ${i + 1}-1`,
    subCommander1Rank: "Leytenant",
    subCommander1Contact: `+994 51 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
    subCommander2: `Manga Komandiri ${i + 1}-2`,
    subCommander2Rank: "Leytenant",
    subCommander2Contact: `+994 55 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
    subCommander3: `Manga Komandiri ${i + 1}-3`,
    subCommander3Rank: "Leytenant",
    subCommander3Contact: `+994 70 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
  })),
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `2-${i + 1}`,
    name: `Taqım ${i + 1}`,
    courseId: 2,
    commander: `Komandir ${i + 1}`,
    commanderRank: "Mayor",
    commanderContact: `+994 50 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
    subCommander1: `Manga Komandiri ${i + 1}-1`,
    subCommander1Rank: "Leytenant",
    subCommander1Contact: `+994 51 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
    subCommander2: `Manga Komandiri ${i + 1}-2`,
    subCommander2Rank: "Leytenant",
    subCommander2Contact: `+994 55 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
    subCommander3: `Manga Komandiri ${i + 1}-3`,
    subCommander3Rank: "Leytenant",
    subCommander3Contact: `+994 70 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `3-${i + 1}`,
    name: `Taqım ${i + 1}`,
    courseId: 3,
    commander: `Komandir ${i + 1}`,
    commanderRank: "Mayor",
    commanderContact: `+994 50 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
    subCommander1: `Manga Komandiri ${i + 1}-1`,
    subCommander1Rank: "Leytenant",
    subCommander1Contact: `+994 51 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
    subCommander2: `Manga Komandiri ${i + 1}-2`,
    subCommander2Rank: "Leytenant",
    subCommander2Contact: `+994 55 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
    subCommander3: `Manga Komandiri ${i + 1}-3`,
    subCommander3Rank: "Leytenant",
    subCommander3Contact: `+994 70 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `4-${i + 1}`,
    name: `Taqım ${i + 1}`,
    courseId: 4,
    commander: `Komandir ${i + 1}`,
    commanderRank: "Mayor",
    commanderContact: `+994 50 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
    subCommander1: `Manga Komandiri ${i + 1}-1`,
    subCommander1Rank: "Leytenant",
    subCommander1Contact: `+994 51 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
    subCommander2: `Manga Komandiri ${i + 1}-2`,
    subCommander2Rank: "Leytenant",
    subCommander2Contact: `+994 55 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
    subCommander3: `Manga Komandiri ${i + 1}-3`,
    subCommander3Rank: "Leytenant",
    subCommander3Contact: `+994 70 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
  })),
];

const firstNames = ["Əli", "Vəli", "Rəşad", "Fərid", "Nicat", "Elçin", "Ramin", "Tural", "Orxan", "Kamran"];
const lastNames = ["Məmmədov", "Əliyev", "Həsənov", "Hüseynov", "Quliyev", "İsmayılov", "Abdullayev", "Rəhimov", "Bayramov", "Əhmədov"];
const fatherNames = ["Əli oğlu", "Vəli oğlu", "Rəşad oğlu", "Fərid oğlu", "Nicat oğlu", "Elçin oğlu", "Ramin oğlu"];

export const STUDENTS: Student[] = TEAMS.flatMap((team) =>
  Array.from({ length: 25 }, (_, i) => ({
    id: `${team.id}-s${i + 1}`,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    fatherName: fatherNames[Math.floor(Math.random() * fatherNames.length)],
    courseId: team.courseId,
    teamId: team.id,
    currentScore: Math.floor(Math.random() * 200) - 50,
    birthDate: `200${Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    email: `student${team.id}-${i + 1}@ayh.edu.az`,
    phone: `+994 50 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
    address: "Bakı şəhəri",
    emergencyContact: `+994 50 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
  }))
);

const events = [
  "Dərsdə iştirak",
  "Tapşırığı vaxtında təhvil verdi",
  "Gecikmə",
  "Dərsdən izinsiz yox olma",
  "Nümunəvi davranış",
  "İntizam pozuntusu",
  "Tədbirdə iştirak",
  "Əlavə tapşırıq yerinə yetirildi",
];

export const RECORDS: DisciplineRecord[] = STUDENTS.flatMap((student) =>
  Array.from({ length: Math.floor(Math.random() * 10) + 5 }, (_, i) => ({
    id: `${student.id}-r${i + 1}`,
    studentId: student.id,
    date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    event: events[Math.floor(Math.random() * events.length)],
    scoreChange: Math.floor(Math.random() * 21) - 10,
    note: Math.random() > 0.5 ? "Qeyd: Əlavə məlumat" : undefined,
  }))
);
