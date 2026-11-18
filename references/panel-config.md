# panel.json

The tally script reads `<panel-dir>/panel.json`. Example:

```json
{
  "product": "Kiln & Co.",
  "currency": "GBP",
  "unit": "class",
  "per_segment": 25,
  "segments": {
    "A": "Hobby regulars",
    "B": "Young professionals nearby",
    "C": "Mainstream residents",
    "D": "Buys for others"
  },
  "target_segments": ["A", "B", "D"],
  "trial_decision": "taster",
  "commitment_decisions": ["six_week_course", "membership"],
  "price_points": [30, 35, 40, 45, 50],
  "rounds": {
    "r1": { "commitment_decisions": ["course"] }
  }
}
```

| Field | Meaning |
|---|---|
| `product`, `currency`, `unit` | Used in headings. `unit` is what one price answer refers to. |
| `per_segment` | How many people each segment file should hold (default 25). The script warns on any other count. |
| `segments` | Segment id → short label. The script expects one file per id: `<round>-<id>.json`. |
| `target_segments` | The segments you're aiming at. The script reports them together as "Target" and the rest as "Not targeted". Leave out to treat everyone as target. |
| `trial_decision` | The `decision_list` value for a first visit or trial, if there is one. The script reports whether those people would continue. |
| `commitment_decisions` | The `decision_list` values that count as a real commitment: packs, courses, plans, annual contracts. |
| `price_points` | Prices to report "share who'd call it too expensive" at. Use your actual prices and a few nearby. |
| `rounds` | Optional per-round overrides, for when a round renamed its options. Any top-level field can be overridden. |
