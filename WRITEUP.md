# Customer Inbox Triage: Improvements Write-Up

**Yadan Taino · Week 8 Assessment (Technical)**

## Summary

Relay AI sells one promise: small teams can handle more customer volume without hiring more support staff. Triage only saves time if it puts the right message at the top of the queue and tells the agent the right thing to do with it.

When I tested the app, it did neither reliably. A production outage was marked **Low** urgency, a thank-you note outranked it, and the AI's answers were parsed so loosely that the category was often wrong or "Unknown."

I found three core problems and fixed all three, plus two hidden bugs found while testing.

| | Before | After |
|---|---|---|
| Urgency tests passing | 5 / 22 | **24 / 24** |
| AI category correct (12 messages × 3 runs, same model) | 7 / 12 | **12 / 12** |
| Same AI answer on every run | 11 / 12 | **12 / 12** |
| "Our production server is down" | Low · "restart your browser" | **High · ⚠ Escalate now · on-call engineering** |
| App with no API key | Blank page (crash) | Works, clearly labeled as a keyword estimate |

---

## How I tested

1. Forked, cloned and ran the app locally with a free Groq API key.
2. Ran the 8 messages in `sample-messages.json` plus new ones of my own (outages, double charges, lockouts, feature ideas, "not urgent" notes) through the app.
3. Wrote automated tests that describe the *correct* behavior and ran them against the original code first, so each fix has proof of a before and an after.
4. Built a live check (`npm run eval`) that sends 12 messages to the real AI 3 times each, to measure accuracy and consistency.

---

## Top 3 areas for improvement

### 1. Urgency scoring ranked messages backwards

**The problem:** Urgency was judged by *how a message was written*, not *what it said*:
- Short messages lost points, so "Server down now" scored Low.
- Question marks and polite words ("please," "thanks") lowered urgency. "I was charged twice, can you please help?" scored Low.
- Exclamation marks raised urgency, so "Thanks! Love the product!!!" outranked an outage.
- ALL CAPS *lowered* urgency.
- The time of day and day of week changed the score. The same message got a different answer at night or on a weekend.

**Why it matters for Relay AI:** Emergencies sank to the bottom of the queue. A customer's checkout could stay broken while agents answered compliments. For a product sold on efficiency, that failure costs customers and renewals.

### 2. The AI categorization was unreliable and failed silently

**The problem:**
- The prompt was just "Categorize this customer support message," with **no list of allowed categories**, so the AI made up its own (e.g. "Payment Issue / Account Access").
- **Temperature was 0.7** (fairly random), so the same message could get different answers.
- The app then **searched the AI's free-text reply for keywords**. A reply saying "this is *not* a billing issue" would be filed as Billing.
- When the AI failed, the app **silently** showed canned keyword guesses as if they were AI answers.
- With no API key, the Groq client **crashed on page load and blanked the whole app**, even though the setup guide promised an automatic fallback.

**Why it matters:** The category decides which team gets the message. Wrong or random categories send work to the wrong people. Silent fallbacks mean agents trust answers the AI never gave.

### 3. Recommended actions were wrong and ignored urgency

**The problem:**
- Feature requests were told to "Ask user to check billing portal" (a copy-paste bug).
- *Every* technical problem, including a full outage, got "Suggest user to restart their browser."
- Urgency was passed to the function but never used, so a double charge and a pricing question got identical advice.
- Escalation only checked whether the message was **over 100 characters**, so long thank-you notes were escalated and "Server down" wasn't.

**Why it matters:** The recommendation is what the agent actually does next. Wrong advice means agents have to re-read and re-think every message, which cancels out the time the tool was supposed to save.

---

## What I implemented

I implemented all three. I started with urgency because it had the biggest business impact (emergencies being buried) and could be tested without the AI.

### Fix 1: Urgency based on what the customer is describing
`src/utils/urgencyScorer.js`

The scorer now looks for real signals, in priority order:

| Level | Triggers |
|---|---|
| **High** | outages ("down," "offline," "connection lost"), can't log in / locked out, data loss, security ("hacked," "breach"), double charges, "losing money," "urgent" |
| **Medium** | bugs, errors, failed payments, slowness, refunds |
| **Low** | praise, feature ideas, general questions, "not urgent" / "no rush" |
| **Default: Medium** | unclear messages, so a person still sees them instead of them getting buried |

