# Week 8 Business Assessment: Relay AI, Customer Inbox Triage

**Yadan Taino**

## Problem statement

Relay AI promises small businesses they can handle more customer messages without hiring more support staff. But Customer Inbox Triage was putting the wrong messages at the top of the queue. When I tested it, "Our production server is down" was marked Low urgency and the suggested fix was "restart your browser." A thank-you note with exclamation marks ranked higher than the outage. The AI picked the right category only 7 out of 12 times. When the AI failed, the app quietly showed keyword guesses as if they were real AI answers. So agents couldn't trust the tool. They had to re-read every message themselves, which cancels out the time Relay AI is selling, and the customers with real emergencies waited the longest.

## Solution statement

I made the triage tool something an agent can trust and act on right away, in three ways:

1. **Urgency is based on what the customer is describing, not how they wrote it.** Outages, lockouts, data loss, and double charges are always High. Praise and feature ideas are Low. Anything unclear defaults to Medium, so a person still sees it.
2. **The AI picks from Relay AI's four real categories and gives the same answer every time.** When the AI isn't available, the app clearly labels the result as a keyword estimate instead of pretending.
3. **Every message gets a concrete next step that matches both its category and its urgency.** Emergencies get a red "Escalate now" flag.

## Why these improvements deliver the most value to Relay AI

- **It protects the promise Relay AI sells.** The product is supposed to save agents time. Now agents can act on the recommendation instead of re-reading and re-sorting every message, and that saved time is what customers are paying for.
- **Emergencies reach a person first.** An outage or a double charge is where a small business loses its own customers. Putting those at the top, with an escalation flag, keeps Relay AI's customers from losing money and makes them more likely to renew.
- **The results are accurate, consistent, and honest.** The AI went from 7/12 to 12/12 correct on the same model, with the same answer on every run. When the AI is down, the app says so. Agents stop acting on answers the AI never gave, so fewer messages go to the wrong team.
- **It's low cost and low risk to run.** Urgency uses simple rules: instant, free, and predictable. The AI only handles the part rules are bad at, which is understanding what a message is about. 37 automated tests check that it keeps working, and no new infrastructure was needed.
- **It fixed a breakdown nobody could see.** The AI model the app used had been retired, so every AI request was failing and the app was silently falling back to canned answers. Switching models made the product actually work again, and the new "keyword estimate" warning means a failure like that will be visible next time.
