import { useMemo, useState } from 'react';
import { Markdownish } from './Markdownish.jsx';
import { checkPython } from '../engines/python.js';
import { checkSql } from '../engines/sql.js';

// Renders a lesson's quiz. Calls onComplete() once every question is answered
// correctly, so the parent can mark the lesson done.
export function Quiz({ courseId, questions, seed, onComplete }) {
  const [solved, setSolved] = useState(() => questions.map(() => false));

  const allSolved = solved.every(Boolean);
  const solvedCount = solved.filter(Boolean).length;

  function markSolved(i) {
    setSolved((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      const done = next.every(Boolean);
      if (done) onComplete?.();
      return next;
    });
  }

  return (
    <section className="quiz">
      <div className="quiz-head">
        <h3>Check your understanding</h3>
        <span className="quiz-progress">
          {solvedCount} / {questions.length} solved
        </span>
      </div>
      {questions.map((q, i) => (
        <Question
          key={i}
          index={i}
          q={q}
          courseId={courseId}
          seed={seed}
          onSolved={() => markSolved(i)}
        />
      ))}
      {allSolved && (
        <div className="quiz-done">✓ All questions correct. Lesson complete!</div>
      )}
    </section>
  );
}

function Question({ index, q, courseId, seed, onSolved }) {
  if (q.type === 'mc' || q.type === 'predict') {
    return <ChoiceQuestion index={index} q={q} onSolved={onSolved} />;
  }
  if (q.type === 'code') {
    return (
      <CodeQuestion index={index} q={q} courseId={courseId} seed={seed} onSolved={onSolved} />
    );
  }
  return null;
}

function ChoiceQuestion({ index, q, onSolved }) {
  const [picked, setPicked] = useState(null);
  const correct = picked === q.answer;

  function choose(i) {
    setPicked(i);
    if (i === q.answer) onSolved();
  }

  return (
    <div className="question">
      <p className="q-prompt">
        <strong>Q{index + 1}.</strong> <Markdownish text={q.prompt} />
      </p>
      {q.code && (
        <pre className="code-block">
          <code>{q.code}</code>
        </pre>
      )}
      <ul className="options">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const cls = isPicked ? (i === q.answer ? 'opt correct' : 'opt wrong') : 'opt';
          return (
            <li key={i}>
              <button className={cls} onClick={() => choose(i)} disabled={correct}>
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {picked !== null && (
        <div className={`feedback ${correct ? 'ok' : 'no'}`}>
          {correct ? '✓ Correct. ' : '✗ Not quite. '}
          <Markdownish text={q.explanation} />
        </div>
      )}
    </div>
  );
}

function CodeQuestion({ index, q, courseId, seed, onSolved }) {
  const [code, setCode] = useState(q.starter || '');
  const [state, setState] = useState({ phase: 'idle' }); // idle | running | pass | fail
  const language = useMemo(() => (courseId === 'sql' ? 'sql' : 'python'), [courseId]);

  async function check() {
    setState({ phase: 'running', msg: 'Checking…' });
    try {
      if (language === 'python') {
        const r = await checkPython(code, q.test, (m) => setState({ phase: 'running', msg: m }));
        if (r.passed) {
          setState({ phase: 'pass', output: r.output });
          onSolved();
        } else {
          setState({ phase: 'fail', output: r.output, error: r.error });
        }
      } else {
        const r = await checkSql(code, seed, q.expect, (m) =>
          setState({ phase: 'running', msg: m })
        );
        if (r.passed) {
          setState({ phase: 'pass' });
          onSolved();
        } else {
          setState({
            phase: 'fail',
            error: r.error || 'The result did not match what was expected.',
          });
        }
      }
    } catch (e) {
      setState({ phase: 'fail', error: String(e.message || e) });
    }
  }

  const passed = state.phase === 'pass';

  return (
    <div className="question">
      <p className="q-prompt">
        <strong>Q{index + 1}.</strong> <Markdownish text={q.prompt} /> <em>(write code)</em>
      </p>
      <textarea
        className="editor"
        spellCheck={false}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={Math.max(4, code.split('\n').length + 1)}
        disabled={passed}
      />
      <div className="q-actions">
        <button className="btn" onClick={check} disabled={state.phase === 'running' || passed}>
          {passed ? '✓ Solved' : state.phase === 'running' ? 'Checking…' : 'Check answer'}
        </button>
      </div>
      {state.msg && state.phase === 'running' && <div className="status">{state.msg}</div>}
      {state.phase === 'pass' && (
        <div className="feedback ok">
          ✓ Correct! <Markdownish text={q.explanation} />
          {state.output ? <pre className="output">{state.output}</pre> : null}
        </div>
      )}
      {state.phase === 'fail' && (
        <div className="feedback no">
          ✗ Not passing yet.
          {state.error ? <pre className="output output-error">{state.error}</pre> : null}
          {state.output ? <pre className="output">{state.output}</pre> : null}
          <div className="hint">Hint: {q.explanation}</div>
        </div>
      )}
    </div>
  );
}
