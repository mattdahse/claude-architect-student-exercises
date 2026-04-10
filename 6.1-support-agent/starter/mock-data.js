// Mock data for the customer support agent
// This simulates a backend database with customers, orders, and shipping records

const customers = [
  {
    customer_id: "C-001",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1-555-0101",
    tier: "Gold",
    address: {
      street: "123 Main St",
      city: "Portland",
      state: "OR",
      zip: "97201"
    },
    preferences: { communication: "email", language: "en" },
    payment_methods: [
      { type: "visa", last4: "4242", default: true }
    ],
    account_created: "2021-03-15"
  },
  {
    customer_id: "C-002",
    name: "John Davis",
    email: "john.d@example.com",
    phone: "+1-555-0102",
    tier: "Silver",
    address: {
      street: "456 Oak Ave",
      city: "Seattle",
      state: "WA",
      zip: "98101"
    },
    preferences: { communication: "phone", language: "en" },
    payment_methods: [
      { type: "mastercard", last4: "8888", default: true }
    ],
    account_created: "2022-08-20"
  },
  {
    customer_id: "C-003",
    name: "Maria Garcia",
    email: "maria.g@example.com",
    phone: "+1-555-0103",
    tier: "Platinum",
    address: {
      street: "789 Elm Dr",
      city: "San Francisco",
      state: "CA",
      zip: "94102"
    },
    preferences: { communication: "email", language: "es" },
    payment_methods: [
      { type: "amex", last4: "1234", default: true }
    ],
    account_created: "2019-01-10"
  },
  {
    customer_id: "C-004",
    name: "Bob Wilson",
    email: "bob.w@example.com",
    phone: "+1-555-0104",
    tier: "Bronze",
    address: {
      street: "321 Pine Ln",
      city: "Denver",
      state: "CO",
      zip: "80201"
    },
    preferences: { communication: "email", language: "en" },
    payment_methods: [],
    account_created: "2024-01-05"
  },
  {
    customer_id: "C-005",
    name: "Sarah Chen",
    email: "sarah.c@example.com",
    phone: "+1-555-0105",
    tier: "Gold",
    address: {
      street: "654 Maple Ct",
      city: "Austin",
      state: "TX",
      zip: "73301"
    },
    preferences: { communication: "sms", language: "en" },
    payment_methods: [
      { type: "visa", last4: "5678", default: true },
      { type: "paypal", email: "sarah.c@example.com", default: false }
    ],
    account_created: "2020-11-30"
  }
];

const orders = [
  {
    order_id: "ORD-001",
    customer_id: "C-001",
    date: "2024-02-01",
    status: "delivered",
    total: 85.00,
    items: [
      { sku: "WIDGET-A", name: "Premium Widget", qty: 1, price: 45.00 },
      { sku: "PART-C", name: "Replacement Part", qty: 2, price: 20.00 }
    ],
    payment_method: "visa-4242",
    shipping: { carrier: "FedEx", tracking: "FX123456789" }
  },
  {
    order_id: "ORD-002",
    customer_id: "C-001",
    date: "2024-02-10",
    status: "shipped",
    total: 150.00,
    items: [
      { sku: "GADGET-B", name: "Deluxe Gadget", qty: 1, price: 120.00 },
      { sku: "ACC-D", name: "Gadget Accessory", qty: 1, price: 30.00 }
    ],
    payment_method: "visa-4242",
    shipping: { carrier: "USPS", tracking: "US987654321" }
  },
  {
    order_id: "ORD-003",
    customer_id: "C-002",
    date: "2024-01-15",
    status: "delivered",
    total: 95.00,
    items: [
      { sku: "WIDGET-A", name: "Premium Widget", qty: 1, price: 45.00 },
      { sku: "WIDGET-A", name: "Premium Widget", qty: 1, price: 45.00 },
      { sku: "SHIP", name: "Express Shipping", qty: 1, price: 5.00 }
    ],
    payment_method: "mastercard-8888",
    shipping: { carrier: "UPS", tracking: "UP111222333" }
  },
  {
    order_id: "ORD-004",
    customer_id: "C-002",
    date: "2024-02-20",
    status: "processing",
    total: 210.00,
    items: [
      { sku: "GADGET-B", name: "Deluxe Gadget", qty: 1, price: 120.00 },
      { sku: "WIDGET-A", name: "Premium Widget", qty: 2, price: 45.00 }
    ],
    payment_method: "mastercard-8888",
    shipping: null
  },
  {
    order_id: "ORD-005",
    customer_id: "C-003",
    date: "2024-01-05",
    status: "cancelled",
    total: 320.00,
    items: [
      { sku: "PREMIUM-SET", name: "Premium Bundle", qty: 1, price: 320.00 }
    ],
    payment_method: "amex-1234",
    shipping: null
  },
  {
    order_id: "ORD-006",
    customer_id: "C-003",
    date: "2024-02-25",
    status: "delivered",
    total: 55.00,
    items: [
      { sku: "ACC-D", name: "Gadget Accessory", qty: 1, price: 30.00 },
      { sku: "ACC-E", name: "Widget Cover", qty: 1, price: 25.00 }
    ],
    payment_method: "amex-1234",
    shipping: { carrier: "FedEx", tracking: "FX999888777" }
  },
  {
    order_id: "ORD-007",
    customer_id: "C-005",
    date: "2024-02-18",
    status: "disputed",
    total: 95.00,
    items: [
      { sku: "WIDGET-A", name: "Premium Widget", qty: 1, price: 45.00 },
      { sku: "GADGET-MINI", name: "Mini Gadget", qty: 1, price: 50.00 }
    ],
    payment_method: "visa-5678",
    shipping: { carrier: "USPS", tracking: "US444555666" }
  },
  {
    order_id: "ORD-008",
    customer_id: "C-005",
    date: "2024-03-01",
    status: "shipped",
    total: 45.00,
    items: [
      { sku: "WIDGET-A", name: "Premium Widget", qty: 1, price: 45.00 }
    ],
    payment_method: "paypal-sarah.c@example.com",
    shipping: { carrier: "FedEx", tracking: "FX777666555" }
  }
];

const shippingRecords = [
  {
    tracking: "FX123456789",
    carrier: "FedEx",
    status: "delivered",
    shipped_date: "2024-02-02",
    delivered_date: "2024-02-05",
    destination: "Portland, OR"
  },
  {
    tracking: "US987654321",
    carrier: "USPS",
    status: "in_transit",
    shipped_date: "2024-02-11",
    delivered_date: null,
    estimated_delivery: "2024-02-15",
    last_location: "Seattle Distribution Center",
    destination: "Portland, OR"
  },
  {
    tracking: "UP111222333",
    carrier: "UPS",
    status: "delivered",
    shipped_date: "2024-01-16",
    delivered_date: "2024-01-19",
    destination: "Seattle, WA"
  }
];

// Refund policy (for escalation scenarios)
const refundPolicy = {
  eligible_window_days: 30,
  auto_approval_limit: 100.00,
  eligible_statuses: ["delivered", "disputed"],
  ineligible_statuses: ["cancelled", "processing"],
  notes: "Refunds above auto-approval limit require manager authorization."
};

module.exports = { customers, orders, shippingRecords, refundPolicy };
