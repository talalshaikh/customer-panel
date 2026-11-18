---
name: customer-panel
description: Test a product idea, pitch, price or offer on a simulated panel of 100 AI customers before spending real money. Builds realistic people in four segments (each with a budget, habits and a reason to say no), pitches them in stages, asks what one unit is worth before showing prices (Van Westendorp), then shows prices and offers, and tallies who buys, what they'd pay, what they compare it to, why they say no and what would change their mind. Use whenever someone wants to test a business idea, pricing, packages, a launch offer or a pitch on fake, synthetic or simulated customers ("100 customer panel", "consumer panel", "focus group", "personas", "would people pay X", "who would buy this", "willingness to pay"), or wants to re-run a panel after the product, pitch or prices changed and compare rounds, even if they don't say "panel".
---

# Customer panel

Put a pitch and its prices in front of 100 simulated customers, in four segments of 25, in the order a careful researcher would. The result shows:
- who buys, and who pays;
- what one unit is worth to them before they see your prices;
- what they compare the product to;
- their objections, in their own words;
- which offers move them;
- what would make it worth more.

## What it's for, and what it isn't

AI customers are kinder than real ones, even with the calibration rules in the brief. Use the panel to find, quickly and cheaply:

- **Objections** and the words people use for them.
- **Which segment buys, and who pays.** The best buyers are often people spending someone else's money: office managers, HR, gift buyers.
- **Reference prices.** The price people have in their heads, and what sets it.
- **What moves people.** Which offers and packages work, and which additions would raise what they'd pay.

Don't treat buy rates as a sales forecast. Don't present the panel as customer research. Prices are confirmed with real money: deposits, pre-sales, a paid pilot.

## Workflow

1. Gather the facts
2. Design the segments
3. Write the brief and `panel.json`
4. Confirm the pitch with the user
5. Run the four segments
6. Tally
7. Report
8. Next round

### 1. Gather the facts

You need:
- the product as customers will get it on the day they'd pay;
- the prices, packages and offers;
- the market (place, currency, who the customer is);
- how and where it's delivered;
- realistic local prices for the alternatives people already pay for.

**Check the real product when you can** (code, live site, docs, screenshots), not only the marketing copy. The people react to the words you give them, so a pitch that promises unbuilt features measures a product that doesn't exist. Write an "honest limits" paragraph saying what it isn't and what's unproven. Real customers think of those things anyway, and a pitch without them gets kinder answers than reality will.

**Ask the user what the panel must not be offered:** discounts they won't give, refunds or guarantees they haven't approved, claims they can't make. Never invent an offer. Results about an offer the business can't honour are useless.

### 2. Design the segments

The default is three target segments and one control:

| | Segment | Why |
|---|---|---|
| A | **Category regulars**: already pay for the alternatives | The obvious buyers; they show whether you beat what they already do |
| B | **The first audience you can actually reach**: near the venue, or the community or channel you'll market to first | Your real launch market |
| C | **Mainstream control**: ordinary incomes, not targeted | Shows whether targeting matters at all |
| D | **Buys for others**: HR and office managers, founders buying perks, coaches or venues who'd resell, gift buyers | They spend someone else's money and are often the best buyers. They also answer the business offers |

For a business-to-business product, segment by company type and role. The control becomes companies outside your ideal customer profile, and D becomes resellers, consultants and partners.

**Give each segment a written quota mix:**
- gender and age range;
- nationality, region or background, whichever matters in that market;
- neighbourhoods;
- income bands, including some lower-income people even in target segments;
- attitudes: enthusiasts, people loyal to an alternative, sceptics, people who are too busy.

Quotas stop a subagent from drifting into one stereotype. End each segment with one realism line, such as "Being a regular does not make someone a buyer." Save the mixes in `segments.md`, so the next round uses the same mix with new people.

### 3. Write the brief and `panel.json`

