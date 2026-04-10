/**
 * test-prompts.js — Test prompts for tool selection accuracy testing.
 *
 * Each prompt has an `expectedTool` field indicating which tool SHOULD be selected.
 * The tester sends each prompt to Claude with the tool set and checks whether
 * Claude selects the expected tool.
 *
 * DO NOT MODIFY THIS FILE — it's the standard test set for comparison.
 */

const testPrompts = [
  // get_customer prompts (5)
  {
    prompt: 'What email address does this customer have on file?',
    expectedTool: 'get_customer',
    category: 'customer profile',
  },
  {
    prompt: "What's the customer's preferred language for communications?",
    expectedTool: 'get_customer',
    category: 'customer profile',
  },
  {
    prompt: "Can you look up this person's contact information?",
    expectedTool: 'get_customer',
    category: 'customer profile',
  },
  {
    prompt: 'Does this customer have email notifications turned on?',
    expectedTool: 'get_customer',
    category: 'customer profile',
  },
  {
    prompt: "What's the customer's phone number?",
    expectedTool: 'get_customer',
    category: 'customer profile',
  },

  // get_account prompts (5)
  {
    prompt: 'What subscription plan is this customer on?',
    expectedTool: 'get_account',
    category: 'billing/account',
  },
  {
    prompt: 'When does their billing cycle renew?',
    expectedTool: 'get_account',
    category: 'billing/account',
  },
  {
    prompt: 'What payment method do they have on file?',
    expectedTool: 'get_account',
    category: 'billing/account',
  },
  {
    prompt: 'Is this customer on the free tier or a paid plan?',
    expectedTool: 'get_account',
    category: 'billing/account',
  },
  {
    prompt: "What are the usage limits on this customer's current plan?",
    expectedTool: 'get_account',
    category: 'billing/account',
  },

  // get_orders prompts (5)
  {
    prompt: 'What did this customer order last week?',
    expectedTool: 'get_orders',
    category: 'orders',
  },
  {
    prompt: 'Has the customer received their most recent order?',
    expectedTool: 'get_orders',
    category: 'orders',
  },
  {
    prompt: 'Show me the last 5 orders for this customer.',
    expectedTool: 'get_orders',
    category: 'orders',
  },
  {
    prompt: 'Are there any pending orders that haven\'t shipped yet?',
    expectedTool: 'get_orders',
    category: 'orders',
  },
  {
    prompt: 'How much did the customer spend on their most recent purchase?',
    expectedTool: 'get_orders',
    category: 'orders',
  },

  // get_support_history prompts (5)
  {
    prompt: 'Has this customer contacted support before about this issue?',
    expectedTool: 'get_support_history',
    category: 'support',
  },
  {
    prompt: 'What was the resolution of their last support ticket?',
    expectedTool: 'get_support_history',
    category: 'support',
  },
  {
    prompt: 'How many support tickets has this customer filed this year?',
    expectedTool: 'get_support_history',
    category: 'support',
  },
  {
    prompt: 'Are there any open support cases for this customer?',
    expectedTool: 'get_support_history',
    category: 'support',
  },
  {
    prompt: 'Show me the history of complaints from this customer.',
    expectedTool: 'get_support_history',
    category: 'support',
  },
];

module.exports = { testPrompts };
