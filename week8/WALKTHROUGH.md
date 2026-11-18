# Week 8 assessments: 20-minute finish plan

Everything is built and checked. The only thing left is you recording the Loom, then submitting all three.

| Assessment | Status | What you submit |
|---|---|---|
| 03 Technical | ✅ Done, pushed, re-tested Nov 18 (37/37 tests, 12/12 live AI) | GitHub link + short summary (below) |
| 04 Business | ✅ Done | Paste from `business-assessment.md` |
| 05 Professional | 🎥 Needs your recording | Loom link |

---

## 0–5 min · Set up

- [ ] Turn on **Do Not Disturb** (Mac + phone)
- [ ] Close every tab and app you don't need (especially anything showing your `.env.local` or API key)
- [ ] Open `week8/loom-script.md` on your phone or a second screen, so you can read it without looking away from the camera
- [ ] Open `week8/relay-triage-loom.mp4` in QuickTime. Don't press play yet.
- [ ] Good light on your face, camera at eye level

---

## 5–10 min · Practice once

The instructions ask you to practice at least once before recording.

1. Play the video and read the script out loud along with it.
2. Notice where you fall behind. Each slide changes right when its line should start.
3. If you run long, use the "If you run long" cuts at the bottom of the script.

---

## 10–15 min · Record (pick one way)

### Option A: Loom with your camera (recommended)
This is what the instructions ask for: your face on camera, with eye contact.

1. Open Loom → **Screen + Camera** → pick the **QuickTime window**
2. Make the camera bubble medium-size, bottom corner
3. Start recording → in QuickTime press **Play** → read the script
4. One take is fine. Small mistakes are fine, just keep talking.
5. Stop when the video ends at 2:00

### Option B: voice only, I merge it (same as Sharnetta's videos)
Use this if you can't be on camera today.

1. QuickTime → **File → New Audio Recording** → record yourself reading the script while the video plays
2. Save it into the `week8` folder, then tell me. I'll merge your voice with the video and re-time the slides to match.
3. Upload the merged MP4 to Loom (**New video → Upload**).

Note: Option B has no face on camera, and the tips mention eye contact. If you can, use Option A.

---

## 15–20 min · Share and submit

### 05 Professional
- [ ] In Loom, rename it: **Relay AI: Customer Inbox Triage Improvements**
- [ ] **Share** → set to **Anyone with the link can view** → **Copy link**
- [ ] Open the link in a private/incognito window to make sure it plays
- [ ] Paste the link into Professional Assessment → **Submit Assessment**

### 04 Business
- [ ] Open `week8/business-assessment.md`
- [ ] Copy the **Problem statement**, **Solution statement**, and the **5 bullets** into the box → **Submit Assessment**
- [ ] The instructions say "do your own thinking first." The ideas are yours from your Sep 29 testing, but change any wording that doesn't sound like you.

### 03 Technical
Paste this (it's ready to go):

```
Repo: https://github.com/Tainobuilds/l2assessment
Write-up: https://github.com/Tainobuilds/l2assessment/blob/main/WRITEUP.md

I forked, ran, and tested Customer Inbox Triage with the sample messages plus my own (outages, double charges, lockouts, feature ideas). The top 3 problems:

1. Urgency was scored by how a message was written, not what it said. "Our production server is down" came back Low.
2. AI categorization was unreliable (7/12 correct) and failed silently, showing keyword guesses as if they were AI answers.
3. Recommended actions were wrong and ignored urgency. Every technical issue, even an outage, got "restart your browser."

I implemented all three, starting with urgency because burying emergencies had the biggest business impact. Results: urgency tests 5/22 → 24/24, AI category accuracy 7/12 → 12/12 (same answer every run), and the app no longer crashes without an API key. I also found that the original AI model had been retired, so every AI call was failing, and switched to a current one. 37 automated tests, all passing.
```

---

## If something goes wrong

- **Loom won't record the QuickTime window:** choose **Full Screen** instead, and make QuickTime full screen.
- **Video is over 2:00:** that's okay if it's a few seconds over. If it's more, re-record using the "If you run long" cuts.
- **Coach asks how to run it:** `npm install`, add a Groq key to `.env.local`, `npm run dev`, then `npm test`. These steps are in the write-up.
