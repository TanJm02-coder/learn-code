import { useState } from 'react';
import { runPython } from '../engines/python.js';
import { runSql } from '../engines/sql.js';

// Live code editor + runner for runnable courses (Python, SQL).
// `language` is 'python' or 'sql'. `seed` is the SQL seed (ignored for Python).
export function CodePlayground({ language, initialCode, seed }) {
  const [code, setCode] = useState(initialCode || '');
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  async function handleRun() {
    setRunning(true);
    setResult(null);
    setStatus('Running…');
    try {
      if (language === 'python') {
        const r = await runPython(code, setStatus);
        setResult({ kind: 'python', ...r });
      } else if (language === 'sql') {
        const r = await runSql(code, seed, setStatus);
        setResult({ kind: 'sql', ...r });
      }
      setStatus('');
    } catch (e) {
      setResult({ kind: 'error', error: String(e.message || e) });
      setStatus('');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="playground">
      <div className="playground-head">
        <span className="pg-label">Live {language === 'sql' ? 'SQL' : 'Python'} editor</span>
        <button className="btn" onClick={handleRun} disabled={running}>
          {running ? 'Running…' : '▶ Run'}
        </button>
      </div>
      <textarea
        className="editor"
        spellCheck={false}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={Math.max(6, code.split('\n').length + 1)}
      />
      {status && <div className="status">{status}</div>}
      {result && <RunResult result={result} />}
    </div>
  );
}

function RunResult({ result }) {
  if (result.kind === 'error' || (result.ok === false && result.error && !result.columns)) {
    return (
      <pre className="output output-error">
        {result.error || 'Something went wrong.'}
      </pre>
    );
  }
  if (result.kind === 'python') {
    return (
      <pre className={`output ${result.ok ? '' : 'output-error'}`}>
        {result.output}
        {result.error ? `\n${result.error}` : ''}
        {!result.output && !result.error ? '(no output)' : ''}
      </pre>
    );
  }
  if (result.kind === 'sql') {
    if (!result.ok) return <pre className="output output-error">{result.error}</pre>;
    if (!result.rows || result.rows.length === 0) {
      return <pre className="output">{result.note || '(no rows)'}</pre>;
    }
    return (
      <div className="output">
        <table className="result-table">
          <thead>
            <tr>
              {result.columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{String(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}
