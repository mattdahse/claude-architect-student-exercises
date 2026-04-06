# Exercise 1.2: Implementing Your First Agentic Loop

## Setup

1. Navigate to this exercise's starter directory:

   ```bash
   cd claude-architect-student-exercises/exercises/1.2-first-agentic-loop/starter/
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your `.env` file with your API key:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and replace `sk-ant-your-key-here` with your actual API key.

4. Verify the starter runs:

   ```bash
   node agent.js
   ```

   You should see a TODO message. That's expected — follow the steps in the course lesson to complete the exercise.

## Files

- `agent.js` — The main file you'll edit. Contains TODO comments for each exercise step.
- `tools.js` — Mock tool definitions and implementations. Provided complete — don't modify this.
- `package.json` — Dependencies (Anthropic SDK and dotenv).
- `.env.example` — Template for your API key.
