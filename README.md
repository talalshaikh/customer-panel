# customer-panel

A Claude skill that tests a product pitch and its prices on a simulated panel of 100 AI customers before you spend real money.

It builds four segments of 25 people, each with a budget, habits and a reason to say no. Each person goes through the same steps:

1. They hear the pitch without prices, and say what one unit is worth to them (Van Westendorp).
2. They see the prices and decide.
3. They see a follow-up offer.
4. They say what would make it worth more.

Segment D, the people who buy for others, also answers business offers.

A script then tallies the results:
- who buys and who pays;
- the acceptable price range;
- the share who call each of your prices too expensive;
- what people compare the product to, and how that sets their price;
- objections, in their own words;
- what would make it worth more;
- comparisons across rounds.

AI customers are kinder than real ones. The results are directional: good for finding objections, buyer segments, reference prices and which offers move people. They're not a sales forecast, and they're not customer research. Confirm prices with real money.

## Install

**Claude Code**, for all your projects:

```bash
git clone https://github.com/talalshaikh/customer-panel ~/.claude/skills/customer-panel
```

To use it in one project only, clone it into `.claude/skills/customer-panel` inside that project.

**Claude.ai:** download the repo as a zip and upload it as a skill in Claude's settings.

Then ask Claude something like "run a 100 customer panel on our new pricing".

## Requirements

- **Node.js**, for `scripts/tally.js`.
- **Subagents** (Claude Code) run the four segments in parallel. Without them, Claude runs the segments one after another.
- **Tokens.** A 100-person round is a sizeable spend. Four segments of 10 is enough for a quick check.

## What's inside

| File | What it is |
|---|---|
| `SKILL.md` | The workflow Claude follows |
| `references/brief-template.md` | The brief every segment follows: calibration rules, the staged pitch, the output format |
| `references/segment-prompt.md` | The prompt for each segment's subagent, and the mid-run correction message |
| `references/panel-config.md` | The settings file for the tally script |
| `references/reading-results.md` | How to read the numbers and write up a round |
| `references/example-brief.md` | A filled-in example for a made-up pottery studio |
| `scripts/tally.js` | Checks the data and tallies a round, optionally against an earlier one |
