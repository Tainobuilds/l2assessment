import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getRecommendedAction, shouldEscalate, getAvailableCategories } from '../src/utils/templates.js'

const URGENCIES = ['High', 'Medium', 'Low']

test('every category has a real action at every urgency level', () => {
  for (const category of getAvailableCategories()) {
    for (const urgency of URGENCIES) {
      const action = getRecommendedAction(category, urgency)
      assert.ok(action && action !== 'No recommendation available.', `${category}/${urgency}`)
    }
  }
})

test('feature requests go to the product team, not the billing portal', () => {
  for (const urgency of URGENCIES) {
    const action = getRecommendedAction('Feature Request', urgency)
    assert.doesNotMatch(action, /billing/i)
    assert.match(action, /product/i)
  }
})

test('a High urgency technical problem is escalated to engineering, not "restart your browser"', () => {
  const action = getRecommendedAction('Technical Problem', 'High')
  assert.doesNotMatch(action, /restart/i)
  assert.match(action, /escalate/i)
  assert.match(action, /engineer/i)
})

test('urgency changes the recommended action', () => {
  assert.notEqual(
    getRecommendedAction('Technical Problem', 'High'),
    getRecommendedAction('Technical Problem', 'Low'),
  )
  assert.notEqual(
    getRecommendedAction('Billing Issue', 'High'),
    getRecommendedAction('Billing Issue', 'Low'),
  )
})

test('a High urgency billing issue is escalated', () => {
  assert.match(getRecommendedAction('Billing Issue', 'High'), /escalate/i)
})

test('unknown or unexpected categories fall back to manual review', () => {
  assert.match(getRecommendedAction('Unknown', 'Medium'), /review manually/i)
  assert.match(getRecommendedAction('Something the AI made up', 'Low'), /review manually/i)
})

test('escalation is based on urgency, not message length', () => {
  const longThankYou = 'Thank you so much! Your team has been incredibly helpful and I really appreciate the fast response to my question earlier today!'
  assert.equal(shouldEscalate('General Inquiry', 'Low', longThankYou), false)
  assert.equal(shouldEscalate('Technical Problem', 'High', 'Server down now'), true)
  assert.equal(shouldEscalate('Billing Issue', 'Medium', 'Can I get a refund for last month?'), false)
})
