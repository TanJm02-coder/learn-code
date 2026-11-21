import { useRoute } from './lib/router.js';
import { useProgress } from './lib/progress.js';
import { allLessonKeys } from './content/index.js';
import { Sidebar } from './components/Sidebar.jsx';
import { Home, CourseView, LessonView, NotFound } from './components/pages.jsx';
import './App.css';

export default function App() {
  const route = useRoute();
  const { state, markComplete, isComplete, reset } = useProgress();

  const totalLessons = allLessonKeys().length;
  const doneCount = Object.keys(state.completed).length;
  const pct = totalLessons ? Math.round((doneCount / totalLessons) * 100) : 0;

  return (
    <div className="app">
      <Sidebar route={route} isComplete={isComplete} />
      <main className="main">
        <div className="topbar">
          <div className="overall-progress" title={`${doneCount} of ${totalLessons} lessons`}>
            <div className="bar">
              <div className="bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="bar-label">{pct}% complete</span>
          </div>
          {doneCount > 0 && (
            <button
              className="btn ghost small"
              onClick={() => {
                if (confirm('Reset all progress?')) reset();
              }}
            >
              Reset progress
            </button>
          )}
        </div>

        {route.name === 'home' && <Home isComplete={isComplete} />}
        {route.name === 'course' && (
          <CourseView courseId={route.courseId} isComplete={isComplete} />
        )}
        {route.name === 'lesson' && (
          <LessonView
            courseId={route.courseId}
            lessonId={route.lessonId}
            markComplete={markComplete}
            isComplete={isComplete}
          />
        )}
        {!['home', 'course', 'lesson'].includes(route.name) && <NotFound />}
      </main>
    </div>
  );
}
