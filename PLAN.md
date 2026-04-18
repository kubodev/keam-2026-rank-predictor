Overview
Build a single-page visually (not a single file) React web app called "KEAM Compass" — a KEAM 2026 Normalized Marks Calculator + Rank Predictor. It must be a polished, multi-step tool with a premium, editorial feel (partially dark theme)— not a generic form dump. Think of the visual language of a high-quality data journalism piece crossed with a Kerala-anchored identity. Use warm saffron-amber tones, deep navy, and cream whites. Typography: pair "Playfair Display" (headings) with "DM Sans" (body/UI). The background should have a very subtle geometric or noise texture. Avoid purple gradients, Inter font, and any generic "SaaS dashboard" aesthetics.

App Flow — 3 Stages (Step Wizard)
Render a progress indicator at the top showing the user's position: Step 1 → Step 2 → Step 3. Each step slides in smoothly with a transition animation. Never show all steps at once.

STEP 1 — Normalized Marks Calculator
Purpose
Calculate the candidate's Standardized Score out of 300 using the KEAM 2026 normalization formula.
UI Design

A clean multi-section form card with labeled sections
Soft animated number counters for calculated outputs
Each subject gets its own mini-card with an input + live result preview

Inputs Required
Section A — KEAM Entrance Exam Score

first a single input bar for entering Keam score (out of 600)
or add toggle (advanced)
Number of correct answers in Paper I (Physics & Chemistry — max 75 questions, +4 per correct, −1 per wrong)
Number of wrong answers in Paper I
Number of correct answers in Paper II (Mathematics — max 75 questions)
Number of wrong answers in Paper II
Show live calculated raw KEAM score as the user types
Formula: KEAM Raw Score = (Correct × 4) − (Wrong × 1) — total out of 600

then =>Then normalize the KEAM score to 300: Normalized KEAM = (Raw Score / 600) × 300 

Section B — Class 12 Board Marks

Dropdown: Select your board → Kerala State HSE / CBSE / ICSE / ISC / Other
For each of the 3 subjects (Mathematics, Physics, Chemistry — or allow Chemistry to be swapped with Computer Science / Biology / Biotechnology via a toggle (only for non state boards,cbse,icse)):

"Your marks in [Subject]" — numeric input
"Your board topper's marks in [Subject]" — numeric input (the highest marks scored by any candidate under that board in that subject or choose 100 marks as default)


A tooltip/info icon explains: "CEE Kerala normalizes each subject using the board-wise topper mark. Enter the topper's mark for your board as published by CEE."

Normalization Formula (KEAM 2026 Revised Formula)
For each subject:
Normalized Subject Mark = (Your Marks / Board Topper Marks) × 100
Then apply 5:3:2 weighted ratio to compute the total standardized board score out of 300:
Weighted Maths   = Normalized Maths Score × (150/100)     → max 150
Weighted Physics = Normalized Physics Score × (90/100)    → max 90
Weighted Chem    = Normalized Chem Score × (60/100)       → max 60
Total Board Score = Weighted Maths + Weighted Physics + Weighted Chem  → out of 300
Final Index Score
KEAM Final Index = (Normalized KEAM Score) + (Total Board Score)
                 = out of 300             +  out of 300
                 = Total out of 600
Output Display (Step 1 Result Card)
Show a beautifully styled result panel with:

KEAM Entrance Score (out of 300) — with animated bar
Board Standardized Score (out of 300) — with subject breakdown (Maths / Physics / Chem)
Total Index Mark (out of 600) — large, prominent, with color-coded tier label:

550–600 → "Elite Zone 🏆"
480–549 → "Top Tier ✨"
380–479 → "Mid Tier 📈"
280–379 → "Below Average ⚠️"
Below 280 → "Needs Improvement"


A "Proceed to Rank Prediction →" CTA button


STEP 2 — Rank Predictor
Purpose
Estimate the candidate's approximate KEAM Engineering Rank based on their Total Index Mark (from Step 1) using KEAM 2025 data trends.
UI Design

A dramatic rank reveal — animated number counter rolling down to estimated rank
A horizontal rank spectrum bar showing where the candidate falls (Top 1000 … 10000 … 30000 … 60000+)
Below: college admission likelihood summary

Rank Estimation Logic (Based on KEAM 2025 Data)
Use this marks-vs-rank lookup table (interpolate between values):
Index Mark (out of 600)Estimated Rank Range590 – 6001 – 50570 – 58951 – 300550 – 569301 – 800530 – 549801 – 1,500510 – 5291,501 – 3,000490 – 5093,001 – 5,000470 – 4895,001 – 8,000450 – 4698,001 – 12,000420 – 44912,001 – 18,000390 – 41918,001 – 25,000350 – 38925,001 – 35,000300 – 34935,001 – 50,000260 – 29950,001 – 60,000Below 26060,000+
Show the midpoint of the estimated range as the primary displayed rank.
Category Adjustment