Copy `references/brief-template.md` into the panel folder as `<round>-brief.md` and fill it in. `references/example-brief.md` shows a filled-in brief for a made-up product.

All four subagents follow this one document, so every person answers the same questions in the same order. The order is the method:

1. **The pitch without prices.** Record the first reaction, what they compare it to, and four prices for one unit: too cheap, a bargain, getting expensive, too expensive. Asking before prices avoids anchoring. If people see your prices first, their answers cluster around your numbers and you learn little.
2. **The prices**, then their decision.
3. **The follow-up offer**, shown only after the decision is recorded: risk reducers, a launch or founding price. This separates the list-price decision from what the offer adds.
4. **"Which one addition would most raise what you'd pay, and by how much?"** This ranks what to build next.
5. **Business offers**, for segment D only.

Choose the `compares_to` options carefully. Include both the cheap frames the product could fall into and the premium ones. This is often the most useful field, because what people compare a product to sets their price ceiling more than its features do.

Then write `panel.json` for the tally script. `references/panel-config.md` explains the fields.

### 4. Confirm the pitch with the user

Show the user exactly what the people will see: the pitch, prices, follow-up offer, business offers and the segment mixes. Say what it costs. A 100-person round is four subagents each writing long JSON, a sizeable token spend. Four segments of 10 is enough for a quick check.

Wait for a yes. Users know facts you don't, and a correction now is cheap. Midway through the run it costs a re-run.

### 5. Run the four segments

**With subagents (Claude Code):**
- Launch four general-purpose subagents in one message, in the background.
- Each gets the prompt from `references/segment-prompt.md`, builds its people and writes `<round>-<segment>.json`.
- Tell them not to read other files in the panel folder. This keeps the segments independent and stops earlier rounds from leaking in.
- Wait for the completion notifications; don't poll.

**If the user corrects a fact mid-run:** update the brief, then message every running subagent with these instructions:
- keep the same people and profile fields;
- re-run only the affected steps with the corrected text;
- rewrite the file once;
- say how many answers changed.

That's far cheaper than restarting.

**Without subagents:** run the segments one after another yourself, writing each file before starting the next. The segments are less independent this way, so build each segment's people from its quota mix before rereading the pitch.

### 6. Tally

```bash
node <this-skill-dir>/scripts/tally.js <panel-dir> --round r2 --compare r1
```

`--compare` is optional. The script checks the data first and lists problems:
- a missing file or the wrong head count;
- duplicate ids;
- missing keys;
- price answers that don't rise in order.

Ask the segment's subagent to fix its file, or regenerate it, rather than editing people's answers yourself.

### 7. Report

Read `references/reading-results.md` before writing the report. In short:
1. Lead with the answer to the decision the user faces.
2. Back it with a small table across rounds, a few quotes in the people's own words, and a recommendation.
3. End with the caveat and the real-money test that would confirm it.

Use plain language, and explain terms like Van Westendorp the first time.

### 8. Next round

Re-run when the product, pitch, prices or offers change.
- **Change one main thing per round** when you can, so a difference can be traced to its cause.
- **Use new people each round, with the same mix.** People who already heard the old pitch would remember it.
- **New people add noise.** Small differences between rounds mean nothing. See "Noise" in `references/reading-results.md`.

## Files

```
<panel-dir>/
├── panel.json        settings for the tally script
├── segments.md       the quota mix per segment, reused every round
├── r1-brief.md       the exact brief for round 1
├── r1-A.json … r1-D.json
├── r2-brief.md
└── r2-A.json … r2-D.json
```

Keep the panel somewhere that survives the session; ask the user, and suggest `research/customer-panel/` in their project. The people are fictional, but the briefs hold unreleased prices and plans, so keep the folder out of public places unless the user says otherwise.

## Sharing results

Panel results are for internal decisions.
- **For investors or partners:** label them "simulated AI customer panel, directional".
- **Never call it a survey or customer research.**
- **Never use the people's quotes as testimonials or in marketing.**
