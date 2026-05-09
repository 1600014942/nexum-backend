/**
 * API Configuration and Client
 * 
 * All API requests are routed to the Render backend:
 * https://nexum-backend-fnlz.onrender.com
 */

const API_BASE = "https://nexum-backend-fnlz.onrender.com";

export const API_ENDPOINTS = {
  // Health check
  health: `${API_BASE}/api/health`,

  // Pages
  pages: {
    home: `${API_BASE}/api/pages/home`,
    product: `${API_BASE}/api/pages/product`,
    indices: `${API_BASE}/api/pages/indices`,
    markets: `${API_BASE}/api/pages/markets`,
    methodology: `${API_BASE}/api/pages/methodology`,
    docs: `${API_BASE}/api/pages/docs`,
    contact: `${API_BASE}/api/pages/contact`,
  },

  // Products
  products: {
    featured: `${API_BASE}/api/products/featured`,
    bySlug: (slug: string) => `${API_BASE}/api/products/${slug}`,
  },

  // Indices
  indices: `${API_BASE}/api/indices`,
  indexBySymbol: (symbol: string) => `${API_BASE}/api/indices/${symbol}`,

  // Markets
  markets: `${API_BASE}/api/markets`,
  marketObjects: `${API_BASE}/api/markets/objects`,

  // Methodology
  methodology: {
    latest: `${API_BASE}/api/methodology/latest`,
  },

  // Documentation
  docs: `${API_BASE}/api/docs`,
  docBySlug: (slug: string) => `${API_BASE}/api/docs/${slug}`,

  // Forms
  rfq: `${API_BASE}/api/rfq`,
  accessRequests: `${API_BASE}/api/access-requests`,
  contact: `${API_BASE}/api/contact`,
};

/**
 * Generic fetch wrapper with error handling
 */
export async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Type definitions for API responses
 */
export interface Index {
  id: string;
  symbol: string;
  name: string;
  family: string;
  description: string;
  methodology_version: string;
  unit: string;
  latest?: {
    id: string;
    index_id: string;
    timestamp: string;
    value_usd: number;
    open: number;
    high: number;
    low: number;
    close: number;
    sample_count: number;
    confidence_score: number;
    created_at: string;
  };
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  summary: string;
  model_name: string;
  context_window: string;
  service_class: string;
  delivery_window: string;
  included_input_tokens: number;
  included_output_tokens: number;
  settlement_currency: string;
  indicative_reference_price_usd: number;
  specs_json: Record<string, string>;
  exclusions_json: string[];
  use_cases_json: Array<{ title: string; description: string }>;
  ordering_steps_json: Array<{ number: string; title: string; description: string }>;
  faq_json: Array<{ question: string; answer: string }>;
}

export interface PageContent {
  title: string;
  subtitle: string;
  hero_kicker?: string;
  body_json?: Record<string, any>;
}

export interface RFQPayload {
  request_type: string;
  product_slug: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_channel: string;
  model_name: string;
  package_quantity: number;
  input_tokens_per_month: number;
  output_tokens_per_month: number;
  region: string;
  budget_usd: number;
  use_case: string;
  notes: string;
}

export interface AccessRequestPayload {
  name: string;
  company_name: string;
  email: string;
  role: string;
  interest: string;
  requested_product_slug: string;
  message: string;
}

export interface ContactPayload {
  email: string;
  topic: string;
  message: string;
}
