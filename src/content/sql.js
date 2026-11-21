// SQL course content. Runs live against an in-browser SQLite database (sql.js).
// A seed schema is loaded before each run so examples are reproducible.

export const sqlSeed = `
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT,
  department TEXT,
  salary INTEGER
);
INSERT INTO employees (id, name, department, salary) VALUES
  (1, 'Ada',   'Engineering', 95000),
  (2, 'Grace', 'Engineering', 88000),
  (3, 'Linus', 'Sales',       72000),
  (4, 'Margaret', 'Sales',    81000),
  (5, 'Alan',  'Research',    99000);

CREATE TABLE sales (
  id INTEGER PRIMARY KEY,
  employee_id INTEGER,
  amount INTEGER
);
INSERT INTO sales (id, employee_id, amount) VALUES
  (1, 3, 1200),
  (2, 3, 800),
  (3, 4, 1500),
  (4, 4, 500);
`;

export const sql = {
  id: 'sql',
  name: 'SQL',
  tagline: 'The language for querying relational databases.',
  runnable: true, // live execution via sql.js (SQLite in WASM)
  seed: sqlSeed,
  schemaNote:
    'Two tables are available: employees(id, name, department, salary) and sales(id, employee_id, amount).',
  lessons: [
    {
      id: 'sql-select',
      title: 'SELECT basics',
      body: [
        {
          heading: 'Selecting columns',
          text: `\`SELECT\` reads data. \`SELECT name, salary FROM employees;\` returns just
those two columns. \`SELECT *\` returns every column.`,
        },
        {
          heading: 'Filtering with WHERE',
          text: `\`WHERE\` keeps only rows that match a condition:
\`SELECT * FROM employees WHERE department = 'Sales';\``,
        },
      ],
      starterCode: `SELECT name, salary\nFROM employees\nWHERE department = 'Engineering';`,
      quiz: [
        {
          type: 'mc',
          prompt: 'Which clause filters rows in a query?',
          options: ['FILTER', 'WHERE', 'HAVING only', 'IF'],
          answer: 1,
          explanation: '`WHERE` restricts which rows are returned.',
        },
        {
          type: 'code',
          prompt: "Select the `name` of every employee in the 'Research' department.",
          starter: `SELECT `,
          // For SQL "code" questions, `test` describes the expected result set:
          // an array of row arrays. The runner compares the query output to it.
          expect: [['Alan']],
          explanation: "`SELECT name FROM employees WHERE department = 'Research';`",
        },
      ],
    },
    {
      id: 'sql-aggregate',
      title: 'Aggregation & GROUP BY',
      body: [
        {
          heading: 'Aggregate functions',
          text: `\`COUNT\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\` summarize many rows into one value.
\`SELECT AVG(salary) FROM employees;\``,
        },
        {
          heading: 'GROUP BY',
          text: `\`GROUP BY\` computes an aggregate per group:
\`SELECT department, AVG(salary) FROM employees GROUP BY department;\``,
        },
      ],
      starterCode: `SELECT department, COUNT(*) AS headcount\nFROM employees\nGROUP BY department;`,
      quiz: [
        {
          type: 'mc',
          prompt: 'Which function counts rows?',
          options: ['SUM()', 'COUNT()', 'TOTAL()', 'ROWS()'],
          answer: 1,
          explanation: '`COUNT(*)` returns the number of rows.',
        },
        {
          type: 'code',
          prompt: 'Return the total `salary` of all employees as a single value.',
          starter: `SELECT `,
          expect: [[435000]],
          explanation: '`SELECT SUM(salary) FROM employees;`',
        },
      ],
    },
    {
      id: 'sql-joins',
      title: 'Joining tables',
      body: [
        {
          heading: 'INNER JOIN',
          text: `A join combines rows from two tables on a matching key:
\`FROM sales JOIN employees ON sales.employee_id = employees.id\`.`,
        },
      ],
      starterCode: `SELECT e.name, SUM(s.amount) AS total_sales\nFROM sales s\nJOIN employees e ON s.employee_id = e.id\nGROUP BY e.name;`,
      quiz: [
        {
          type: 'mc',
          prompt: 'What does ON specify in a JOIN?',
          options: [
            'The columns to display',
            'The matching condition between tables',
            'The sort order',
            'The row limit',
          ],
          answer: 1,
          explanation: '`ON` states how rows from the two tables are matched.',
        },
      ],
    },
  ],
};
