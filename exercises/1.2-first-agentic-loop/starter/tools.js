/**
 * tools.js — Mock tool definitions and implementations for the agentic loop exercise.
 *
 * This file is provided complete. You don't need to modify it.
 *
 * It exports two things:
 *   1. toolDefinitions — the array of tool schemas you pass to the Messages API
 *   2. executeTool(name, input) — a function that runs a tool and returns a result
 */

// Tool definitions for the Messages API.
// These tell Claude what tools are available, what they do, and what parameters they accept.
const toolDefinitions = [
  {
    name: 'get_weather',
    description:
      'Get the current weather for a given city. Returns temperature in Fahrenheit, weather condition, and the city name.',
    input_schema: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: 'The city to get weather for, e.g. "Chicago" or "Tokyo"',
        },
      },
      required: ['city'],
    },
  },
  {
    name: 'get_time',
    description:
      'Get the current time in a given timezone. Returns the current time as a formatted string and the timezone name.',
    input_schema: {
      type: 'object',
      properties: {
        timezone: {
          type: 'string',
          description:
            'The timezone to get the time for, e.g. "America/Chicago" or "Asia/Tokyo"',
        },
      },
      required: ['timezone'],
    },
  },
];

// Mock tool implementations.
// In a real application, these would call external APIs. Here they return hardcoded data
// so you can focus on the agentic loop mechanics without worrying about network calls.
const toolImplementations = {
  get_weather(input) {
    const weatherData = {
      Chicago: { temperature: 72, condition: 'sunny', city: 'Chicago' },
      Tokyo: { temperature: 65, condition: 'cloudy', city: 'Tokyo' },
      London: { temperature: 58, condition: 'rainy', city: 'London' },
      Sydney: { temperature: 82, condition: 'clear', city: 'Sydney' },
    };

    const city = input.city;
    const data = weatherData[city] || {
      temperature: 70,
      condition: 'partly cloudy',
      city: city,
    };

    return data;
  },

  get_time(input) {
    // Return a mock time based on the timezone
    const timeData = {
      'America/Chicago': { time: '2:30 PM', timezone: 'America/Chicago (CST)' },
      'Asia/Tokyo': { time: '4:30 AM', timezone: 'Asia/Tokyo (JST)' },
      'Europe/London': { time: '8:30 PM', timezone: 'Europe/London (GMT)' },
      'Australia/Sydney': { time: '7:30 AM', timezone: 'Australia/Sydney (AEST)' },
    };

    const tz = input.timezone;
    const data = timeData[tz] || {
      time: '12:00 PM',
      timezone: tz || 'UTC',
    };

    return data;
  },
};

/**
 * Execute a tool by name with the given input.
 * Returns the tool result as a JSON-serializable object.
 *
 * @param {string} name - The tool name (must match a key in toolImplementations)
 * @param {object} input - The input parameters from Claude's tool_use block
 * @returns {object} The tool result
 */
function executeTool(name, input) {
  const fn = toolImplementations[name];
  if (!fn) {
    return { error: `Unknown tool: ${name}` };
  }
  return fn(input);
}

module.exports = { toolDefinitions, executeTool };
