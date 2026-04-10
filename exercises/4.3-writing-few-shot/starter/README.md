# Exercise 4.3: Writing Few-Shot Examples

## Setup

```bash
cd claude-architect-student-exercises/exercises/4.3-writing-few-shot/starter/
npm install
cp .env.example .env
# Edit .env and add your API key
```

## Running

```bash
node tester.js baseline    # Test without examples (baseline)
node tester.js few-shot    # Test with your examples
```

## Files

- `classifier-few-shot.js` — YOUR file. Add few-shot examples here.
- `classifier-baseline.js` — Baseline classifier without examples. Don't modify.
- `test-messages.js` — 15 test messages. Don't modify.
- `tester.js` — Consistency tester. Don't modify.
