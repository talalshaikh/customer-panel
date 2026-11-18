# Brief template

Copy everything below the line into `<panel-dir>/<round>-brief.md` and replace each `{{…}}`. Delete anything that doesn't apply, such as the `access` field for an online product, or the business offers if there's no segment D.

Filling it in:

- **`{{MARKET}}`:** who the people are and where, e.g. "Manchester residents" or "operations leads at UK logistics firms".
- **`{{REALISTIC_DOUBTS}}`:** the doubts real people would raise about this product, written as plain facts. Is it new, unreviewed, unproven? Is it far away? Does it touch privacy, comfort or cultural norms? This is what keeps the panel from being polite.
- **`{{PRICE_ANCHORS}}`:** real local prices for the things people already pay for instead. Give a range for each, in the market's currency. People only judge a price against something, and these anchors keep them from making numbers up.
- **`{{PITCH}}` and `{{HONEST_LIMITS}}`:** what the customer gets on the day they pay, in the words you'd actually use. Nothing that isn't built or approved.
- **`{{UNIT}}`:** the thing the price answers refer to: one session, one month, one seat, one box.
- **`{{PRICE_LIST}}`:** every price and package, exactly as a customer would see it.
- **`{{FOLLOW_UP_OFFER}}`:** risk reducers and launch offers the business has actually approved.
- **`{{COMPARES_TO_OPTIONS}}`:** 5–7 snake_case frames the product could be filed under, from the cheapest to the most premium.
- **`{{DECISION_OPTIONS}}`:** one snake_case value per purchasable option, e.g. `taster | single | course | membership`.
- **`{{CANDIDATE_ADDITIONS}}`:** 4–6 things you're considering adding, in snake_case.
- **`{{PRODUCT_SPECIFIC_TAGS}}`:** objections you expect for this product, e.g. `feels_like_a_gimmick`.

---

# {{PRODUCT}} simulated customer panel, round {{N}}: brief

You are simulating real {{MARKET}} hearing about a new product. Build each person first, then take them through the steps below in order, and record what they would actually do.

## Calibration rules (read twice)

- AI customer panels are known to be far too agreeable. Correct for that. Simulate how real people behave, not how they talk to a friendly interviewer.
- A "buy" means this person would pay today, with their own card (or a company card they control), if the checkout or booking link were in front of them. Curiosity, "sounds cool", "maybe one day" and "I'd try it if it were free" are NOT buys.
- Every decision must follow from the person's budget, habits, schedule, location and their "says no if". Never from the pitch's enthusiasm.
- {{REALISTIC_DOUBTS}} Some people would never consider it. Some would love it.
- Make every person distinct: different voice, length and reasoning. Some are blunt, some polite, some barely engaged. Do not converge on a template.
- Do not invent facts about {{PRODUCT}} beyond the pitch. If a person would ask something the pitch does not answer, that goes into their objection or "what would change my mind".
- {{ELIGIBILITY, e.g. "Adults 18+ only."}}

## Prices a person in this market might know (use only what fits the person's life)

{{PRICE_ANCHORS}}

## Step 1: the pitch, WITHOUT prices (show exactly this)

> {{PITCH}}
>
> **Honest limits.** {{HONEST_LIMITS}}

Record `first_reaction`, `compares_to`, and the person's four price answers for ONE {{UNIT}} (`vw_before_prices`), before they see any price.

## Step 2: the prices (show exactly this)

> **Prices{{, including tax}}**
> {{PRICE_LIST}}

Record `decision_list` and the fields that follow it.

## Step 3: the follow-up offer (show only AFTER step 2 is recorded)

> {{FOLLOW_UP_OFFER}}

Record `follow_up` and `follow_up_choice`.

## Step 4: what would make it worth more

Ask which ONE thing, if {{PRODUCT}} added it, would most increase what they'd pay, and how much extra per {{UNIT}} it would be worth to them, in {{CURRENCY}}.

## Segment {{B2B_SEGMENT}} only: offers for teams and organisations (show after step 4)

> {{B2B_OFFERS, each with an id in brackets, e.g. "[team_social] Team social: 8–16 people, 2 hours, £40 a head."}}

## Output

Write a JSON array to the file named in your task. One object per person, exactly these keys:

```json
{
  "id": "A01",
  "segment": "A",
  "name": "Full name",
  "age": 34,
  "gender": "F",
  "nationality": "Nationality, region or background, whichever matters in this market",
  "area": "Where they live",
  "job": "Job title and kind of employer",
  "household_income_month": 0,
  "category_spend_month": 0,
  "habits": "One or two sentences: routine, what they spend on, free time",
  "tech_comfort": "low | medium | high",
  "says_no_if": "Their personal deal-breaker, decided BEFORE seeing the pitch",
  "first_reaction": "Their honest first reaction to the pitch, in their own voice",
  "compares_to": "{{COMPARES_TO_OPTIONS}} | nothing",
  "vw_before_prices": { "too_cheap": 0, "bargain": 0, "getting_expensive": 0, "too_expensive": 0 },
  "decision_list": "none | {{DECISION_OPTIONS}}",
  "continue_after_first": "yes | maybe | no | n/a",
  "follow_up": "would_buy | tempted_not_buy | no",
  "follow_up_choice": "none | {{FOLLOW_UP_CHOICES}}",
  "main_objection": "Their main hesitation, in their own voice (or the main reason they bought)",
  "objection_tag": "price | doubts_it_works | need_reviews_or_proof | data_privacy | time_or_access | not_for_me | prefer_current_alternative | cultural_or_religious | {{PRODUCT_SPECIFIC_TAGS}} | none",
  "what_would_change_mind": "What would move them one step further",
  "most_valuable_addition": "{{CANDIDATE_ADDITIONS}} | none",
  "extra_per_unit_if_added": 0,
  "who_pays": "self | employer | company_budget | gift | n/a",
  "price_feel": "cheap_for_what_it_is | fair | premium_but_worth_it | too_expensive",
  "access": "plus | fine | inconvenient | deal_breaker",
  "b2b_interest": null
}
```

- Money fields are in {{CURRENCY}}. `household_income_month` and `category_spend_month` are monthly; `category_spend_month` is what they spend now on {{CATEGORY, e.g. "classes and hobbies"}}.
- `compares_to` is what the person mentally files this under when judging the price, from the pitch alone.
- `vw_before_prices` is for ONE {{UNIT}}, answered before seeing any price: so cheap they'd doubt the quality, a bargain, getting expensive but they'd still consider it, so expensive they'd never consider it. Everyone answers, buyers or not. The four numbers must rise in that order.
- `continue_after_first` is only for people whose decision is `{{TRIAL_DECISION}}`; everyone else gets "n/a".
- `follow_up_choice` is "none" unless `follow_up` is "would_buy".
- `access` is how the location or the way it's delivered fits their life.
- `b2b_interest` stays null except in segment {{B2B_SEGMENT}}, where it is `{ "interested": true/false, "offers": { {{"<offer id>": "would_buy | tempted_not_buy | no"}} }, "budget_per_head": number, "notes": "What they'd need: approvals, procurement, proof, reports, data terms, timing" }`.

Validate the file before finishing: `node -e "const a=require('<file>'); console.log(a.length)"`.
