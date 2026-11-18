# Loom script: My improvements to Customer Inbox Triage

**Who you're talking to:** the CEO of Relay AI. Smart, busy, not technical.
**Length:** 2:00 (about 270 words, a calm pace). The times match `relay-triage-loom.mp4`, so each slide changes right when its line starts.
**How to use it:** read along while the video plays. Lines in *[brackets]* are optional spots for your own words. Say whatever feels natural.

**Tip:** look at the camera at the start of each section, not at the script. You know this project, so the script is just a safety net.

---

**0:00 · Title card**
"Hi, I'm Yadan Taino. I improved Customer Inbox Triage, and I'll show you what I found, what I fixed, and what I'd do next."

**0:09 · What it's for**
"The tool has one job: read every customer message, decide what it's about and how urgent it is, and tell the agent what to do next. That's how small teams handle more customers without hiring."

**0:22 · BEFORE screenshot**
"When I tested it, it got that backwards. 'Our production server is down' came back Low urgency, with the advice 'restart your browser.' A thank-you note ranked higher. The AI picked the right category only 7 out of 12 times, and when it failed, it showed guesses as if they were real. So agents had to re-read everything themselves."

**0:49 · AFTER screenshot**
"I fixed all three. Urgency now depends on what the customer describes, so outages, lockouts, and double charges go to the top. The AI chooses from our four real categories and gets 12 out of 12 right, every time. If the AI is down, the app says so. And every message gets a clear next step, like 'Escalate now' for this outage."

**1:17 · Why it matters**
"For customers, emergencies get handled first. For the business, agents act on the tool instead of re-sorting the queue. That time savings is what Relay AI sells, and it's what keeps customers renewing."
*[Optional, if you have time: "That's the promise we make to every customer."]*

**1:31 · One tradeoff**
"One tradeoff: I made urgency rule-based on purpose. It's fast, free, and predictable, but rules can miss wording nobody planned for. 'Nobody on our team can log in' slipped through until I added it."

**1:46 · What's next**
"Next, I'd move the AI key to a secure server, let the AI suggest urgency with the rules as a safety net, and let agents fix mistakes with one click. Thanks."

---

## If you run long

Cut in this order until you're under 2:00:
1. "A thank-you note ranked higher."
2. "If the AI is down, the app says so."
3. In "What's next," keep only the secure-server point.

## Words the CEO (or your coach) might ask about

- **Rule-based:** the app follows fixed if-then rules I wrote ("if it says 'down,' it's High") instead of asking the AI. Fast and predictable, but only as smart as the rules.
- **API key:** the password the app uses to talk to the AI. Right now it's visible in the browser, which is why moving it to a server is my first "next."
- **Fallback:** what the app does when the AI doesn't answer. Before, it hid that. Now it labels the result "keyword estimate."
