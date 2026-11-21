// Python course content.
// Each lesson has: id, title, body (markdown-ish sections), optional starterCode
// for the playground, and a quiz (array of questions).
//
// Question types:
//   - "mc"        multiple choice: { prompt, options[], answer (index), explanation }
//   - "predict"   predict the output: { prompt, code, options[], answer, explanation }
//   - "code"      run-and-check: { prompt, starter, test (python asserting `answer`),
//                                  explanation }

export const python = {
  id: 'python',
  name: 'Python',
  tagline: 'A readable, general-purpose language great for beginners.',
  runnable: true, // live execution via Pyodide
  lessons: [
    {
      id: 'py-intro',
      title: 'Variables & Printing',
      body: [
        {
          heading: 'What is a variable?',
          text: `A variable is a named box that stores a value. You create one with \`=\`.
Python figures out the type for you, so you don't declare it.`,
        },
        {
          heading: 'Printing',
          text: `\`print()\` writes values to the output. You can print text (strings),
numbers, or the contents of variables.`,
        },
        {
          heading: 'Try it',
          text: `Run the code on the right. Change the name and run again to see the output update.`,
        },
      ],
      starterCode: `name = "Ada"\nage = 36\nprint("Hello,", name)\nprint("Age:", age)`,
      quiz: [
        {
          type: 'mc',
          prompt: 'Which symbol assigns a value to a variable in Python?',
          options: ['==', '=', '=>', ':='],
          answer: 1,
          explanation: 'A single `=` assigns. `==` compares for equality.',
        },
        {
          type: 'predict',
          prompt: 'What does this print?',
          code: `x = 5\ny = 2\nprint(x + y)`,
          options: ['52', '7', 'x + y', 'Error'],
          answer: 1,
          explanation: 'Both are integers, so `+` adds them: 5 + 2 = 7.',
        },
        {
          type: 'code',
          prompt: 'Create a variable `total` equal to 10 + 15.',
          starter: `total = `,
          // Test code runs after the user code; it must not raise.
          test: `assert total == 25, f"Expected 25 but got {total}"`,
          explanation: '10 + 15 is 25. Assign it with `total = 10 + 15`.',
        },
      ],
    },
    {
      id: 'py-types',
      title: 'Numbers, Strings & f-strings',
      body: [
        {
          heading: 'Core types',
          text: `Python has \`int\` (whole numbers), \`float\` (decimals), \`str\` (text),
and \`bool\` (\`True\`/\`False\`). Use \`type(x)\` to check a type.`,
        },
        {
          heading: 'f-strings',
          text: `An f-string lets you embed values inside text: \`f"Total: {price}"\`.
Put an \`f\` before the quote and wrap variables in \`{}\`.`,
        },
      ],
      starterCode: `price = 4.5\nqty = 3\ntotal = price * qty\nprint(f"{qty} items cost \${total:.2f}")`,
      quiz: [
        {
          type: 'mc',
          prompt: 'What is the type of `3.14`?',
          options: ['int', 'float', 'str', 'bool'],
          answer: 1,
          explanation: 'Numbers with a decimal point are `float`.',
        },
        {
          type: 'predict',
          prompt: 'What does this print?',
          code: `name = "Sam"\nprint(f"Hi {name}!")`,
          options: ['Hi {name}!', 'Hi Sam!', 'f"Hi Sam!"', 'Error'],
          answer: 1,
          explanation: 'The f-string substitutes the value of `name` into `{name}`.',
        },
        {
          type: 'code',
          prompt: 'Build an f-string in `msg` that says "2 + 2 = 4" using variables a=2 and b=2.',
          starter: `a = 2\nb = 2\nmsg = `,
          test: `assert msg == "2 + 2 = 4", f"Got: {msg!r}"`,
          explanation: 'Use `msg = f"{a} + {b} = {a + b}"`.',
        },
      ],
    },
    {
      id: 'py-lists',
      title: 'Lists & Loops',
      body: [
        {
          heading: 'Lists',
          text: `A list holds an ordered collection: \`nums = [1, 2, 3]\`. Index from 0:
\`nums[0]\` is \`1\`. Add with \`.append(x)\`.`,
        },
        {
          heading: 'for loops',
          text: `A \`for\` loop visits each item: \`for n in nums:\`. The indented block
runs once per item.`,
        },
      ],
      starterCode: `nums = [2, 4, 6]\ntotal = 0\nfor n in nums:\n    total += n\nprint("Sum:", total)`,
      quiz: [
        {
          type: 'predict',
          prompt: 'What does this print?',
          code: `items = [10, 20, 30]\nprint(items[1])`,
          options: ['10', '20', '30', 'Error'],
          answer: 1,
          explanation: 'Indexing starts at 0, so `items[1]` is the second element, 20.',
        },
        {
          type: 'code',
          prompt: 'Set `result` to the sum of all numbers in `data` using a loop.',
          starter: `data = [5, 10, 15]\nresult = 0\n# add a loop below\n`,
          test: `assert result == 30, f"Expected 30 but got {result}"`,
          explanation: 'Loop and accumulate: `for n in data: result += n`.',
        },
      ],
    },
    {
      id: 'py-functions',
      title: 'Functions',
      body: [
        {
          heading: 'Defining functions',
          text: `Use \`def\` to package reusable logic: \`def add(a, b): return a + b\`.
Call it with \`add(2, 3)\`.`,
        },
        {
          heading: 'Return vs print',
          text: `\`return\` sends a value back to the caller. \`print\` only displays text —
it does not give a value you can reuse.`,
        },
      ],
      starterCode: `def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))`,
      quiz: [
        {
          type: 'mc',
          prompt: 'Which keyword sends a value back from a function?',
          options: ['print', 'return', 'yield-only', 'send'],
          answer: 1,
          explanation: '`return` passes a value back to the caller.',
        },
        {
          type: 'code',
          prompt: 'Write a function `square(n)` that returns n * n. (It is called for you.)',
          starter: `def square(n):\n    # your code here\n    pass\n`,
          test: `assert square(4) == 16 and square(0) == 0, "square is incorrect"`,
          explanation: 'Return the product: `return n * n`.',
        },
      ],
    },
  ],
};