Add a simple dropdown: Reservation Category → General (SM) / EWS / OBC / SC / ST / EZ / MU / BH / LA
For SC/ST: Show a note that qualifying minimum is 40% (lower bar), and their category rank is typically 50–70% lower numerically than the general rank
For other reserved categories: Show a note that their effective rank within the category is proportionally better
(Keep this qualitative/advisory — exact category rank math is too complex to hardcode)


STEP 3 — College Predictor
Purpose
Based on the estimated rank, show which Kerala engineering colleges and branches the candidate is likely to get.
UI Design

Animated card grid, each card representing a college + branch combo
Color-coded likelihood badge: 🟢 High Chance / 🟡 Moderate / 🔴 Unlikely
Cards have the college name, location, branch, and 2025 closing rank (general)

College + Branch Cutoff Data (KEAM 2025 General Category — Closing Ranks)
Government Colleges
CollegeBranchClosing Rank (approx.)CET TrivandrumCSE750CET TrivandrumECE1,200CET TrivandrumMechanical2,500CET TrivandrumCivil3,800GEC ThrissurCSE1,800GEC ThrissurECE2,800GEC ThrissurMechanical4,500TKM KollamCSE1,900TKM KollamECE3,200TKM KollamMechanical5,000MEC KochiCSE2,200MEC KochiECE3,800GEC PalakkadCSE3,500GEC Barton HillCSE4,800GEC WayanadCSE6,500
Aided / Self-Financing Private (Top)
CollegeBranchClosing Rank (approx.)Rajagiri School of EngineeringCSE7,500FISAT AngamalyCSE9,000Saintgits KottayamECE9,500MACE KothamangalamCSE10,500LBS KasaragodCSE11,000SCMS KochiCSE13,000TOCH ErnakulamMechanical16,000KMCT CalicutCSE18,000METS MalaCSE22,000MG College IrittyCSE28,000
Likelihood Logic

If candidate's estimated rank ≤ (College Closing Rank × 0.75) → 🟢 High Chance
If rank ≤ Closing Rank → 🟡 Moderate
If rank ≤ (Closing Rank × 1.4) → 🔴 Low Chance
If rank > (Closing Rank × 1.4) → Don't show the card

Show a "Predicted Rank: ~[X]" sticky chip on the page while on Step 3.

Additional UI & UX Requirements
Overall Layout

Full-width app, max-width 900px centered
Mobile-responsive (single-column on small screens)
Top header with app name "KEAM Compass" and a small Kerala map icon or academic motif
Step wizard dots/progress bar underneath the header
Footer with disclaimer: "This tool provides estimates based on KEAM 2025 trends. Official ranks are determined by CEE Kerala. Results here are indicative only."

Animations & Interactions

Step transitions: slide-in from right when going forward, slide-in from left when going back
Numeric outputs animate with a counting-up effect on reveal
Rank reveal: dramatic 1.5s count-down animation to the estimated rank
Input fields: smooth focus highlight (amber glow)
Hover effects on college cards: lift + shadow
The Total Index Mark circle/ring animates filling up

Formula Transparency

Include a collapsible "How is this calculated?" section below Step 1 results that shows the exact math used with the candidate's own numbers substituted in — so they can verify
Use proper math notation (fraction bars, not just slashes)

Error Handling

Validate: Correct + Wrong answers cannot exceed total questions per paper
Validate: Your marks cannot exceed topper marks
Validate: No negative marks inputs
Show inline red error messages with specific guidance

Color Palette
Primary Background: #FDFAF4 (warm cream)
Card Background: #FFFFFF
Accent / CTA: #D97706 (amber)
Dark Text: #1C2B4A (deep navy)
Secondary Text: #6B7280
Success Green: #059669
Warning Yellow: #D97706
Danger Red: #DC2626
Highlight Border: #FCD34D
Typography

Headings: Google Font Playfair Display (serif, elegant)
Body & UI: Google Font DM Sans (clean, modern)

Bonus Touches

A small animated Kerala outline (SVG) in the hero header
Subtle grain texture overlay on the background (CSS noise filter or SVG feTurbulence)
The step number is displayed as a large, ghosted watermark behind each section heading
"Back" and "Recalculate" buttons available at every step


Technical Notes

All logic runs client-side only — no backend needed
State managed with React useState / useReducer OR vanilla JS objects
No localStorage required — all ephemeral within the session
Use TailwindCSS utility classes for layout, custom CSS variables for the color theme
Import Google Fonts via <link> in the <head>
Keep everything in a single file (one .jsx or one .html)


Disclaimer to Include in the App

⚠️ This tool is an unofficial estimator. Rank predictions are based on KEAM 2025 trends and published cutoff data. Actual ranks depend on the final CEE Kerala normalization process, total candidates, and difficulty factors which vary each year. Always refer to cee.kerala.gov.in for official results.

add copyright rights to kubo : https://github.com/Kubodev