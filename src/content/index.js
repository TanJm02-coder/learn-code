import { python } from './python.js';
import { sql } from './sql.js';
import { r } from './r.js';

// Registry of all courses. Add a new language by importing it and listing it here.
export const courses = [python, sql, r];

export function getCourse(id) {
  return courses.find((c) => c.id === id) || null;
}

export function getLesson(courseId, lessonId) {
  const course = getCourse(courseId);
  if (!course) return null;
  return course.lessons.find((l) => l.id === lessonId) || null;
}

// Flat list of every lesson key, used for progress totals.
export function allLessonKeys() {
  return courses.flatMap((c) => c.lessons.map((l) => `${c.id}/${l.id}`));
}
