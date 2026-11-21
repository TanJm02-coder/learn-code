// R course content.
// In-browser R (WebR) is heavy and unreliable, so R lessons are taught through
// rich explanations plus multiple-choice and predict-the-output quizzes rather
// than a live engine. The `runnable` flag is false, so the UI hides the live
// playground and shows read-only, explained examples instead.

export const r = {
  id: 'r',
  name: 'R',
  tagline: 'A language built for statistics and data analysis.',
  runnable: false, // no live engine; explained examples + quizzes
  lessons: [
    {
      id: 'r-vectors',
      title: 'Vectors & assignment',
      body: [
        {
          heading: 'Assignment',
          text: `R traditionally uses \`<-\` to assign: \`x <- 5\`. (\`=\` also works.)`,
        },
        {
          heading: 'Vectors',
          text: `The vector is R's core structure. Build one with \`c()\`:
\`nums <- c(2, 4, 6)\`. Operations apply to every element at once:
\`nums * 2\` gives \`4 8 12\`.`,
        },
        {
          heading: 'Example',
          text: `\`\`\`r
nums <- c(2, 4, 6)
print(sum(nums))   # 12
print(mean(nums))  # 4
\`\`\``,
        },
      ],
      quiz: [
        {
          type: 'mc',
          prompt: 'What is the idiomatic assignment operator in R?',
          options: ['=', '<-', ':=', '=='],
          answer: 1,
          explanation: 'R conventionally uses `<-`, though `=` is also accepted.',
        },
        {
          type: 'predict',
          prompt: 'What does `sum(c(1, 2, 3))` return?',
          code: `sum(c(1, 2, 3))`,
          options: ['123', '6', 'c(1,2,3)', 'Error'],
          answer: 1,
          explanation: '`c(1, 2, 3)` is a vector; `sum` adds its elements: 6.',
        },
      ],
    },
    {
      id: 'r-dataframes',
      title: 'Data frames',
      body: [
        {
          heading: 'What is a data frame?',
          text: `A data frame is a table: named columns, each a vector of equal length.
It is the workhorse for data analysis in R.`,
        },
        {
          heading: 'Example',
          text: `\`\`\`r
df <- data.frame(
  name = c("Ada", "Grace"),
  age  = c(36, 45)
)
print(df$age)        # 36 45
print(nrow(df))      # 2
\`\`\``,
        },
      ],
      quiz: [
        {
          type: 'mc',
          prompt: 'How do you access the `age` column of a data frame `df`?',
          options: ['df->age', 'df$age', 'df.age', 'df[age]'],
          answer: 1,
          explanation: 'The `$` operator selects a column by name: `df$age`.',
        },
        {
          type: 'predict',
          prompt: 'Given a data frame with 2 rows, what does `nrow(df)` return?',
          code: `df <- data.frame(name = c("Ada", "Grace"), age = c(36, 45))\nnrow(df)`,
          options: ['1', '2', '4', 'NULL'],
          answer: 1,
          explanation: '`nrow` counts rows; there are 2.',
        },
      ],
    },
  ],
};
