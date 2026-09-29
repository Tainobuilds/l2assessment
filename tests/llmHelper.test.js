import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseCategorization, CATEGORIES } from '../src/utils/llmHelper.js'

test('reads a well-formed JSON reply', () => {
  const reply = '{"category": "Billing Issue", "reasoning": "Customer was charged twice."}'
  assert.deepEqual(parseCategorization(reply), {
    category: 'Billing Issue',
    reasoning: 'Customer was charged twice.',
  })
})

test('trusts the category field, not words that appear in the reasoning', () => {
  // The old keyword search would have filed this as Billing
  const reply = '{"category": "Technical Problem", "reasoning": "This is not a billing issue; the dashboard is timing out."}'
  assert.equal(parseCategorization(reply).category, 'Technical Problem')
})

test('a category the AI made up becomes Unknown', () => {
  const reply = '{"category": "Payment Issue / Account Access", "reasoning": "Payment failed."}'
  assert.equal(parseCategorization(reply).category, 'Unknown')
})

test('small formatting differences in the category still match', () => {
  const reply = '{"category": " technical problem ", "reasoning": "Crash on login."}'
  assert.equal(parseCategorization(reply).category, 'Technical Problem')
})

test('a reply that is not JSON becomes Unknown instead of crashing', () => {
  const result = parseCategorization('I think this is probably a billing thing.')
  assert.equal(result.category, 'Unknown')
  assert.ok(result.reasoning.length > 0)
})

test('the AI is only offered real categories, never Unknown', () => {
  assert.deepEqual(CATEGORIES, ['Billing Issue', 'Technical Problem', 'Feature Request', 'General Inquiry'])
})
