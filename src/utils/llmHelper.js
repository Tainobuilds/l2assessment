import Groq from 'groq-sdk';

/**
 * LLM Helper for categorizing customer support messages
 * Using Groq API for AI-powered categorization
 */

// The only categories the rest of the app knows how to handle. The AI must
// pick one of these; anything else becomes "Unknown" (manual review).
export const CATEGORIES = ["Billing Issue", "Technical Problem", "Feature Request", "General Inquiry"];

const SYSTEM_PROMPT = `You triage customer support messages for a small-business SaaS product.

Pick exactly one category:
- "Billing Issue": charges, refunds, invoices, payment methods, failed payments, plans, pricing, upgrades, cancellations
- "Technical Problem": outages, errors, bugs, crashes, slowness, login or access problems, something not working
- "Feature Request": ideas, suggestions, or requests for new or changed functionality
- "General Inquiry": questions, feedback, compliments, or anything that fits none of the above

If a message fits more than one category, choose the team that has to act first to unblock the customer.

Reply with JSON only, in this exact shape:
{"category": "<one of the four categories above>", "reasoning": "<one or two sentences explaining why>"}`;

// Vite exposes the key in the browser; Node (tests, eval script) reads it from process.env
const apiKey = import.meta.env?.VITE_GROQ_API_KEY
  || globalThis.process?.env?.VITE_GROQ_API_KEY;

// Only create the client when a key exists. Creating it without one throws
// at page load, which blanked the whole app instead of using the fallback.
const groq = apiKey
  ? new Groq({
      apiKey,
      dangerouslyAllowBrowser: true // Required for browser-based calls (not recommended for production!)
    })
  : null;

/**
 * Turn the AI's raw reply into a category the app understands.
 * Never throws: anything unexpected becomes "Unknown" so a person reviews it.
 *
 * @param {string} content - The raw text the AI replied with
 * @returns {{category: string, reasoning: string}}
 */
export function parseCategorization(content) {
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return { category: "Unknown", reasoning: content || "The AI returned an empty reply." };
  }

  const answer = String(parsed.category ?? '').trim().toLowerCase();
  const category = CATEGORIES.find((c) => c.toLowerCase() === answer) ?? "Unknown";
  const reasoning = typeof parsed.reasoning === 'string' && parsed.reasoning.trim()
    ? parsed.reasoning.trim()
    : "No reasoning provided.";

  return { category, reasoning };
}

/**
 * Categorize a customer support message using Groq AI
 * 
 * @param {string} message - The customer support message
 * @returns {Promise<{category: string, reasoning: string, source: "ai" | "fallback"}>}
 *   source is "fallback" when the AI couldn't be reached and a keyword guess was used instead
 */
export async function categorizeMessage(message) {
  if (!groq) {
    console.warn('No Groq API key configured, using keyword fallback');
    return { ...getMockCategorization(message), source: "fallback" };
  }

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      // 0 = most predictable: the same message gets the same answer every time
      temperature: 0,
      // Forces the reply to be valid JSON, so it can be read reliably
      response_format: { type: "json_object" },
    });

    return { ...parseCategorization(response.choices[0].message.content), source: "ai" };
  } catch (error) {
    console.warn('Groq API failed, using keyword fallback:', error.message);
    return { ...getMockCategorization(message), source: "fallback" };
  }
}

/**
 * Mock categorization for when API is unavailable
 */