- Removed length, politeness, question-mark and time-of-day rules.
- ALL CAPS / "!!" only raises urgency when it's attached to a real problem.
- Handles phrases that contain alarm words but mean the opposite, like "not urgent" and "no problem."

**Tests:** `tests/urgencyScorer.test.js`, 23 messages (including all 8 samples) plus a check that time of day no longer changes the result. The original code passed 5 of the first 22 checks; the new code passes all 24.

### Fix 2: Reliable, structured AI categorization
`src/utils/llmHelper.js`, `src/pages/AnalyzePage.jsx`

- **System prompt** lists the 4 real categories with a one-line definition each, plus a tie-break rule: *if a message fits more than one, choose the team that has to act first to unblock the customer.*
- **JSON mode**: the AI must reply as `{"category": "...", "reasoning": "..."}`, and the app reads the `category` field directly instead of keyword-searching the text.
- **Temperature 0**: the same message gets the same answer.
- **Validation**: any category not on the list becomes "Unknown," which routes to manual review.
- **No more crash** without an API key; the app goes straight to the fallback.
- **Honest fallbacks**: results are tagged `ai` or `fallback`, and the page shows a yellow **"AI unavailable. This category is a keyword estimate"** warning when the AI wasn't used.

**Tests:** `tests/llmHelper.test.js` (6 unit tests, no network needed). Live check `npm run eval`: the old approach got 7/12 correct on the same model; the new one gets 12/12, identical on all 3 runs.

### Fix 3: Recommended actions by category *and* urgency
`src/utils/templates.js`, `src/pages/AnalyzePage.jsx`

- Every category has a concrete next step for each urgency level. For example, a Technical Problem:
  - **High:** *Escalate to on-call engineering now. Check the status page, confirm affected accounts, update the customer within 1 hour.*
  - **Medium:** *Ask for steps to reproduce, browser/device and a screenshot; log a bug ticket.*
  - **Low:** *Share the troubleshooting article and log it as a minor bug.*
- Feature requests go to the product feedback tracker.
- Escalation is now based on **High urgency**, not message length, and the page shows a red **⚠ Escalate now** badge.
- Unknown or unexpected categories fall back to "Review manually" instead of "No recommendation available."

**Tests:** `tests/templates.test.js`, 7 tests. 6 failed on the original code; all pass now.

### Bonus fix: the AI model had been retired
Groq has retired `llama-3.3-70b-versatile`. Every AI request was failing with "model not found," and the app was quietly showing canned answers instead. I switched to `openai/gpt-oss-120b`, the strongest general-purpose model on Groq's free tier, and updated the docs.

---

## How the three fixes work together

Each fix covers a gap in the others:
- The AI picks the **category** (which team).
- The rule-based scorer sets the **urgency** (how fast).
- The templates combine both into the **next step** and an escalation flag.

When the AI is unsure or unavailable, the message is labeled "Unknown" or "keyword estimate" and sent to a person, not buried.

Urgency is deliberately rule-based rather than AI-based. Rules are instant, free, predictable and easy to test, which suits a safety-critical signal. The AI handles the part rules are bad at: understanding what a message is *about*.

---

## Still open / what I'd do next

1. **Move the API key to a backend (security).** The Groq key is still sent to the browser (`dangerouslyAllowBrowser: true`), so anyone using the app could copy it. In production, the AI call should go through a small server endpoint that keeps the key secret.
2. **Let the AI help with urgency.** Keyword rules can't anticipate every phrasing. While testing, "Nobody on our team can log in" slipped through until I added a pattern for it. A good next step is having the AI also return an urgency suggestion, with the rules as a floor that can raise it but never lower it.
3. **Agent feedback loop.** Let agents correct a category or urgency with one click, and use those corrections to grow the test set.
4. **Pre-existing lint errors** in `HistoryPage.jsx`, `DashboardPage.jsx` and `HomePage.jsx` (React hooks rules). These were there before my changes and don't affect the fixes above.

---

## How to run and verify

```bash
npm install
cp .env.example .env.local   # then add your Groq key
npm run dev                  # app at http://localhost:5173
npm test                     # 37 automated tests, no API key needed
npm run eval                 # live AI check, 12 messages x 3 runs (uses your Groq key)
```

## Commits

1. Fix urgency scoring so real emergencies are ranked High
2. Make recommended actions match the category and urgency
3. Switch to a Groq model that still exists
4. Make AI categorization reliable and honest about fallbacks
