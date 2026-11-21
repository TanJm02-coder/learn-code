import { courses, getCourse, getLesson } from '../content/index.js';
import { navigate } from '../lib/router.js';
import { Markdownish } from './Markdownish.jsx';
import { CodePlayground } from './CodePlayground.jsx';
import { Quiz } from './Quiz.jsx';

export function Home({ isComplete }) {
  return (
    <div className="page">
      <header className="hero">
        <h1>Learn to code, interactively.</h1>
        <p className="lede">
          Short lessons, clear explanations, and quizzes you solve by writing real
          code that runs in your browser. Pick a track to begin.
        </p>
      </header>
      <div className="course-grid">
        {courses.map((c) => {
          const done = c.lessons.filter((l) => isComplete(c.id, l.id)).length;
          return (
            <button
              key={c.id}
              className="course-card"
              onClick={() => navigate(`/course/${c.id}`)}
            >
              <div className="course-card-top">
                <h2>{c.name}</h2>
                {c.runnable ? (
                  <span className="badge badge-live">Live code</span>
                ) : (
                  <span className="badge">Guided</span>
                )}
              </div>
              <p>{c.tagline}</p>
              <div className="course-card-foot">
                {c.lessons.length} lessons · {done} done
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CourseView({ courseId, isComplete }) {
  const course = getCourse(courseId);
  if (!course) return <NotFound />;
  return (
    <div className="page">
      <nav className="crumbs">
        <a href="#/">Home</a> <span>/</span> <span>{course.name}</span>
      </nav>
      <h1>{course.name}</h1>
      <p className="lede">{course.tagline}</p>
      {course.schemaNote && <p className="schema-note">{course.schemaNote}</p>}
      <ol className="lesson-list">
        {course.lessons.map((l, i) => (
          <li key={l.id}>
            <button
              className="lesson-row"
              onClick={() => navigate(`/course/${course.id}/${l.id}`)}
            >
              <span className={`dot ${isComplete(course.id, l.id) ? 'dot-done' : ''}`} />
              <span className="lesson-row-num">{i + 1}</span>
              <span className="lesson-row-title">{l.title}</span>
              {isComplete(course.id, l.id) && <span className="done-tag">✓ done</span>}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function LessonView({ courseId, lessonId, markComplete, isComplete }) {
  const course = getCourse(courseId);
  const lesson = getLesson(courseId, lessonId);
  if (!course || !lesson) return <NotFound />;

  const idx = course.lessons.findIndex((l) => l.id === lessonId);
  const prev = course.lessons[idx - 1];
  const next = course.lessons[idx + 1];
  const done = isComplete(courseId, lessonId);

  return (
    <div className="page lesson-page">
      <nav className="crumbs">
        <a href="#/">Home</a> <span>/</span>{' '}
        <a href={`#/course/${course.id}`}>{course.name}</a> <span>/</span>{' '}
        <span>{lesson.title}</span>
      </nav>

      <h1>
        {lesson.title}
        {done && <span className="done-tag">✓ done</span>}
      </h1>

      <div className="lesson-layout">
        <article className="lesson-body">
          {lesson.body.map((sec, i) => (
            <section key={i} className="lesson-section">
              <h2>{sec.heading}</h2>
              <Markdownish text={sec.text} />
            </section>
          ))}
        </article>

        {course.runnable ? (
          <div className="lesson-side">
            <CodePlayground
              language={course.id === 'sql' ? 'sql' : 'python'}
              initialCode={lesson.starterCode}
              seed={course.seed}
            />
          </div>
        ) : (
          <div className="lesson-side">
            <div className="guided-note">
              This track uses guided, explained examples rather than a live editor.
              Read the examples above, then test yourself below.
            </div>
          </div>
        )}
      </div>

      {lesson.quiz && lesson.quiz.length > 0 && (
        <Quiz
          courseId={course.id}
          questions={lesson.quiz}
          seed={course.seed}
          onComplete={() => markComplete(course.id, lesson.id)}
        />
      )}

      <div className="lesson-nav">
        {prev ? (
          <button className="btn ghost" onClick={() => navigate(`/course/${course.id}/${prev.id}`)}>
            ← {prev.title}
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button className="btn" onClick={() => navigate(`/course/${course.id}/${next.id}`)}>
            {next.title} →
          </button>
        ) : (
          <button className="btn" onClick={() => navigate(`/course/${course.id}`)}>
            Back to {course.name} ✓
          </button>
        )}
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="page">
      <h1>Not found</h1>
      <p>
        That page doesn't exist. <a href="#/">Go home</a>.
      </p>
    </div>
  );
}
