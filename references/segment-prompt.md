# Segment prompt

One prompt per segment, all four sent in the same message so they run in parallel. Replace each `{{…}}`. Use absolute paths, because a subagent may start in a different working directory.

```
You are running one quarter of a simulated customer panel for {{PRODUCT}}, {{ONE_LINE_DESCRIPTION}}. Read the brief first and follow it exactly, step by step{{, including the segment D business offers}}: {{ABSOLUTE_PATH_TO_BRIEF}}

Your segment is {{SEGMENT_ID}}: {{SEGMENT_DESCRIPTION}}.
Build exactly {{N}} new people, ids {{SEGMENT_ID}}01–{{SEGMENT_ID}}{{N}}, using this mix:
- Gender: {{…}}. Ages {{…}}.
- {{Nationality, region or background mix}}.
- Areas: {{neighbourhoods, plus some who commute from further away}}.
- Income: {{bands, including some lower-income people}}.
- Attitudes: {{enthusiasts, people loyal to an alternative, sceptics, too busy, …}}.
- {{One realism line, e.g. "Being a regular does not make someone a buyer. Many have a routine they love."}}

Write the JSON array to {{ABSOLUTE_PATH_TO_OUTPUT}} and validate that it parses with {{N}} items.

Do not read any other files in the panel folder. When done, reply in under 80 words: the count, how many chose each decision_list value, how many would_buy the follow-up offer, the compares_to counts, and the 3 most common objection tags.
```

## Extra lines for the buys-for-others segment

Add these after the mix:

```
For these people:
- `decision_list` is what they would buy at the listed prices, for themselves or the person they buy for. Most would try it themselves first before buying for anyone else.
- `who_pays` is usually employer, company_budget or gift.
- `b2b_interest` must be filled in, with their answer to each business offer, a realistic budget per head, and notes on what they would need (approval steps, procurement, proof of outcomes, reporting, data terms, insurance, a revenue share for venues and so on).
- Organisations have budget cycles, procurement and approval steps. Reflect them honestly: interest is not a purchase.
```

For the reply, also ask for: "how many would_buy each business offer".

## Correcting a fact mid-run

Update the brief first, then send this to every running subagent:

```
Pitch correction: {{what changed, with the exact old and new wording}}. The brief is updated. If you have not written the file yet, use the new wording. If you have, keep the same {{N}} people and their profile fields, re-run the steps the change affects for each of them, update any answers it would realistically change (most won't change much), and rewrite the file once. Then reply as originally asked, adding how many answers changed.
```
