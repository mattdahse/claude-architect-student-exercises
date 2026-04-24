# Claude Certified Architect — Course Exercises

Starter code, reference solutions, and validation scripts for the Claude Certified Architect Foundations preparation course.

## One-Time Setup

You do this **once** for the whole course. Every exercise reads your API key from a single `.env` at the repo root.

```bash
git clone https://github.com/mattdahse/claude-architect-student-exercises.git
cd claude-architect-student-exercises

npm install                 # installs @anthropic-ai/sdk + dotenv at the repo root
cp .env.example .env        # creates .env (gitignored)
# then edit .env and paste your Anthropic API key after ANTHROPIC_API_KEY=
```

That's it. You do not need to run `npm install` or create a `.env` inside individual exercises — they all load the root `.env` via `shared/load-env.js`.

## Exercise Index

| Exercise | Lesson | Title | Format |
|----------|--------|-------|--------|
| 0.2 | Module 0, Lesson 2 | Verify Your Setup | Practical exercise |
| 1.2 | Module 1, Lesson 2 | Implementing Your First Agentic Loop | Practical exercise |
| 1.7 | Module 1, Lesson 7 | Parallel vs Sequential Subagent Execution | Practical exercise |
| 2.2 | Module 2, Lesson 2 | Writing Effective Tool Interfaces | Practical exercise |
| 1.12 | Module 1, Lesson 12 | Implementing Workflow Enforcement | Practical exercise |
| 2.9 | Module 2, Lesson 9 | Implementing Structured Error Responses | Practical exercise |
| 4.3 | Module 4, Lesson 3 | Writing Few-Shot Examples | Practical exercise |
| 4.5 | Module 4, Lesson 5 | Schema Design Patterns | Practical exercise |
| 6.1 | Module 6, Project A | Multi-Tool Customer Support Agent | Capstone project |
| 6.2 | Module 6, Project B | Claude Code Team Configuration | Capstone project |
| 6.3 | Module 6, Project C | Structured Data Extraction Pipeline | Capstone project |

*More exercises are added as new modules are released.*

## Directory Structure

```
claude-architect-student-exercises/
├── .env                    # your API key (you create this, gitignored)
├── .env.example            # template
├── package.json            # shared deps (@anthropic-ai/sdk, dotenv)
├── shared/
│   └── load-env.js         # loads .env for every exercise
├── exercises/
│   └── X.Y-exercise-name/
│       ├── starter/        # files you edit
│       ├── solution/       # reference implementation
│       └── validation/     # test script
└── 6.1-support-agent/      # capstone projects (same layout)
    ...
```

Starter files load the shared env with a single line:

```js
require('../../../shared/load-env');  // from exercises/X.Y-name/starter/
require('../../shared/load-env');     // from capstone project starters
```

## How to Work on an Exercise

1. Navigate to the exercise's `starter/` directory:
   ```bash
   cd exercises/1.2-first-agentic-loop/starter/
   ```

2. Follow the step-by-step instructions in the course lesson.

3. When you're done, run the validation script:
   ```bash
   node ../validation/validate.js
   ```

4. Compare your implementation with the reference solution in `solution/` if needed.

## API Key

Your Anthropic API key lives in a single `.env` at the repo root. The `.gitignore` excludes `.env` so your key is never committed. If you don't have an API key yet, follow the setup instructions in Module 0, Lesson 2 of the course.

Do **not** also set `ANTHROPIC_API_KEY` as a shell environment variable — it conflicts with Claude Code's own authentication. The root `.env` is the right home for it.

## Requirements

- Node.js v18 or higher
- An Anthropic API key with credits ([console.anthropic.com](https://console.anthropic.com))
