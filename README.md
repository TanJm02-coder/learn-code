# LearnCode — Interactive Python, SQL & R

An interactive learning site with lessons, explanations, quizzes, and a **live
code playground** that runs real code in your browser. No backend required.

## What's included

| Track  | Lessons | Live code | Quiz types |
|--------|---------|-----------|------------|
| Python | 4 | ✅ Pyodide (real Python in the browser) | multiple choice, predict-the-output, run-and-check code |
| SQL    | 3 | ✅ sql.js (SQLite in WebAssembly) | multiple choice, run-and-check query |
| R      | 2 | Guided (explained examples) | multiple choice, predict-the-output |

- **Live execution.** Python runs via [Pyodide]; SQL runs against an in-browser
  SQLite database seeded with sample `employees` and `sales` tables. Both load
  lazily from a CDN the first time you run code.
- **Code exercises are auto-checked.** Python answers run against a hidden
  assertion; SQL answers are compared to an expected result set.
- **Progress tracking.** Completed lessons are saved to `localStorage` and shown
  as a progress bar. R uses explained examples because in-browser R (WebR) is
  heavy and unreliable.

## Run it

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
```

Then open the printed local URL. The first Python or SQL run downloads the
runtime (one time per session), so give it a few seconds.

## Project structure

```
src/
  content/        Course data — add a language by creating a file and listing it in index.js
    python.js
    sql.js
    r.js
    index.js
  engines/        Lazy loaders + runners for the live code engines
    python.js     Pyodide
    sql.js        sql.js (SQLite WASM)
  lib/
    router.js     Minimal hash router
    progress.js   localStorage-backed progress hook
  components/
    Sidebar.jsx
    pages.jsx     Home / Course / Lesson views
    CodePlayground.jsx
    Quiz.jsx
    Markdownish.jsx
  App.jsx
```

## Adding content

Lessons are plain data. To add a lesson, append an object to a course's
`lessons` array. Question types:

- `mc` — multiple choice: `{ type:'mc', prompt, options, answer, explanation }`
- `predict` — predict the output: add a `code` string to an `mc`-shaped question
- `code` — run-and-check:
  - Python: provide `test` (an assertion that must not raise)
  - SQL: provide `expect` (a 2D array of the expected result rows)

To add a whole new language, create `src/content/<lang>.js` and add it to the
array in `src/content/index.js`. Set `runnable: true` only if an engine exists.

[Pyodide]: https://pyodide.org/
