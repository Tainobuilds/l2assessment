/**
 * Recommendation Templates - Maps category + urgency to a recommended action
 *
 * The same category needs different handling depending on urgency: a
 * question about upgrading and a double charge are both "Billing Issue",
 * but only one needs a person on it right now. Each action is written as
 * a concrete next step for the support agent reading it.
 */

const actionTemplates = {
  "Billing Issue": {
    High: "Escalate to the billing lead now. Verify the charge in the payment system, refund any duplicate charge, and reply to the customer within 1 hour.",
    Medium: "Look up the account's recent payments and invoices, then reply with the specific fix (update card, retry payment, or refund) within 1 business day.",
    Low: "Answer the billing question directly (plans, pricing, upgrades) and link the matching billing help article.",
  },
  "Technical Problem": {
    High: "Escalate to on-call engineering now. Check the status page for an active incident, confirm which accounts are affected, and send the customer a status update within 1 hour.",
    Medium: "Ask for steps to reproduce, browser/device, and a screenshot, then log a bug ticket for engineering.",
    Low: "Share the matching troubleshooting article and log it as a minor bug.",
  },
  "Feature Request": {
    // Urgency doesn't change what happens to a feature idea
    default: "Thank the customer, log the request in the product feedback tracker, and let them know it's been shared with the product team.",
  },
  "General Inquiry": {
    High: "Reply within 1 hour, since the message sounds time-sensitive. If it turns out to be a problem report, re-route it to billing or engineering.",
    default: "Answer the question directly, and link the FAQ if it fully covers it.",
  },
  "Unknown": {
    High: "Review manually right away. The message looks urgent but couldn't be categorized automatically.",
    default: "Review manually. The message couldn't be categorized automatically.",
  },
}

/**
 * Get recommended action for a given category
 *
 * @param {string} category - The message category
 * @param {string} urgency - The urgency level ("High" | "Medium" | "Low")
 * @returns {string} - Recommended next step
 */
export function getRecommendedAction(category, urgency) {
  // A category the AI invented still gets a safe next step instead of nothing
  const templates = actionTemplates[category] || actionTemplates["Unknown"]
  return templates[urgency] || templates.default || actionTemplates["Unknown"].default
}

/**
 * Get all available categories
 *
 * @returns {string[]} - List of categories
 */
export function getAvailableCategories() {
  return Object.keys(actionTemplates)
}

/**
 * Determines if message should be escalated
 *
 * Escalation follows urgency: anything High needs a person on it now,
 * whatever the category or message length.
 *
 * @param {string} category - The message category
 * @param {string} urgency - The urgency level
 * @param {string} message - The original message
 * @returns {boolean} - Whether to escalate
 */
export function shouldEscalate(category, urgency) {
  return urgency === "High"
}
