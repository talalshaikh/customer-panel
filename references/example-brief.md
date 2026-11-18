# Example: the parts that change per product

A made-up product, to show how the template's `{{…}}` parts get filled in. Everything else in the brief stays as the template has it.

**Kiln & Co.** is a small pottery studio in Ancoats, Manchester, selling evening wheel-throwing classes. Currency GBP, unit "class".

## Segments (`segments.md`)

- **A, Hobby regulars:** already pay for creative or wellbeing classes (pottery, life drawing, yoga, climbing). 15 women, 10 men, ages 24–60, spread across south and central Manchester. Mostly £3,000–8,000 a month household income, plus 5 on less who prioritise hobbies. Being a regular does not make someone a buyer: many love the class they already have.
- **B, Young professionals nearby:** live or work within 2 miles of Ancoats. 13 women, 12 men, ages 22–40. Individual income £1,800–5,000 a month, including 4 freelancers with irregular income. Mix of people who want a screen-free hobby, people who date or socialise through activities, and people who think it's an Instagram fad.
- **C, Mainstream control:** ordinary Greater Manchester incomes (£1,500–3,500 a month household), not targeted. Jobs such as nurse, warehouse supervisor, teaching assistant, student, retail manager, bus driver. Areas include Oldham, Salford, Stockport and Wythenshawe. Include a few who would treat themselves once.
- **D, Buys for others:** 5 office or HR managers organising team socials, 4 hen and birthday party organisers, 4 gift buyers (partner, parent), 3 founders of small agencies, 3 wellbeing leads at the NHS or the council, 3 hotel or venue managers, 3 activity-voucher resellers.

## Brief parts

- **`{{MARKET}}`:** Manchester residents.
- **`{{REALISTIC_DOUBTS}}`:** "This is a new studio with only a handful of reviews. Real people raise doubts about whether they'd be any good at it, getting messy clay on their clothes, evening time after work, parking and trams in Ancoats, and whether it's worth it compared with a paint-and-sip night."
- **`{{PRICE_ANCHORS}}`:**
  - paint-and-sip night £30–40;
  - one-off pottery taster at other studios £35–55;
  - 6-week evening course at a college £150–250;
  - yoga class £10–15;
  - climbing day pass £14–18;
  - cinema £12–15;
  - spa day £60–120.
- **`{{PITCH}}`:** "Kiln & Co. teaches wheel throwing in small groups of six. Each two-hour evening class has a potter who stays at your wheel until you centre your first pot. Over six weeks you throw, trim and glaze your own set of mugs and bowls, which we fire and you take home. Aprons and clay are included. Ancoats, five minutes from the New Islington tram stop."
- **`{{HONEST_LIMITS}}`:** "It's hands-on and messy. Most people's first pots collapse. Firing takes two weeks, so you collect your pieces later."
- **`{{PRICE_LIST}}`:**
  - taster class £35;
  - single class £45;
  - six-week course £225 (£37.50 a class), which includes firing and glazing;
  - membership £89 a month for open studio plus one class.
- **`{{FOLLOW_UP_OFFER}}`:** "If you book the course within 14 days of a taster, the £35 counts towards it. Bring a friend on the course and you each pay £199." (Only offers the studio has approved.)
- **`{{COMPARES_TO_OPTIONS}}`:** `paint_and_sip | evening_college_class | fitness_class | climbing_or_activity | spa_or_treat | crafting_at_home`
- **`{{DECISION_OPTIONS}}`:** `taster | single_classes | six_week_course | membership`, with `{{TRIAL_DECISION}}` = `taster`.
- **`{{CANDIDATE_ADDITIONS}}`:** `weekend_slots | private_lessons | bring_your_own_drinks | glaze_choice_and_collection_service | date_night_classes`
- **`{{PRODUCT_SPECIFIC_TAGS}}`:** `worried_about_being_bad_at_it | messy_or_physical`
- **`{{B2B_OFFERS}}`:**
  - "[team_social] Team social: 8–16 people, 2 hours, mugs fired and posted to the office, £40 a head."
  - "[private_party] Private party: up to 12 people, BYO drinks, £420."

## How to adapt it for business-to-business

- **Segments:** A = current users of the alternative tool, B = the vertical you'll sell to first, C = companies outside your ideal customer profile, D = consultants, agencies and resellers.
- **Unit:** one seat per month, or one site per year.
- **Price anchors:** what they pay now for tools, contractors or staff time.
- **"A buy" means** they'd start a paid trial or sign an order form within the quarter.
