// Lazy Pyodide loader + runner. Pyodide is ~10MB, so we only load it the first
// time the user runs Python, and we reuse the single instance afterward.

const PYODIDE_VERSION = 'v0.26.4';
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

let pyodidePromise = null;

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export function loadPython(onStatus) {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    onStatus?.('Downloading Python runtime (first run only)…');
    await loadScriptOnce(`${INDEX_URL}pyodide.js`);
    // eslint-disable-next-line no-undef
    const pyodide = await loadPyodide({ indexURL: INDEX_URL });
    onStatus?.('Python ready.');
    return pyodide;
  })();
  return pyodidePromise;
}

// Runs user code and captures stdout/stderr. Returns { ok, output, error }.
export async function runPython(code, onStatus) {
  const pyodide = await loadPython(onStatus);
  // Redirect stdout/stderr into a buffer we can read back.
  await pyodide.runPythonAsync(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);
  try {
    await pyodide.runPythonAsync(code);
    const out = await pyodide.runPythonAsync('sys.stdout.getvalue()');
    const err = await pyodide.runPythonAsync('sys.stderr.getvalue()');
    return { ok: true, output: out, error: err };
  } catch (e) {
    const out = await pyodide.runPythonAsync('sys.stdout.getvalue()').catch(() => '');
    return { ok: false, output: out, error: String(e.message || e) };
  }
}

// Runs user code, then appends test code. If the test raises, the check fails.
export async function checkPython(userCode, testCode, onStatus) {
  const combined = `${userCode}\n\n${testCode}`;
  const result = await runPython(combined, onStatus);
  if (result.ok) return { passed: true, output: result.output };
  return { passed: false, output: result.output, error: result.error };
}
