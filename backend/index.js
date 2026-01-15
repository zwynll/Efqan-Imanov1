import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { open } from 'sqlite';

const app = express();
const PORT = 4000;
const JWT_SECRET = 'CHANGE_THIS_SECRET_KEY';

// Middlewares
app.use(cors());
app.use(express.json());

// SQLite connection
let db;
(async () => {
  db = await open({
    filename: './localdb.sqlite',
    driver: sqlite3.Database,
  });

  // Create tables if not exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT
    );
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      content TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id TEXT,
      course_id INTEGER,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      father_name TEXT NOT NULL,
      birth_date TEXT,
      birth_place TEXT,
      registered_address TEXT,
      current_address TEXT,
      work_number TEXT,
      origin_location TEXT,
      service_start_year INTEGER,
      position TEXT,
      rank TEXT,
      awards TEXT,
      foreign_languages TEXT,
      sports_achievements TEXT,
      id_card_number TEXT,
      service_card_number TEXT,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      phone_home TEXT,
      address TEXT,
      emergency_contact TEXT,
      military_service INTEGER DEFAULT 0,
      height REAL,
      weight REAL,
      photo_url TEXT,
      current_score INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS family_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT,
      relation TEXT,
      full_name TEXT,
      birth_date TEXT,
      birth_place TEXT,
      address TEXT,
      job TEXT,
      phone_mobile TEXT,
      phone_home TEXT,
      FOREIGN KEY(student_id) REFERENCES students(id)
    );
    CREATE TABLE IF NOT EXISTS discipline_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT,
      date TEXT,
      year INTEGER,
      event TEXT,
      score_change INTEGER,
      note TEXT,
      FOREIGN KEY(student_id) REFERENCES students(id)
    );
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      course_id INTEGER,
      name TEXT,
      commander TEXT,
      commander_rank TEXT,
      commander_contact TEXT,
      sub_commander_1 TEXT,
      sub_commander_1_rank TEXT,
      sub_commander_1_contact TEXT,
      sub_commander_2 TEXT,
      sub_commander_2_rank TEXT,
      sub_commander_2_contact TEXT,
      sub_commander_3 TEXT,
      sub_commander_3_rank TEXT,
      sub_commander_3_contact TEXT
    );
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    );
    CREATE TABLE IF NOT EXISTS leadership (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      full_name TEXT,
      position TEXT,
      rank TEXT,
      email TEXT,
      phone TEXT,
      photo_url TEXT,
      bio TEXT
    );
    CREATE TABLE IF NOT EXISTS leadership_staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      leadership_id INTEGER,
      full_name TEXT,
      position TEXT,
      rank TEXT,
      email TEXT,
      phone TEXT,
      photo_url TEXT,
      FOREIGN KEY(course_id) REFERENCES courses(id),
      FOREIGN KEY(leadership_id) REFERENCES leadership(id)
    );
  `);

  // Create default users if they don't exist
  const defaultUsers = [
    { email: 'rehimcabbarov@gmail.com', password: '19.01', fullName: 'Rəhim Cabbarov' },
    { email: 'turalceferov@gmail.com', password: '19.02', fullName: 'Tural Cəfərov' },
    { email: 'orxanmirzeyev@gmail.com', password: '19.03', fullName: 'Orxan Mirzəyev' },
    { email: 'farizyusifov@gmail.com', password: '19.04', fullName: 'Fariz Yusifov' },
    { email: 'efganimaov@gmail.com', password: '0021', fullName: 'Əfqan İmaov' },
    { email: 'aliramazan@gmail.com', password: '199313', fullName: 'Ali Ramazan' },
    { email: 'abdullazadezeynal9@gmail.com', password: 'zeynal123', fullName: 'Zeynal Abdullazadə' }
  ];

  for (const user of defaultUsers) {
    try {
      const existing = await db.get('SELECT id FROM users WHERE email = ?', user.email);
      if (!existing) {
        const hash = bcrypt.hashSync(user.password, 8);
        await db.run('INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)', 
          user.email, hash, user.fullName);
        console.log(`Default user created: ${user.email}`);
      }
    } catch (err) {
      console.error(`Error creating user ${user.email}:`, err.message);
    }
  }
})()

// Register endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName)
    return res.status(400).json({ error: 'Verilənlər tam deyil!' });
  try {
    const hash = bcrypt.hashSync(password, 8);
    const { lastID } = await db.run(
      'INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)',
      email, hash, fullName
    );
    res.json({ id: lastID, email, fullName });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Verilənlər tam deyil!' });
  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (!user) return res.status(401).json({ error: 'İstifadəçi tapılmadı!' });
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Şifrə yanlışdır!' });
    
    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.full_name },
      JWT_SECRET,
      { expiresIn: '12h' }
    );
    res.json({ token, user: { id: user.id, email: user.email, fullName: user.full_name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Token yoxdur' });
  const token = auth.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token yanlışdır' });
  }
}

// Example protected route
app.get('/api/profile', authMiddleware, async (req, res) => {
  const user = await db.get('SELECT id, email, full_name FROM users WHERE id = ?', req.user.id);
  res.json(user);
});

// ---------------- Kurs Rəhbərliyi API ------------------
// Get all leadership by course id
app.get('/api/leadership/:courseId', authMiddleware, async (req, res) => {
  const { courseId } = req.params;
  const leadership = await db.get('SELECT * FROM leadership WHERE course_id = ?', courseId);
  if (!leadership) {
    res.json([]);
    return;
  }
  const staff = await db.all('SELECT * FROM leadership_staff WHERE course_id = ?', courseId);
  res.json([{ ...leadership, staff_members: staff }]);
});

// Add/Update leadership (upsert by id)
app.post('/api/leadership', authMiddleware, async (req, res) => {
  const { course_id, full_name, position, rank, email, phone, photo_url, bio, id, staff_members } = req.body;
  try {
    let leadershipId = id;
    if (id) {
      // Update
      await db.run('UPDATE leadership SET full_name=?, position=?, rank=?, email=?, phone=?, photo_url=?, bio=? WHERE id=?', [full_name, position, rank, email, phone, photo_url, bio, id]);
      leadershipId = id;
    } else {
      // Insert
      const result = await db.run('INSERT INTO leadership (course_id, full_name, position, rank, email, phone, photo_url, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [course_id, full_name, position, rank, email, phone, photo_url, bio]);
      leadershipId = result.lastID;
    }

    // Handle staff members
    if (staff_members && Array.isArray(staff_members)) {
      // Delete existing staff for this course
      await db.run('DELETE FROM leadership_staff WHERE course_id = ?', course_id);
      
      // Insert new staff members
      for (const staff of staff_members) {
        if (staff.fullName && staff.fullName.trim()) {
          await db.run(
            'INSERT INTO leadership_staff (course_id, leadership_id, full_name, position, rank, email, phone, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [course_id, leadershipId, staff.fullName, staff.position || null, staff.rank || null, staff.email || null, staff.phone || null, staff.photoUrl || null]
          );
        }
      }
    }

    res.json({ id: leadershipId, updated: !!id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete leadership
app.delete('/api/leadership/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM leadership WHERE id = ?', id);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// ------------------------------------------------------

// Taglar (Tagim) üçün route-lar
app.get('/api/tags', authMiddleware, async (req, res) => {
  const data = await db.all('SELECT * FROM tags WHERE user_id = ?', req.user.id);
  res.json(data);
});

app.post('/api/tags', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const result = await db.run('INSERT INTO tags (user_id, title, content) VALUES (?, ?, ?)', req.user.id, title, content);
  res.json({ id: result.lastID, success: true });
});

app.put('/api/tags/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  await db.run('UPDATE tags SET title = ?, content = ? WHERE id = ? AND user_id = ?', title, content, id, req.user.id);
  res.json({ success: true });
});

app.delete('/api/tags/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  await db.run('DELETE FROM tags WHERE id = ? AND user_id = ?', id, req.user.id);
  res.json({ success: true });
});

// Students — kursantlar üçün endpoints
app.get('/api/students/team/:teamId', authMiddleware, async (req, res) => {
  const { teamId } = req.params;
  const students = await db.all('SELECT * FROM students WHERE team_id = ?', teamId);
  for (const student of students) {
    const family = await db.all('SELECT * FROM family_members WHERE student_id = ?', student.id);
    const records = await db.all('SELECT * FROM discipline_records WHERE student_id = ? ORDER BY date DESC', student.id);
    student.family_members = family;
    student.discipline_records = records;
  }
  res.json(students);
});

app.get('/api/students/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const student = await db.get('SELECT * FROM students WHERE id = ?', id);
  if (!student) {
    res.status(404).json({ error: 'Kursant tapılmadı' });
    return;
  }
  const family = await db.all('SELECT * FROM family_members WHERE student_id = ?', id);
  const records = await db.all('SELECT * FROM discipline_records WHERE student_id = ? ORDER BY date DESC', id);
  res.json({ ...student, family_members: family, discipline_records: records });
});

app.post('/api/students', authMiddleware, async (req, res) => {
  const { team_id, course_id, first_name, last_name, father_name, birth_date, birth_place, registered_address, current_address, work_number, origin_location, service_start_year, position, rank, awards, foreign_languages, sports_achievements, id_card_number, service_card_number, email, phone, phone_home, address, emergency_contact, military_service, height, weight, photo_url, family_members, discipline_records } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO students (team_id, course_id, first_name, last_name, father_name, birth_date, birth_place, registered_address, current_address, work_number, origin_location, service_start_year, position, rank, awards, foreign_languages, sports_achievements, id_card_number, service_card_number, email, phone, phone_home, address, emergency_contact, military_service, height, weight, photo_url, current_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)',
      [team_id, course_id, first_name, last_name, father_name, birth_date, birth_place, registered_address, current_address, work_number, origin_location, service_start_year, position, rank, awards, foreign_languages, sports_achievements, id_card_number, service_card_number, email, phone, phone_home, address, emergency_contact, military_service ? 1 : 0, height, weight, photo_url]
    );
    
    const studentId = result.lastID.toString();
    
    // Insert family members
    if (family_members && Array.isArray(family_members)) {
      for (const member of family_members) {
        if (member.fullName) {
          await db.run(
            'INSERT INTO family_members (student_id, relation, full_name, birth_date, birth_place, address, job, phone_mobile, phone_home) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [studentId, member.relation || null, member.fullName, member.birthDate || null, member.birthPlace || null, member.address || null, member.job || null, member.phoneMobile || null, member.phoneHome || null]
          );
        }
      }
    }
    
    // Insert discipline records
    if (discipline_records && Array.isArray(discipline_records)) {
      for (const record of discipline_records) {
        if (record.event) {
          await db.run(
            'INSERT INTO discipline_records (student_id, date, year, event, score_change, note) VALUES (?, ?, ?, ?, ?, ?)',
            [studentId, record.date || new Date().toISOString().split('T')[0], record.year || null, record.event, record.scoreChange || 0, record.note || null]
          );
        }
      }
    }
    
    res.json({ id: studentId, success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/students/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { team_id, course_id, first_name, last_name, father_name, birth_date, birth_place, registered_address, current_address, work_number, origin_location, service_start_year, position, rank, awards, foreign_languages, sports_achievements, id_card_number, service_card_number, email, phone, phone_home, address, emergency_contact, military_service, height, weight, photo_url, family_members, discipline_records } = req.body;
  try {
    // Get existing student to preserve team_id and course_id if not provided
    const existing = await db.get('SELECT team_id, course_id FROM students WHERE id = ?', id);
    const finalTeamId = team_id || existing?.team_id;
    const finalCourseId = course_id || existing?.course_id;
    
    await db.run(
      'UPDATE students SET team_id=?, course_id=?, first_name=?, last_name=?, father_name=?, birth_date=?, birth_place=?, registered_address=?, current_address=?, work_number=?, origin_location=?, service_start_year=?, position=?, rank=?, awards=?, foreign_languages=?, sports_achievements=?, id_card_number=?, service_card_number=?, email=?, phone=?, phone_home=?, address=?, emergency_contact=?, military_service=?, height=?, weight=?, photo_url=? WHERE id=?',
      [finalTeamId, finalCourseId, first_name, last_name, father_name, birth_date, birth_place, registered_address, current_address, work_number, origin_location, service_start_year, position, rank, awards, foreign_languages, sports_achievements, id_card_number, service_card_number, email, phone, phone_home, address, emergency_contact, military_service ? 1 : 0, height, weight, photo_url, id]
    );
    
    // Update family members
    if (family_members && Array.isArray(family_members)) {
      const existingIds = family_members.filter(m => m.id).map(m => m.id);
      await db.run('DELETE FROM family_members WHERE student_id = ? AND id NOT IN (' + (existingIds.length > 0 ? existingIds.map(() => '?').join(',') : 'NULL') + ')', existingIds.length > 0 ? [id, ...existingIds] : [id]);
      
      for (const member of family_members) {
        if (member.id) {
          await db.run(
            'UPDATE family_members SET relation=?, full_name=?, birth_date=?, birth_place=?, address=?, job=?, phone_mobile=?, phone_home=? WHERE id=?',
            [member.relation || null, member.fullName, member.birthDate || null, member.birthPlace || null, member.address || null, member.job || null, member.phoneMobile || null, member.phoneHome || null, member.id]
          );
        } else if (member.fullName) {
          await db.run(
            'INSERT INTO family_members (student_id, relation, full_name, birth_date, birth_place, address, job, phone_mobile, phone_home) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, member.relation || null, member.fullName, member.birthDate || null, member.birthPlace || null, member.address || null, member.job || null, member.phoneMobile || null, member.phoneHome || null]
          );
        }
      }
    }
    
    // Update discipline records
    if (discipline_records && Array.isArray(discipline_records)) {
      const existingIds = discipline_records.filter(r => r.id).map(r => r.id);
      await db.run('DELETE FROM discipline_records WHERE student_id = ? AND id NOT IN (' + (existingIds.length > 0 ? existingIds.map(() => '?').join(',') : 'NULL') + ')', existingIds.length > 0 ? [id, ...existingIds] : [id]);
      
      for (const record of discipline_records) {
        if (record.id) {
          await db.run(
            'UPDATE discipline_records SET date=?, year=?, event=?, score_change=?, note=? WHERE id=?',
            [record.date || new Date().toISOString().split('T')[0], record.year || null, record.event, record.scoreChange || 0, record.note || null, record.id]
          );
        } else if (record.event) {
          await db.run(
            'INSERT INTO discipline_records (student_id, date, year, event, score_change, note) VALUES (?, ?, ?, ?, ?, ?)',
            [id, record.date || new Date().toISOString().split('T')[0], record.year || null, record.event, record.scoreChange || 0, record.note || null]
          );
        }
      }
    }
    
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/students/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM family_members WHERE student_id = ?', id);
    await db.run('DELETE FROM discipline_records WHERE student_id = ?', id);
    await db.run('DELETE FROM students WHERE id = ?', id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Teams endpoint
app.get('/api/teams', authMiddleware, async (req, res) => {
  const { courseId } = req.query;
  if (courseId) {
    const data = await db.all('SELECT * FROM teams WHERE course_id = ?', courseId);
    res.json(data);
  } else {
    const data = await db.all('SELECT * FROM teams');
    res.json(data);
  }
});

app.post('/api/teams', authMiddleware, async (req, res) => {
  const { id, course_id, name, commander, commander_rank, commander_contact, sub_commander_1, sub_commander_1_rank, sub_commander_1_contact, sub_commander_2, sub_commander_2_rank, sub_commander_2_contact, sub_commander_3, sub_commander_3_rank, sub_commander_3_contact } = req.body;
  try {
    if (id) {
      await db.run('UPDATE teams SET course_id=?, name=?, commander=?, commander_rank=?, commander_contact=?, sub_commander_1=?, sub_commander_1_rank=?, sub_commander_1_contact=?, sub_commander_2=?, sub_commander_2_rank=?, sub_commander_2_contact=?, sub_commander_3=?, sub_commander_3_rank=?, sub_commander_3_contact=? WHERE id=?',
        [course_id, name, commander, commander_rank, commander_contact, sub_commander_1, sub_commander_1_rank, sub_commander_1_contact, sub_commander_2, sub_commander_2_rank, sub_commander_2_contact, sub_commander_3, sub_commander_3_rank, sub_commander_3_contact, id]);
      res.json({ success: true });
    } else {
      const newId = `team-${Date.now()}`;
      await db.run('INSERT INTO teams (id, course_id, name, commander, commander_rank, commander_contact, sub_commander_1, sub_commander_1_rank, sub_commander_1_contact, sub_commander_2, sub_commander_2_rank, sub_commander_2_contact, sub_commander_3, sub_commander_3_rank, sub_commander_3_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [newId, course_id, name, commander, commander_rank, commander_contact, sub_commander_1, sub_commander_1_rank, sub_commander_1_contact, sub_commander_2, sub_commander_2_rank, sub_commander_2_contact, sub_commander_3, sub_commander_3_rank, sub_commander_3_contact]);
      res.json({ id: newId, success: true });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Courses endpoint
app.get('/api/courses', authMiddleware, async (req, res) => {
  const data = await db.all('SELECT * FROM courses');
  res.json(data);
});

app.post('/api/courses', authMiddleware, async (req, res) => {
  const { name } = req.body;
  await db.run('INSERT INTO courses (name) VALUES (?)', name);
  res.json({ success: true });
});

// Başlat
app.listen(PORT, () => {
  console.log('Local backend hazırdır! Port:', PORT);
});
