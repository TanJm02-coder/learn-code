import { courses } from '../content/index.js';
import { navigate } from '../lib/router.js';

export function Sidebar({ route, isComplete }) {
  const activeCourse = route.courseId;
  const activeLesson = route.lessonId;

  return (
    <aside className="sidebar">
      <a className="brand" href="#/" onClick={() => navigate('/')}>
        <span className="brand-mark">{'</>'}</span> LearnCode
      </a>
      <nav>
        {courses.map((course) => {
          const done = course.lessons.filter((l) => isComplete(course.id, l.id)).length;
          return (
            <div key={course.id} className="nav-course">
              <a
                className={`nav-course-title ${activeCourse === course.id ? 'active' : ''}`}
                href={`#/course/${course.id}`}
              >
                {course.name}
                <span className="nav-count">
                  {done}/{course.lessons.length}
                </span>
              </a>
              {activeCourse === course.id && (
                <ul className="nav-lessons">
                  {course.lessons.map((l) => (
                    <li key={l.id}>
                      <a
                        className={`nav-lesson ${activeLesson === l.id ? 'active' : ''}`}
                        href={`#/course/${course.id}/${l.id}`}
                      >
                        <span className={`dot ${isComplete(course.id, l.id) ? 'dot-done' : ''}`} />
                        {l.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
