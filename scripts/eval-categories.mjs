// Live check of AI categorization against real messages.
// Sends each message to the AI several times to confirm the answer is
// correct AND the same every time. Uses your real Groq key.
//
//   npm run eval

import { categorizeMessage } from '../src/utils/llmHelper.js'

const RUNS = 3

// [message, expected category]
const cases = [
  // The 8 sample messages from sample-messages.json
  ['Database connection lost', 'Technical Problem'],
  ['Thank you so much! Your team has been incredibly helpful and I really appreciate the fast response to my question earlier today!', 'General Inquiry'],
  ['Could you add an export to CSV feature? Would be really useful for my monthly reports.', 'Feature Request'],
  ["My payment failed and now I can't access the dashboard. Is there a bug or do I need to update my credit card?", 'Billing Issue'],
  ['hi', 'General Inquiry'],
  ['Server down now', 'Technical Problem'],
  ["Hi! I was just browsing through your website and noticed you have a really nice design! Just wanted to share my positive feedback!", 'General Inquiry'],
  ['What are your business hours?', 'General Inquiry'],
  // New examples
  ['This is not a billing question, but the reports page crashes every time I open it', 'Technical Problem'],
  ['I was charged twice this month', 'Billing Issue'],
  ['Can I upgrade my subscription to the pro plan?', 'Billing Issue'],
  ['It would be great if the app had a dark mode', 'Feature Request'],
]

let correct = 0
let consistent = 0

for (const [message, expected] of cases) {
  const results = []
  for (let i = 0; i < RUNS; i++) results.push(await categorizeMessage(message))

  if (results.some((r) => r.source !== 'ai')) {
    console.error('The AI could not be reached, so this check is not valid. Is VITE_GROQ_API_KEY set in .env.local?')
    process.exit(1)
  }

  const answers = results.map((r) => r.category)
  const isConsistent = answers.every((a) => a === answers[0])
  const isCorrect = isConsistent && answers[0] === expected
  if (isConsistent) consistent++
  if (isCorrect) correct++

  const mark = isCorrect ? '✓' : '✗'
  const detail = isConsistent ? answers[0] : `inconsistent: ${answers.join(' / ')}`
  console.log(`${mark} ${detail.padEnd(18)} (expected ${expected})  "${message.slice(0, 55)}"`)
}

console.log(`\nCorrect: ${correct}/${cases.length}   Same answer every run: ${consistent}/${cases.length}`)
