import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateUrgency } from '../src/utils/urgencyScorer.js'

// Each case: [message, expected urgency]. Grouped by what a support lead
// would actually want at the top of the queue.
const cases = {
  High: [
    // Outages and lost access — customers can't use the product at all
    'Database connection lost',
    'Server down now',
    'Our production server is down',
    'URGENT: WE ARE LOSING MONEY, CHECKOUT IS BROKEN',
    "My payment failed and now I can't access the dashboard. Is there a bug or do I need to update my credit card?",
    "I'm locked out of my account and have a client demo in an hour, please help",
    'Nobody on our team can log in since this morning',
    'Your app deleted all our data after the update',
    // Money taken incorrectly and security — trust-breaking problems
    'I was charged twice this month, can you please help?',
    'I think our account was hacked, there are logins I do not recognize',
    // A real problem written with a lot of emphasis
    'THE EXPORT BUTTON IS BROKEN AGAIN',
  ],
  Medium: [
    'The dashboard won\'t load when I try to access it. I\'ve tried refreshing but it keeps timing out.',
    'I tried to update my payment method but the page keeps loading forever. Is this a known issue?',
    'I got an error when uploading a file',
    'Can I get a refund for last month?',
    // Unclear messages default to Medium so a human still looks at them
    'hi',
  ],
  Low: [
    'Thank you so much! Your team has been incredibly helpful and I really appreciate the fast response to my question earlier today!',
    'Hi! I was just browsing through your website and noticed you have a really nice design! I especially like the color scheme and the way you\'ve organized the navigation menu! Everything looks so professional and clean! Just wanted to share my positive feedback!',
    'Could you add an export to CSV feature? Would be really useful for my monthly reports.',
    'I would love to see a dark mode option in the app. It would be much easier on my eyes during night time usage.',
    'What are your business hours?',
    'Can I upgrade my subscription to the pro plan?',
    'Not urgent, but the tooltip on the settings page has a typo',
  ],
}

for (const [expected, messages] of Object.entries(cases)) {
  for (const message of messages) {
    test(`${expected}: ${message.slice(0, 60)}`, () => {
      assert.equal(calculateUrgency(message), expected)
    })
  }
}

test('same message gets the same urgency regardless of time of day', () => {
  const RealDate = Date
  const at = (iso) => {
    globalThis.Date = class extends RealDate {
      constructor(...args) { super(...(args.length ? args : [iso])) }
    }
    try { return calculateUrgency('Our production server is down') }
    finally { globalThis.Date = RealDate }
  }
  // Saturday 3am vs. Tuesday noon
  assert.equal(at('2026-09-26T03:00:00'), at('2026-09-29T12:00:00'))
})
