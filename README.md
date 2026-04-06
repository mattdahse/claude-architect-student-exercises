# Claude Certified Architect — Course Exercises

Starter code, reference solutions, and validation scripts for the Claude Certified Architect Foundations preparation course.

## Setup

Clone this repository once. You'll use it throughout the course.

```bash
git clone https://github.com/YOUR-ORG/claude-architect-exercises.git
cd claude-architect-exercises
```

Each exercise lives in its own directory under `exercises/`. When a lesson tells you to start an exercise, navigate to that directory and follow the instructions.

## Exercise Index

| Exercise | Lesson | Title | Format |
|----------|--------|-------|--------|
| 1.2 | Module 1, Lesson 2 | Implementing Your First Agentic Loop | Practical exercise |

*More exercises are added as new modules are released.*

## Directory Structure

Each exercise directory contains:

```
exercises/X.Y-exercise-name/
├── starter/          # Starting files — copy to your working directory or edit in place
│   ├── README.md     # Setup instructions specific to this exercise
│   ├── package.json  # Dependencies
│   ├── .env.example  # API key template (copy to .env and add your key)
│   └── ...           # Exercise-specific starter files
├── solution/         # Reference implementation for self-checking
│   ├── README.md     # Design decisions and alternative approaches
│   └── ...           # Complete working code
└── validation/       # Test scripts to verify your implementation
    └── validate.js   # Automated checks
```

## How to Work on an Exercise

1. Navigate to the exercise's `starter/` directory:
   ```bash
   cd exercises/1.2-first-agentic-loop/starter/
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file with your API key:
   ```bash
   cp .env.example .env
   # Edit .env and add your Anthropic API key
   ```

4. Follow the step-by-step instructions in the course lesson.

5. When you're done, run the validation script:
   ```bash
   node ../validation/validate.js
   ```

6. Compare your implementation with the reference solution in `solution/` if needed.

## API Key

Each exercise that makes API calls needs your Anthropic API key. Store it in a `.env` file inside the exercise's `starter/` directory. The `.gitignore` is configured to exclude `.env` files so your key is never committed.

If you don't have an API key yet, follow the setup instructions in Module 0, Lesson 2 of the course.

## Requirements

- Node.js v18 or higher
- An Anthropic API key with credits ([console.anthropic.com](https://console.anthropic.com))
# claude-architect-student-exercises
