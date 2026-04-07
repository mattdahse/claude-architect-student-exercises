# Solution: Exercise 1.7 — Parallel vs Sequential Subagent Execution

## Design Decisions

**Promise.all() vs Promise.allSettled()**

This solution uses `Promise.all()` for the parallel step because both results (market data and trend data) are required to write the report. If either subagent fails, the entire operation should fail — there's no point writing a report with missing data.

`Promise.allSettled()` would be the right choice when partial results are acceptable — for example, if the report could include whatever data is available and note which sections couldn't be generated. This is covered in Stretch Goal 1.

**Why the report writer must be sequential**

The report writer takes both the market data and trend data as input parameters. It cannot start until both are available. This is a classic data dependency — the report writer's input is the output of the two parallel tasks. Attempting to parallelize it would either cause an error (missing input) or produce an incomplete report.

**Timing expectations**

With the mock delays:
- Sequential: ~5 seconds (2s + 2s + 1s)
- Parallel: ~3 seconds (max(2s, 2s) + 1s)
- Speedup: ~40%

With real API calls, the speedup would depend on API latency. Two concurrent API calls that each take 3 seconds would complete in ~3 seconds instead of ~6 seconds — the same pattern applies.

## Reasonable Alternatives

- You could implement a `runWithTimeout` wrapper that limits how long each subagent can run. This adds resilience but wasn't required for the exercise.
- You could implement retry logic for failed parallel tasks. Promise.allSettled() + retry for failed tasks is a production-ready pattern.
- You could collect timing data for each subagent individually and log a comparison table at the end.
