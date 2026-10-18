-- Disable foreign key enforcement checks temporarily during setup
PRAGMA foreign_keys = ON;

-- Drop existing tables to allow safe re-runs
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

-- 1. Create Tables

-- Students Table
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

-- Courses Table
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE
);

-- Enrolments Table (Join table with composite key constraint)
CREATE TABLE enrolments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  grade TEXT,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE(student_id, course_id) -- Prevents duplicate enrolments for the same student/course
);

-- 2. Insert Sample Data

-- Insert 4 Students (Includes one student without enrolments)
INSERT INTO students (name, email) VALUES
('Alice Smith', 'alice@example.com'),
('Bob Jones', 'bob@example.com'),
('Charlie Brown', 'charlie@example.com'),
('Diana Prince', 'diana@example.com');

-- Insert 3 Courses
INSERT INTO courses (title, code) VALUES
('Web Foundations', 'CS101'),
('Database Systems', 'CS102'),
('Software Engineering', 'CS103');

-- Insert 5 Enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'A'),   -- Alice in Web Foundations
(1, 2, 'B+'),  -- Alice in Database Systems
(2, 1, 'B'),   -- Bob in Web Foundations
(2, 3, 'A-'),  -- Bob in Software Engineering
(3, 2, 'A');   -- Charlie in Database Systems

-- 3. Required Queries

-- Query 1: All courses for one student (by name: 'Alice Smith')
SELECT c.title, c.code, e.grade
FROM courses c
JOIN enrolments e ON c.id = e.course_id
JOIN students s ON s.id = e.student_id
WHERE s.name = 'Alice Smith';

-- Query 2: All students on one course (by course title: 'Database Systems')
SELECT s.name, s.email, e.grade
FROM students s
JOIN enrolments e ON s.id = e.student_id
JOIN courses c ON c.id = e.course_id
WHERE c.title = 'Database Systems';

-- Query 3: The number of students enrolled per course
SELECT c.title, COUNT(e.id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.id = e.course_id
GROUP BY c.id, c.title;

-- Query 4: Students who have no enrolments
SELECT s.name, s.email
FROM students s
LEFT JOIN enrolments e ON s.id = e.student_id
WHERE e.id IS NULL;

-- Query 5: Update one enrolment's grade (updating Bob's Web Foundations grade to 'A+')
UPDATE enrolments
SET grade = 'A+'
WHERE student_id = (SELECT id FROM students WHERE name = 'Bob Jones')
  AND course_id = (SELECT id FROM courses WHERE code = 'CS101');-- Disable foreign key enforcement checks temporarily during setup
PRAGMA foreign_keys = ON;

-- Drop existing tables to allow safe re-runs
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

-- 1. Create Tables

-- Students Table
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

-- Courses Table
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE
);

-- Enrolments Table (Join table with composite key constraint)
CREATE TABLE enrolments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  grade TEXT,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE(student_id, course_id) -- Prevents duplicate enrolments for the same student/course
);

-- 2. Insert Sample Data

-- Insert 4 Students (Includes one student without enrolments)
INSERT INTO students (name, email) VALUES
('Alice Smith', 'alice@example.com'),
('Bob Jones', 'bob@example.com'),
('Charlie Brown', 'charlie@example.com'),
('Diana Prince', 'diana@example.com');

-- Insert 3 Courses
INSERT INTO courses (title, code) VALUES
('Web Foundations', 'CS101'),
('Database Systems', 'CS102'),
('Software Engineering', 'CS103');

-- Insert 5 Enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'A'),   -- Alice in Web Foundations
(1, 2, 'B+'),  -- Alice in Database Systems
(2, 1, 'B'),   -- Bob in Web Foundations
(2, 3, 'A-'),  -- Bob in Software Engineering
(3, 2, 'A');   -- Charlie in Database Systems

-- 3. Required Queries

-- Query 1: All courses for one student (by name: 'Alice Smith')
SELECT c.title, c.code, e.grade
FROM courses c
JOIN enrolments e ON c.id = e.course_id
JOIN students s ON s.id = e.student_id
WHERE s.name = 'Alice Smith';

-- Query 2: All students on one course (by course title: 'Database Systems')
SELECT s.name, s.email, e.grade
FROM students s
JOIN enrolments e ON s.id = e.student_id
JOIN courses c ON c.id = e.course_id
WHERE c.title = 'Database Systems';

-- Query 3: The number of students enrolled per course
SELECT c.title, COUNT(e.id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.id = e.course_id
GROUP BY c.id, c.title;

-- Query 4: Students who have no enrolments
SELECT s.name, s.email
FROM students s
LEFT JOIN enrolments e ON s.id = e.student_id
WHERE e.id IS NULL;

-- Query 5: Update one enrolment's grade (updating Bob's Web Foundations grade to 'A+')
UPDATE enrolments
SET grade = 'A+'
WHERE student_id = (SELECT id FROM students WHERE name = 'Bob Jones')
  AND course_id = (SELECT id FROM courses WHERE code = 'CS101');