function getMockCategorization(message) {
  const lowerMessage = message.toLowerCase();
  
  // Array of possible reasoning variations for each category
  const reasoningVariations = {
    billing: [
      "Based on keywords related to payments and billing, this appears to be a billing-related inquiry. The customer may need assistance with account charges or payment issues.",
      "This message contains billing terminology. The customer is likely experiencing issues with payments, invoices, or account charges.",
      "The message references financial matters related to the customer's account. This suggests a billing or payment concern that requires attention.",
    ],
    technical: [
      "This message describes technical difficulties or system errors. The customer is reporting functionality issues that may require engineering review.",
      "Based on error-related keywords, this appears to be a technical support issue. The customer is experiencing problems with product functionality.",
      "The message indicates a technical problem or bug. This requires investigation from the technical support team.",
      "System-related issues are mentioned in this message. The customer needs technical assistance to resolve functionality problems.",
    ],
    feature: [
      "This message suggests improvements or new functionality. The customer is providing product feedback and feature suggestions.",
      "The customer is requesting enhancements to the product. This appears to be a feature request that should be reviewed by the product team.",
      "Based on the language used, this seems to be a suggestion for product improvements rather than a support issue.",
    ],
    inquiry: [
      "This appears to be a general question about the product or service. The customer is seeking information or clarification.",
      "The message contains questions that don't indicate a specific problem. This is likely a general inquiry requiring informational support.",
      "Based on the question format, this seems to be an information request rather than a technical or billing issue.",
    ],
    positive: [
      "This message contains positive sentiment and appreciation. While not a support request, it may warrant acknowledgment.",
      "The customer is expressing satisfaction or gratitude. This doesn't appear to require immediate support action.",
    ],
    ambiguous: [
      "The message content is unclear or doesn't match standard support categories. Manual review may be needed for proper categorization.",
      "This message doesn't contain clear indicators for automatic categorization. Human review recommended.",
    ]
  };
  
  // Helper to get random reasoning
  const getRandomReasoning = (category) => {
    const reasons = reasoningVariations[category];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };
  
  // Billing-related detection
  if (lowerMessage.includes('bill') || lowerMessage.includes('payment') || 
      lowerMessage.includes('charge') || lowerMessage.includes('invoice') ||
      lowerMessage.includes('credit card') || lowerMessage.includes('subscription') ||
      lowerMessage.includes('refund') || lowerMessage.includes('cancel') && lowerMessage.includes('account')) {
    return {
      category: "Billing Issue",
      reasoning: getRandomReasoning('billing')
    };
  }
  
  // Technical problem detection
  if (lowerMessage.includes('bug') || lowerMessage.includes('error') || 
      lowerMessage.includes('broken') || lowerMessage.includes('not working') ||
      lowerMessage.includes('crash') || lowerMessage.includes('down') || 
      lowerMessage.includes('server') || lowerMessage.includes('loading') ||
      lowerMessage.includes('slow') || lowerMessage.includes('issue') ||
      lowerMessage.includes('problem') && !lowerMessage.includes('no problem')) {
    return {
      category: "Technical Problem",
      reasoning: getRandomReasoning('technical')
    };
  }
  
  // Feature request detection
  if (lowerMessage.includes('feature') || lowerMessage.includes('add') && (lowerMessage.includes('please') || lowerMessage.includes('could')) ||
      lowerMessage.includes('improve') || lowerMessage.includes('would like to see') ||
      lowerMessage.includes('suggestion') || lowerMessage.includes('wish') ||
      lowerMessage.includes('could you') && lowerMessage.includes('add') ||
      lowerMessage.includes('enhancement') || lowerMessage.includes('would be great')) {
    return {
      category: "Feature Request",
      reasoning: getRandomReasoning('feature')
    };
  }
  
  // Positive feedback detection
  if ((lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('appreciate')) &&
      !lowerMessage.includes('but') && !lowerMessage.includes('however')) {
    return {
      category: "General Inquiry",
      reasoning: getRandomReasoning('positive')
    };
  }
  
  // Question/inquiry detection
  if (lowerMessage.includes('how') || lowerMessage.includes('what') || 
      lowerMessage.includes('when') || lowerMessage.includes('where') ||
      lowerMessage.includes('can i') || lowerMessage.includes('is there') ||
      lowerMessage.includes('?')) {
    return {
      category: "General Inquiry",
      reasoning: getRandomReasoning('inquiry')
    };
  }
  
  // Fallback for ambiguous messages
  return {
    category: "General Inquiry",
    reasoning: getRandomReasoning('ambiguous')
  };
}
