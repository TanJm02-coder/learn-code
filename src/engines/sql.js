// Lazy sql.js loader + runner. sql.js is SQLite compiled to WebAssembly and runs
// entirely in the browser. We create a fresh database seeded from the course so
// every query runs against the same known data.

const SQLJS_VERSION = '1.12.0';
const CDN = `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist`;

let sqlModulePromise = null;

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

async function getSqlModule(onStatus) {
  if (sqlModulePromise) return sqlModulePromise;
  sqlModulePromise = (async () => {
    onStatus?.('Downloading SQLite engine (first run only)…');
    await loadScriptOnce(`${CDN}/sql-wasm.js`);
    // eslint-disable-next-line no-undef
    const SQL = await initSqlJs({ locateFile: (f) => `${CDN}/${f}` });
    onStatus?.('SQLite ready.');
    return SQL;
  })();
  return sqlModulePromise;
}

// Build a fresh seeded database. Caller must db.close() when done.
async function freshDb(seed, onStatus) {
  const SQL = await getSqlModule(onStatus);
  const db = new SQL.Database();
  if (seed) db.run(seed);
  return db;
}

// Runs a query and returns { ok, columns, rows } or { ok:false, error }.
export async function runSql(query, seed, onStatus) {
  let db;
  try {
    db = await freshDb(seed, onStatus);
    const res = db.exec(query); // array of { columns, values }
    if (res.length === 0) {
      return { ok: true, columns: [], rows: [], note: 'Query ran. No rows returned.' };
    }
    const last = res[res.length - 1];
    return { ok: true, columns: last.columns, rows: last.values };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  } finally {
    db?.close();
  }
}

// Compares a query's result rows to an expected 2D array (order-insensitive).
export async function checkSql(query, seed, expected, onStatus) {
  const result = await runSql(query, seed, onStatus);
  if (!result.ok) return { passed: false, error: result.error };
  const norm = (rows) =>
    rows
      .map((r) => JSON.stringify(r))
      .sort()
      .join('|');
  const passed = norm(result.rows) === norm(expected);
  return { passed, result };
}
