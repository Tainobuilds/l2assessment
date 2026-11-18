# Week 8 Professional Assessment: 2-minute Loom script

**Audience:** the CEO of Relay AI (not technical)
**Length:** about 270 words, which is about 2 minutes at a calm pace
**Setup:** Loom with camera bubble on, and screen share of `relay-triage-loom.mp4` (or the live app). Look at the camera, not the script.

| Time | On screen | What you say |
|---|---|---|
| 0:00–0:15 | Title card | Hi, I'm Yadan Taino. I spent time improving Customer Inbox Triage, and I want to walk you through what I found, what I fixed, and what I'd do next. |
| 0:15–0:30 | "What it's for" card | The tool is meant to do one thing: read every incoming customer message, decide what it's about and how urgent it is, and tell your agent what to do next. That's how a small team handles more volume without hiring. |
| 0:30–0:55 | **Before** screenshot: server down = Low | When I tested it, it was getting that backwards. "Our production server is down" came back Low urgency, with the advice "restart your browser." A thank-you note ranked higher. The AI picked the right category only 7 out of 12 times, and when it failed, it showed guesses as if they were real answers. So agents couldn't trust it. |
| 0:55–1:20 | **After** screenshot: High + Escalate now | I fixed all three problems. Urgency now depends on what the customer is describing: outages, lockouts, and double charges go to the top. The AI chooses from our four real categories and now gets 12 out of 12 right, the same way every time. And every message gets a clear next step, with an "Escalate now" flag for emergencies. |
| 1:20–1:35 | "Why it matters" card | For customers, emergencies get handled first. For the business, agents act instead of re-reading, which is exactly the time savings we sell, and it protects renewals. |
| 1:35–1:50 | "Tradeoff" card | One tradeoff: urgency uses simple rules, which keeps it fast, free, and predictable, but rules can miss unusual wording. "Nobody on our team can log in" slipped through until I added it. |
| 1:50–2:00 | "Next" card | Next, I'd move the API key to a secure server, let the AI suggest urgency with the rules as a safety floor, and let agents correct mistakes with one click. Thanks. |

## Checklist before you record

- [ ] Practice it out loud once (the instructions ask for this).
- [ ] Loom sharing set to **"Anyone with link can view."**
- [ ] If you go over 2:00, cut the "Next" section down to just the API key point.
