# School Relational Database Design

This document details the database schema, entity relationships, performance index considerations, and architectural rationale for the school management system.

---

## 1. Table Explanations

- **`students`**: Stores core information about registered students, including their primary identification key (`id`), full name, and a strictly unique email address.
- **`courses`**: Stores information on available academic courses, such as course title and unique course code.
- **`enrolments`**: Serves as a join/junction table linking students and courses. It stores contextual record data specific to a student's participation in a course, such as their assigned grade.

---

## 2. Entity Relationships

- **Student to Enrolment (`1 : N`)**: One student can have multiple course enrolment records, but each enrolment record belongs to exactly one student.
- **Course to Enrolment (`1 : N`)**: One course can have many student enrolment records, but each enrolment record belongs to exactly one course.
- **Student to Course (`M : N`)**: A student can register for multiple courses, and a course can have multiple students enrolled.

### Why a Join Table is Needed
Relational databases cannot cleanly model many-to-many (`M : N`) relationships directly without introducing data redundancy or array storage issues within single fields. The `enrolments` join table breaks the `M : N` relationship into two manageable `1 : N` relationships. Furthermore, attributes specific to the interaction itself (such as the `grade`) belong naturally on the `enrolments` table rather than on the `students` or `courses` tables.

---

## 3. Recommended Index

- **Index:** `CREATE INDEX idx_enrolments_student_id ON enrolments(student_id);`
- **Reason:** In real-world academic applications, queries frequently search, join, and filter enrolments by `student_id` (e.g., generating student transcripts or loading dashboard schedules). Adding an index on `student_id` reduces lookup operations from a full table scan ($O(N)$ complexity) to an indexed B-tree lookup ($O(\log N)$ complexity).

---

## 4. Database Selection: SQL vs. NoSQL

For a school enrolment system, **SQL (Relational Database)** is the optimal choice. Academic management applications depend heavily on structured relationships, relational constraints, and strict data consistency. SQL ensures ACID compliance (Atomicity, Consistency, Isolation, Durability), preventing issues like enrolling non-existent students, registering duplicate course records, or losing transactional records during simultaneous updates. A NoSQL document store could lead to duplicated student/course data and complex synchronization tasks across documents when grades or course details are modified.