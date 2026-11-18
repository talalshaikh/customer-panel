#!/usr/bin/env node
// Tally one round of a simulated customer panel, optionally side by side with an earlier round.
//
// Usage: node tally.js <panel-dir> --round <prefix> [--compare <prefix>]
//
// Reads <panel-dir>/panel.json for the settings and <panel-dir>/<prefix>-<segment>.json for each
// segment's people. See references/panel-config.md for the panel.json format.
const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const out = { dir: null, round: null, compare: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--round") out.round = argv[++i];
    else if (argv[i] === "--compare") out.compare = argv[++i];
    else if (!out.dir) out.dir = argv[i];
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
if (!args.dir || !args.round) {
  console.error("Usage: node tally.js <panel-dir> --round <prefix> [--compare <prefix>]");
  process.exit(2);
}

const base = JSON.parse(fs.readFileSync(path.join(args.dir, "panel.json"), "utf8"));
// A round can override any top-level setting, e.g. when its decision options were renamed.
const configFor = round => ({ per_segment: 25, ...base, ...((base.rounds || {})[round] || {}) });

// ---------- helpers ----------
const count = (rows, get) => rows.reduce((m, r) => {
  const k = typeof get === "function" ? get(r) : r[get];
  if (k !== undefined && k !== null) m[k] = (m[k] || 0) + 1;
  return m;
}, {});
const sorted = o => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", ") || "-";
const median = a => {
  const s = a.filter(Number.isFinite).sort((x, y) => x - y);
  if (!s.length) return null;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const validVw = x => x && [x.too_cheap, x.bargain, x.getting_expensive, x.too_expensive].every(Number.isFinite) &&
  x.too_cheap < x.bargain && x.bargain < x.getting_expensive && x.getting_expensive < x.too_expensive;
const pct = (n, d) => (d ? `${Math.round((100 * n) / d)}%` : "-");

function load(round) {
  const cfg = configFor(round);
  const rows = [], problems = [];
  for (const seg of Object.keys(cfg.segments)) {
    const f = path.join(args.dir, `${round}-${seg}.json`);
    if (!fs.existsSync(f)) { problems.push(`missing file ${path.basename(f)}`); continue; }
    let data;
    try { data = JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { problems.push(`${path.basename(f)} does not parse: ${e.message}`); continue; }
    if (!Array.isArray(data)) { problems.push(`${path.basename(f)} is not an array`); continue; }
    if (data.length !== cfg.per_segment) problems.push(`${path.basename(f)} has ${data.length} people, expected ${cfg.per_segment}`);
    data.forEach(r => { r.segment = r.segment || seg; rows.push(r); });
  }
  const ids = count(rows, "id");
  Object.entries(ids).filter(([, n]) => n > 1).forEach(([id]) => problems.push(`duplicate id ${id}`));
  const required = ["id", "decision_list", "vw_before_prices", "follow_up", "compares_to", "objection_tag"];
  for (const r of rows) {
    const missing = required.filter(k => r[k] === undefined);
    if (missing.length) problems.push(`${r.id || "?"} is missing ${missing.join(", ")}`);
    else if (!validVw(r.vw_before_prices)) problems.push(`${r.id}: price answers are not four rising numbers`);
  }
  return { cfg, rows, problems };
}

const isBuyer = r => r.decision_list && r.decision_list !== "none";

function groupsFor(cfg) {
  const segs = Object.keys(cfg.segments), target = cfg.target_segments || segs;
  const groups = segs.map(s => ({ key: s, label: `${s} ${cfg.segments[s]}`, pick: r => r.segment === s }));
  if (target.length && target.length < segs.length) {
    groups.push({ key: "TARGET", label: `Target (${target.join("+")})`, pick: r => target.includes(r.segment) });
    groups.push({ key: "OTHERS", label: "Not targeted", pick: r => !target.includes(r.segment) });
  }
  groups.push({ key: "ALL", label: "Everyone", pick: () => true });
  return groups;
}

// Van Westendorp: the four cumulative curves, their crossings, and the share who call each price too expensive.
function vw(rows) {
  const v = rows.map(r => r.vw_before_prices).filter(validVw), n = v.length;
  if (!n) return { n: 0 };
  const at = p => ({
    tooCheap: v.filter(x => x.too_cheap >= p).length / n,
    cheap: v.filter(x => x.bargain >= p).length / n,
    expensive: v.filter(x => x.getting_expensive <= p).length / n,
    tooExp: v.filter(x => x.too_expensive <= p).length / n,
  });
  const lo = Math.min(...v.map(x => x.too_cheap)), hi = Math.max(...v.map(x => x.too_expensive));
  const steps = 4000, step = (hi - lo) / steps || 1;
  // First price where the difference changes sign; a tied stretch reports its midpoint.
  const cross = f => {
    let prevSign = 0, zeroStart = null;
    for (let i = 0; i <= steps; i++) {
      const p = lo + i * step, s = Math.sign(f(at(p)));
      if (s === 0) { if (zeroStart === null) zeroStart = p; continue; }
      if (prevSign !== 0 && s !== prevSign) return zeroStart !== null ? (zeroStart + p - step) / 2 : p;
      prevSign = s; zeroStart = null;
    }
    return null;
  };
  return {
    n,
    PMC: cross(a => a.tooCheap - (1 - a.cheap)),
    OPP: cross(a => a.tooCheap - a.tooExp),
    IPP: cross(a => a.cheap - a.expensive),
    PME: cross(a => a.tooExp - (1 - a.expensive)),
    medians: ["too_cheap", "bargain", "getting_expensive", "too_expensive"].map(k => median(v.map(x => x[k]))),
    tooExpAt: p => at(p).tooExp,
    scale: hi,
  };
}

function money(x, scale) {
  if (x === null || x === undefined) return "-";
  return x.toLocaleString("en-US", { maximumFractionDigits: scale >= 100 ? 0 : 2 });
}

function decisionStats(rows, cfg) {
  const trial = cfg.trial_decision, commit = cfg.commitment_decisions || [];
  const fu = rows.filter(r => r.follow_up === "would_buy");
  return {
    people: rows.length,
    buy: rows.filter(isBuyer).length,
    commit: rows.filter(r => commit.includes(r.decision_list)).length,
    decisions: count(rows, "decision_list"),
    afterTrial: trial ? count(rows.filter(r => r.decision_list === trial), "continue_after_first") : {},
    followUp: fu.length,
    followUpChoice: count(fu, "follow_up_choice"),
  };
}

// ---------- report ----------
const cur = load(args.round);
const prev = args.compare ? load(args.compare) : null;
const { cfg, rows } = cur;
const unit = cfg.unit || "unit", ccy = cfg.currency || "";
const groups = groupsFor(cfg);
const prevGroup = key => {
  if (!prev) return null;
  const g = groupsFor(prev.cfg).find(x => x.key === key);
  return g ? prev.rows.filter(g.pick) : null;
};

console.log(`== ${cfg.product || "Panel"}: round ${args.round}, ${rows.length} people${prev ? ` (compared with ${args.compare}, ${prev.rows.length} people)` : ""} ==`);
for (const [label, p] of [[args.round, cur.problems], ...(prev ? [[args.compare, prev.problems]] : [])])
  console.log(p.length ? `Data problems in ${label}:\n  - ${p.join("\n  - ")}` : `Data checks passed for ${label}.`);

console.log(`\n== Decisions at list price ==`);
console.log(`buy = chose anything but none; commit = ${(cfg.commitment_decisions || []).join(" or ") || "(set commitment_decisions in panel.json)"}`);
for (const g of groups) {
  const d = decisionStats(rows.filter(g.pick), cfg);
  const pr = prevGroup(g.key), pd = pr ? decisionStats(pr, prev.cfg) : null;
  const was = (k) => (pd ? ` (${args.compare} ${pd[k]})` : "");
  const trial = cfg.trial_decision ? ` | after ${cfg.trial_decision}: yes ${d.afterTrial.yes || 0}, maybe ${d.afterTrial.maybe || 0}, no ${d.afterTrial.no || 0}` : "";
  console.log(`${g.label.padEnd(30)} buy ${d.buy}/${d.people}${was("buy")} | commit ${d.commit}${was("commit")} | follow-up would buy ${d.followUp}${was("followUp")} [${sorted(d.followUpChoice)}]`);
  console.log(`${"".padEnd(30)} ${sorted(d.decisions)}${trial}`);
}

console.log(`\n== What one ${unit} is worth, asked before prices (${ccy}) ==`);
console.log(`acceptable range = PMC to PME; optimal = OPP; indifference = IPP; medians = too cheap / bargain / getting expensive / too expensive`);
const points = cfg.price_points || [];
for (const g of groups) {
  const a = vw(rows.filter(g.pick));
  if (!a.n) continue;
  const line = (x, tag) => `${tag.padEnd(5)} acceptable ${money(x.PMC, x.scale)}–${money(x.PME, x.scale)}, optimal ${money(x.OPP, x.scale)}, indifference ${money(x.IPP, x.scale)}, medians ${x.medians.map(m => money(m, x.scale)).join(" / ")}` +
    (points.length ? ` | too expensive at ${points.map(p => `${money(p, x.scale)}: ${Math.round(100 * x.tooExpAt(p))}%`).join(", ")}` : "");
  console.log(`${g.label} (n=${a.n})`);
  console.log(`  ${line(a, args.round)}`);
  const pr = prevGroup(g.key);
  if (pr) { const b = vw(pr); if (b.n) console.log(`  ${line(b, args.compare)}`); }
}

console.log(`\n== What they compare it to, and what they would pay (${ccy} per ${unit}, medians) ==`);
const byCmp = {};
rows.forEach(r => (byCmp[r.compares_to] ||= []).push(r));
const target = cfg.target_segments || Object.keys(cfg.segments);
for (const [k, list] of Object.entries(byCmp).sort((a, b) => b[1].length - a[1].length)) {
  const v = list.map(r => r.vw_before_prices).filter(validVw), s = vw(list).scale;
  console.log(`${String(k).padEnd(26)} ${String(list.length).padStart(3)} people (${list.filter(r => target.includes(r.segment)).length} target) | bargain ${money(median(v.map(x => x.bargain)), s)}, getting expensive ${money(median(v.map(x => x.getting_expensive)), s)}, too expensive ${money(median(v.map(x => x.too_expensive)), s)} | buy ${list.filter(isBuyer).length}`);
}

console.log(`\n== Main objections ==`);
for (const g of groups) console.log(`${g.label.padEnd(30)} ${sorted(count(rows.filter(g.pick), "objection_tag"))}`);

console.log(`\n== The one addition that would raise what they'd pay (count, median extra ${ccy} per ${unit}) ==`);
for (const g of groups.filter(x => ["TARGET", "OTHERS", "ALL"].includes(x.key))) {
  const by = {};
  rows.filter(g.pick).forEach(r => (by[r.most_valuable_addition] ||= []).push(r.extra_per_unit_if_added));
  const s = Object.entries(by).filter(([k]) => k !== "undefined").sort((a, b) => b[1].length - a[1].length);
  if (s.length) console.log(`${g.label.padEnd(30)} ${s.map(([k, v]) => `${k} ${v.length} (+${money(median(v), 100)})`).join(", ")}`);
}

console.log(`\n== How the prices felt, and access ==`);
for (const g of groups) {
  const list = rows.filter(g.pick), pr = prevGroup(g.key);
  const access = list.some(r => r.access !== undefined) ? ` | access: ${sorted(count(list, "access"))}` : "";
  console.log(`${g.label.padEnd(30)} ${sorted(count(list, "price_feel"))}${pr ? ` (${args.compare}: ${sorted(count(pr, "price_feel"))})` : ""}${access}`);
}
console.log(`\nWho pays, among buyers: ${sorted(count(rows.filter(isBuyer), "who_pays"))}`);

const b2b = rows.filter(r => r.b2b_interest && typeof r.b2b_interest === "object");
if (b2b.length) {
  console.log(`\n== Buying for others (${b2b.length} people) ==`);
  const interested = b2b.filter(r => r.b2b_interest.interested);
  console.log(`interested ${interested.length}/${b2b.length}; median budget per head ${money(median(interested.map(r => r.b2b_interest.budget_per_head)), 100)} ${ccy}`);
  const offerIds = [...new Set(b2b.flatMap(r => Object.keys(r.b2b_interest.offers || {})))];
  for (const o of offerIds) {
    const c = count(b2b, r => (r.b2b_interest.offers || {})[o]);
    console.log(`  ${o}: would buy ${c.would_buy || 0}, tempted ${c.tempted_not_buy || 0}, no ${c.no || 0}`);
  }
  for (const r of b2b.filter(r => Object.values(r.b2b_interest.offers || {}).some(x => x !== "no")))
    console.log(`  ${r.id} ${r.job} [${Object.entries(r.b2b_interest.offers).map(([k, v]) => `${k} ${v}`).join(", ")}; ${money(r.b2b_interest.budget_per_head, 100)} a head]: ${r.b2b_interest.notes}`);
}

console.log(`\n== Buyers and follow-up takers ==`);
for (const r of rows.filter(r => isBuyer(r) || r.follow_up === "would_buy"))
  console.log(`${r.id} ${r.age ?? ""}${r.gender ?? ""} ${r.job ?? ""} | ${r.compares_to} | ${r.decision_list} → ${r.follow_up}/${r.follow_up_choice} | ${r.who_pays} | "${r.main_objection}"`);

console.log(`\n== First reactions (every ${Math.max(1, Math.round(rows.length / 12))}th person) ==`);
const every = Math.max(1, Math.round(rows.length / 12));
rows.filter((_, i) => i % every === 0).forEach(r => console.log(`${r.id} ${r.job ?? ""}: "${r.first_reaction}"`));
