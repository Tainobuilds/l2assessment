/**
 * Urgency Scorer - Rule-based urgency calculation
 *
 * Urgency is decided by WHAT the customer is describing (an outage, money
 * taken incorrectly, a bug, a compliment), not by HOW they wrote it (length,
 * punctuation, politeness) or WHEN they sent it. A calm, polite "our server
 * is down" is still an emergency.
 *
 * Order of checks:
 *   1. High   - the customer can't use the product, lost money, or has a security problem
 *   2. Low    - the customer explicitly says it isn't urgent
 *   3. Medium - something is broken or they need account help, but they can still work
 *   4. Low    - praise, feature ideas, general questions
 *   5. Medium - nothing matched, so a human should look rather than bury it
 */

// Customer is blocked, losing money, or at risk. Always High.
const HIGH_SIGNALS = [
  /\b(down|outage|offline)\b/,
  /\bproduction\b/,
  /\b(connection|data) (lost|loss)\b|\blost (all )?(my |our )?(data|connection)\b/,
  /\b(can'?t|cannot|unable to) (access|log ?in|sign ?in|get in)\b/,
  /\b(nobody|no one) (on [a-z ]+ )?can (access|log ?in|sign ?in|get in)\b/,
  /\b(deleted|wiped|erased)\b.*\bdata\b|\bdata (is |was )?(gone|missing|deleted)\b/,
  /\blocked out\b/,
  /\b(hacked|breach|compromised|unauthori[sz]ed|security)\b/,
  /\b(charged twice|double charged|duplicate charge|overcharged)\b/,
  /\blosing (money|sales|customers|revenue)\b/,
  /\b(urgent|emergency|asap|critical)\b/,
  /\bcrash(ed|es|ing)?\b/,
]

// Something is wrong, but the customer isn't fully blocked.
const MEDIUM_SIGNALS = [
  /\b(bug|error|broken|glitch|wrong)\b/,
  /\b(not working|doesn'?t work|won'?t (load|work|open))\b/,
  /\b(fail(ed|s|ing)?|timing out|time ?out|keeps loading)\b/,
  /\bslow\b/,
  /\b(refund|cancel)\b/,
  /\b(issue|problem)\b/,
]

// Customer says it can wait. Beats Medium, never beats High.
const NOT_URGENT = /\b(not urgent|no rush|whenever you get a chance)\b/g

// Praise, ideas, and general questions.
const LOW_SIGNALS = [
  /\b(thank|thanks|appreciate|love|great job|feedback)\b/,
  /\b(feature|suggestion|idea|would love|would be (great|nice|useful)|could you add)\b/,
  /\b(business hours|pricing|upgrade|how do i|can i|what are|is there)\b/,
]

const matches = (text, patterns) => patterns.some((pattern) => pattern.test(text))

// Shouting ("THE EXPORT IS BROKEN") or repeated "!!" only matters when it's
// attached to a real problem; on its own it just means the customer is excited.
function isEmphatic(message) {
  const letters = message.replace(/[^a-zA-Z]/g, '')
  const isAllCaps = letters.length > 10 && letters === letters.toUpperCase()
  return isAllCaps || /!{2,}/.test(message)
}

export function calculateUrgency(message) {
  const lower = message.toLowerCase()
  const saysNotUrgent = lower.search(NOT_URGENT) !== -1
  // Remove phrases that contain alarm words but mean the opposite, so
  // "not urgent" doesn't trip "urgent" and "no problem" doesn't trip "problem"
  const text = lower.replace(NOT_URGENT, '').replace(/\bno problem\b/g, '')

  if (matches(text, HIGH_SIGNALS)) return 'High'
  if (saysNotUrgent) return 'Low'
  if (matches(text, MEDIUM_SIGNALS)) return isEmphatic(message) ? 'High' : 'Medium'
  if (matches(text, LOW_SIGNALS)) return 'Low'
  return 'Medium'
}
