// Groq AI Service for Intelligent Recommendations

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const isGroqConfigured = Boolean(GROQ_API_KEY);

interface CustomerData {
  name: string;
  totalSpent: number;
  lastPurchase: string;
  category: string;
  purchaseHistory: Array<{
    product: string;
    amount: number;
    date: string;
  }>;
  interactions: Array<{
    type: string;
    note: string;
    date: string;
  }>;
}

interface AIRecommendation {
  products: Array<{
    name: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  insights: string[];
  followUpActions: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Analyze customer data and generate AI-powered recommendations using Groq
 */
export async function generateAIRecommendations(
  customerData: CustomerData,
  availableProducts: Array<{ name: string; category: string; price: number }>
): Promise<AIRecommendation | null> {
  if (!isGroqConfigured) {
    console.warn('Groq API key not configured');
    return null;
  }

  try {
    const prompt = `You are an intelligent CRM assistant for a Nigerian SME. Analyze this customer data and provide actionable recommendations.

Customer Profile:
- Name: ${customerData.name}
- Category: ${customerData.category}
- Total Spent: ₦${customerData.totalSpent.toLocaleString()}
- Last Purchase: ${customerData.lastPurchase}

Recent Purchases:
${customerData.purchaseHistory.map(p => `- ${p.product} (₦${p.amount}, ${p.date})`).join('\n')}

Recent Interactions:
${customerData.interactions.map(i => `- ${i.type}: ${i.note} (${i.date})`).join('\n')}

Available Products:
${availableProducts.map(p => `- ${p.name} (${p.category}, ₦${p.price})`).join('\n')}

Based on this data, provide:
1. Top 3-5 product recommendations with specific reasons
2. Customer insights (spending patterns, preferences, loyalty indicators)
3. Follow-up actions the business should take
4. Risk assessment (is customer at risk of churning?)

Respond in JSON format:
{
  "products": [{"name": "product name", "reason": "why recommend", "priority": "high/medium/low"}],
  "insights": ["insight 1", "insight 2"],
  "followUpActions": ["action 1", "action 2"],
  "riskLevel": "low/medium/high"
}`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast and intelligent model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful CRM analytics assistant. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      return null;
    }

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);

    return aiResponse;
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return null;
  }
}

/**
 * Generate business insights using AI
 */
export async function generateBusinessInsights(
  totalCustomers: number,
  totalRevenue: number,
  topProducts: Array<{ name: string; revenue: number }>,
  atRiskCustomers: number
): Promise<string[]> {
  if (!isGroqConfigured) {
    return [
      'Configure Groq API key to enable AI-powered business insights',
      'AI analysis can help identify growth opportunities and risks'
    ];
  }

  try {
    const prompt = `Analyze this Nigerian SME business data and provide 3-5 actionable insights:

Business Metrics:
- Total Customers: ${totalCustomers}
- Total Revenue: ₦${totalRevenue.toLocaleString()}
- At-Risk Customers: ${atRiskCustomers}

Top Products:
${topProducts.map((p, i) => `${i + 1}. ${p.name} - ₦${p.revenue.toLocaleString()}`).join('\n')}

Provide specific, actionable insights about:
1. Revenue growth opportunities
2. Customer retention strategies
3. Product focus areas
4. Risk mitigation

Respond as a JSON array of insight strings.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a business analytics expert. Respond with JSON array of strings.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) return [];

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return result.insights || [];
  } catch (error) {
    console.error('Error generating business insights:', error);
    return [];
  }
}
